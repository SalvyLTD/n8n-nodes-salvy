// Get Many (list) operations, executed by n8n's real declarative engine against a
// fake Salvy API (see routingHarness.mjs). Assertions are on the HTTP requests
// the engine actually sent, every page included. Runs against the built output
// (`npm test`).

import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { queryValues, runSalvy, startFakeApi } from './routingHarness.mjs';

let api;
before(async () => {
	api = await startFakeApi();
});
after(() => api.close());
beforeEach(() => {
	api.requests.length = 0;
	api.setTotal(5);
});

describe('Return All carries the filters onto every page', () => {
	const cases = [
		{
			resource: 'phoneAccount',
			path: '/api/v3/phone-accounts',
			filters: {
				productType: ['mobile'],
				status: ['active', 'blocked'],
				phoneNumber: '+5541999887766',
			},
			expected: {
				productType: ['mobile'],
				status: ['active', 'blocked'],
				phoneNumber: ['+5541999887766'],
			},
		},
		{
			resource: 'employee',
			path: '/api/v3/employees',
			filters: { status: ['active'] },
			expected: { status: ['active'] },
		},
	];
	for (const { resource, path, filters, expected } of cases) {
		test(`${resource}: pages 1..3 all keep the filters`, async () => {
			api.setTotal(450);
			const items = await runSalvy(api.baseUrl, {
				resource,
				operation: 'getAll',
				returnAll: true,
				filters,
			});
			assert.equal(items.length, 450);
			assert.equal(api.requests.length, 3);
			api.requests.forEach((request, i) => {
				assert.equal(request.path, path);
				assert.deepEqual(queryValues(request, 'page'), [String(i + 1)], `page on request ${i + 1}`);
				assert.deepEqual(queryValues(request, 'pageSize'), ['200']);
				for (const [name, values] of Object.entries(expected)) {
					assert.deepEqual(queryValues(request, name), values, `${name} on page ${i + 1}`);
				}
			});
		});
	}
});

describe('Limit sends page exactly once and never paginates', () => {
	const filters = { productType: ['mobile'], status: ['active'] };
	// The AI-tool variant and expression mode set Return All through an
	// expression; n8n then shows Limit too, so both fields' routing applies.
	const limitModes = [
		['a literal false', false, 2],
		['an expression resolving to false', '={{ false }}', 2],
		['an expression resolving to the string "false"', '={{ "false" }}', 2],
		['an expression, with Limit also an expression', '={{ false }}', '={{ 3 }}'],
	];
	for (const [label, returnAll, limit] of limitModes) {
		test(`Return All as ${label}`, async () => {
			api.setTotal(450);
			const items = await runSalvy(api.baseUrl, {
				resource: 'phoneAccount',
				operation: 'getAll',
				returnAll,
				limit,
				filters,
			});
			const expected = typeof limit === 'number' ? limit : 3;
			assert.equal(api.requests.length, 1, 'one request');
			const [request] = api.requests;
			assert.deepEqual(queryValues(request, 'page'), ['1']);
			assert.deepEqual(queryValues(request, 'pageSize'), [String(expected)]);
			assert.deepEqual(queryValues(request, 'productType'), ['mobile']);
			assert.deepEqual(queryValues(request, 'status'), ['active']);
			assert.equal(items.length, expected);
		});
	}

	for (const returnAll of ['={{ true }}', '={{ "true" }}']) {
		test(`Return All as an expression (${returnAll}) pages with pageSize 200 and is not capped by Limit`, async () => {
			api.setTotal(450);
			const items = await runSalvy(api.baseUrl, {
				resource: 'phoneAccount',
				operation: 'getAll',
				returnAll,
				filters,
			});
			assert.equal(items.length, 450);
			assert.equal(api.requests.length, 3);
			api.requests.forEach((request, i) => {
				assert.deepEqual(queryValues(request, 'page'), [String(i + 1)]);
				assert.deepEqual(queryValues(request, 'pageSize'), ['200']);
				assert.deepEqual(queryValues(request, 'productType'), ['mobile']);
			});
		});
	}
});
