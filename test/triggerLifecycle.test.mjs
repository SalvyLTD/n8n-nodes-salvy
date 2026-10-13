// Webhook lifecycle (checkExists / create / delete) and loadOptions tests for the
// Salvy Trigger, against an in-process fake of the Salvy API that implements the
// webhook-endpoints contract. Runs against the built output (`npm test`).

import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { after, before, beforeEach, test } from 'node:test';

const require = createRequire(import.meta.url);
const { SalvyTrigger } = require('../dist/nodes/SalvyTrigger/SalvyTrigger.node.js');

const EVENT_TYPES = [
	{ name: 'phone-account.activated', description: 'A phone account was activated' },
	{ name: 'asset-statement.signed', description: null },
];

// --- fake Salvy API ----------------------------------------------------------
let endpoints;
let calls;
let failNext; // force one non-contract error response
const server = createServer((req, res) => {
	let raw = '';
	req.on('data', (c) => (raw += c));
	req.on('end', () => {
		calls.push(`${req.method} ${req.url}`);
		const send = (status, body) => {
			res.writeHead(status, body === undefined ? {} : { 'content-type': 'application/json' });
			res.end(body === undefined ? undefined : JSON.stringify(body));
		};
		if (req.headers.authorization !== 'Bearer test-key')
			return send(401, { message: 'unauthorized' });
		if (failNext) {
			const status = failNext;
			failNext = undefined;
			return send(status, { message: 'boom' });
		}
		if (req.method === 'GET' && req.url === '/api/v3/webhook-event-types') {
			return send(200, { data: EVENT_TYPES });
		}
		if (req.method === 'POST' && req.url === '/api/v3/webhook-endpoints') {
			const { url, eventTypes, description } = JSON.parse(raw);
			if (!url?.startsWith('https://')) return send(422, { message: 'url must be https' });
			if (!eventTypes?.length || new Set(eventTypes).size !== eventTypes.length)
				return send(422, { message: 'eventTypes must be non-empty and unique' });
			const unknown = eventTypes.find((e) => !EVENT_TYPES.some((t) => t.name === e));
			if (unknown) return send(422, { message: `unknown event type: ${unknown}` });
			const ep = {
				id: `ep_${randomBytes(6).toString('hex')}`,
				url,
				eventTypes,
				description: description ?? null,
				disabled: false,
				createdAt: new Date().toISOString(),
				secret: `whsec_${randomBytes(24).toString('base64')}`,
			};
			endpoints.set(ep.id, ep);
			return send(201, ep);
		}
		const m = req.url.match(/^\/api\/v3\/webhook-endpoints\/([^/]+)$/);
		if (m) {
			const ep = endpoints.get(decodeURIComponent(m[1]));
			if (!ep) return send(404, { message: 'not found' });
			if (req.method === 'GET') {
				const { secret: _secret, ...rest } = ep;
				return send(200, rest);
			}
			if (req.method === 'DELETE') {
				endpoints.delete(ep.id);
				return send(204);
			}
		}
		return send(404, { message: 'no route' });
	});
});
let base;

// --- minimal n8n context -------------------------------------------------------
function context({
	eventTypes,
	staticData,
	webhookUrl = 'https://n8n.example.com/webhook/abc/webhook',
}) {
	return {
		getNode: () => ({
			name: 'Salvy Trigger',
			type: 'salvyTrigger',
			typeVersion: 1,
			parameters: {},
		}),
		getWorkflow: () => ({ id: 'wf1', name: 'Test workflow', active: true }),
		getWorkflowStaticData: () => staticData,
		getNodeWebhookUrl: () => webhookUrl,
		getNodeParameter: (name) => ({ eventTypes })[name],
		helpers: {
			// Same contract as n8n's helper for the options the node uses.
			async httpRequestWithAuthentication(credentialType, options) {
				assert.equal(credentialType, 'salvyApi');
				const url = options.url.replace('https://api.salvy.com.br', base);
				const res = await fetch(url, {
					method: options.method,
					headers: {
						authorization: 'Bearer test-key',
						...(options.body ? { 'content-type': 'application/json' } : {}),
					},
					body: options.body ? JSON.stringify(options.body) : undefined,
				});
				const text = await res.text();
				const body = text ? JSON.parse(text) : '';
				assert.equal(options.returnFullResponse, true);
				assert.equal(options.ignoreHttpStatusErrors, true);
				return { statusCode: res.status, body, headers: {} };
			},
		},
	};
}

const node = new SalvyTrigger();
const hooks = node.webhookMethods.default;
const EVENTS = ['phone-account.activated', 'asset-statement.signed'];

before(async () => {
	await new Promise((r) => server.listen(0, '127.0.0.1', r));
	base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
beforeEach(() => {
	endpoints = new Map();
	calls = [];
	failNext = undefined;
});

test('loadOptions lists event types with descriptions, sorted', async () => {
	const options = await node.methods.loadOptions.getEventTypes.call(context({ staticData: {} }));
	assert.deepEqual(options, [
		{ name: 'asset-statement.signed', value: 'asset-statement.signed', description: undefined },
		{
			name: 'phone-account.activated',
			value: 'phone-account.activated',
			description: 'A phone account was activated',
		},
	]);
	assert.deepEqual(calls, ['GET /api/v3/webhook-event-types']);
});

test('full lifecycle: checkExists (none) -> create -> checkExists (200) -> delete', async () => {
	const staticData = {};
	const ctx = context({ eventTypes: EVENTS, staticData });

	assert.equal(await hooks.checkExists.call(ctx), false);
	assert.deepEqual(calls, [], 'no API call without a stored endpoint id');

	assert.equal(await hooks.create.call(ctx), true);
	assert.match(staticData.endpointId, /^ep_/);
	assert.match(staticData.endpointSecret, /^whsec_/);
	const created = endpoints.get(staticData.endpointId);
	assert.equal(created.url, 'https://n8n.example.com/webhook/abc/webhook');
	assert.deepEqual(created.eventTypes, EVENTS);
	assert.equal(created.description, 'n8n workflow "Test workflow"');

	assert.equal(await hooks.checkExists.call(ctx), true);

	assert.equal(await hooks.delete.call(ctx), true);
	assert.equal(endpoints.size, 0);
	assert.deepEqual(staticData, {});
	assert.deepEqual(
		calls.map((c) => c.split(' ')[0]),
		['POST', 'GET', 'DELETE'],
	);
});

test('checkExists returns false and clears state on 404', async () => {
	const staticData = { endpointId: 'ep_gone', endpointSecret: 'whsec_AAAA' };
	assert.equal(await hooks.checkExists.call(context({ eventTypes: EVENTS, staticData })), false);
	assert.deepEqual(staticData, {});
	assert.deepEqual(calls, ['GET /api/v3/webhook-endpoints/ep_gone']);
});

test('checkExists replaces an endpoint registered with other events or URL', async () => {
	const staticData = {};
	await hooks.create.call(context({ eventTypes: EVENTS, staticData }));
	const oldId = staticData.endpointId;

	const changed = context({ eventTypes: ['phone-account.activated'], staticData });
	assert.equal(await hooks.checkExists.call(changed), false);
	assert.equal(endpoints.has(oldId), false, 'outdated endpoint deleted, not leaked');
	assert.deepEqual(staticData, {});

	await hooks.create.call(changed);
	const moved = context({
		eventTypes: ['phone-account.activated'],
		staticData,
		webhookUrl: 'https://other/hook',
	});
	assert.equal(await hooks.checkExists.call(moved), false);
	assert.equal(endpoints.size, 0);
});

test('event type order does not matter for checkExists', async () => {
	const staticData = {};
	await hooks.create.call(context({ eventTypes: EVENTS, staticData }));
	const reversed = context({ eventTypes: [...EVENTS].reverse(), staticData });
	assert.equal(await hooks.checkExists.call(reversed), true);
});

test('delete treats 404 as already deleted, and is a no-op without state', async () => {
	const staticData = { endpointId: 'ep_gone', endpointSecret: 'whsec_AAAA' };
	assert.equal(await hooks.delete.call(context({ eventTypes: EVENTS, staticData })), true);
	assert.deepEqual(staticData, {});
	calls = [];
	assert.equal(await hooks.delete.call(context({ eventTypes: EVENTS, staticData })), true);
	assert.deepEqual(calls, []);
});

test('create surfaces API validation errors (422) as NodeApiError', async () => {
	const staticData = {};
	await assert.rejects(
		hooks.create.call(context({ eventTypes: ['nope.unknown'], staticData })),
		(err) => {
			assert.equal(err.name, 'NodeApiError');
			assert.equal(err.httpCode, '422');
			return true;
		},
	);
	await assert.rejects(
		hooks.create.call(
			context({ eventTypes: EVENTS, staticData, webhookUrl: 'http://localhost:5678/webhook/x' }),
		),
		(err) => err.httpCode === '422',
	);
	assert.deepEqual(staticData, {});
});

test('unexpected statuses on checkExists / delete / loadOptions raise NodeApiError', async () => {
	const staticData = { endpointId: 'ep_x', endpointSecret: 'whsec_AAAA' };
	const ctx = context({ eventTypes: EVENTS, staticData });
	failNext = 500;
	await assert.rejects(hooks.checkExists.call(ctx), (err) => err.httpCode === '500');
	failNext = 500;
	await assert.rejects(hooks.delete.call(ctx), (err) => err.httpCode === '500');
	assert.equal(staticData.endpointId, 'ep_x', 'state kept when delete fails, so it can be retried');
	failNext = 503;
	await assert.rejects(
		node.methods.loadOptions.getEventTypes.call(ctx),
		(err) => err.httpCode === '503',
	);
});
