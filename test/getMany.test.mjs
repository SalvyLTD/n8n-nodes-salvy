// Get Many (list) operations, executed by n8n's real declarative engine against a
// fake Salvy API (see routingHarness.mjs). Assertions are on the HTTP requests
// the engine actually sent, every page included. Runs against the built output
// (`npm test`).

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
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

describe('enum fields are selectable and list their API values', async () => {
	const require = createRequire(import.meta.url);
	const spec = require('../openapi/salvy-v3.json');
	const { properties } = require('../dist/nodes/Salvy/Salvy.properties.generated.js');
	const { OPERATIONS } = await import('../scripts/salvy-operations.mjs');

	// Allowed values of a spec schema, or undefined when it also takes free text.
	const enumValuesOf = (schema) => {
		const variants = (schema.anyOf ?? [schema]).filter((v) => v.type !== 'null');
		const values = [];
		for (const v of variants) {
			if (v.enum) values.push(...v.enum);
			else if ('const' in v) values.push(v.const);
			else return undefined;
		}
		return values;
	};

	// Node fields (top-level or inside a collection) shown for one operation.
	const fieldsFor = ({ resource, value }, name) =>
		properties
			.filter(
				(p) =>
					p.displayOptions?.show?.resource?.includes(resource) &&
					p.displayOptions.show.operation?.includes(value),
			)
			.flatMap((p) => [p, ...(p.type === 'collection' ? p.options : [])])
			.filter((f) => f.name === name);

	// Every enum in the spec's query params and request bodies (oneOf branches
	// merged, as the generator does), for the operations the node includes.
	const enumFields = [];
	for (const item of Object.values(spec.paths)) {
		for (const op of Object.values(item)) {
			const cfg = OPERATIONS[op?.operationId];
			if (!cfg || cfg.exclude) continue;
			for (const param of op.parameters ?? []) {
				if (param.in !== 'query') continue;
				const isArray = param.schema.type === 'array';
				const values = enumValuesOf(isArray ? param.schema.items : param.schema);
				if (values) enumFields.push({ op: op.operationId, cfg, name: param.name, values, isArray });
			}
			const body = op.requestBody?.content?.['application/json']?.schema;
			const byProp = {};
			for (const branch of body?.oneOf ?? (body ? [body] : [])) {
				for (const [key, prop] of Object.entries(branch.properties ?? {})) {
					const values = enumValuesOf(prop);
					if (values) byProp[key] = [...new Set([...(byProp[key] ?? []), ...values])];
				}
			}
			for (const [name, values] of Object.entries(byProp)) {
				enumFields.push({ op: op.operationId, cfg, name, values, isArray: false });
			}
		}
	}

	test('every spec enum is an options / multiOptions field with exactly its values', () => {
		assert.ok(enumFields.length > 30, `found ${enumFields.length} enum fields`);
		const problems = [];
		for (const { op, cfg, name, values, isArray } of enumFields) {
			const where = `${op}.${name}`;
			const fields = fieldsFor(cfg, name);
			if (!fields.length) problems.push(`${where}: no field`);
			for (const field of fields) {
				const type = isArray ? 'multiOptions' : 'options';
				if (field.type !== type) problems.push(`${where}: ${field.type}, expected ${type}`);
				const got = (field.options ?? []).map((o) => o.value).sort();
				if (JSON.stringify(got) !== JSON.stringify([...values].sort()))
					problems.push(`${where}: options ${got} != spec ${values}`);
				for (const o of field.options ?? []) {
					if (!o.name || o.name === o.value)
						problems.push(`${where}: unreadable name for ${o.value}`);
				}
				for (const v of values) {
					if (!field.description?.includes(`\`${v}\``))
						problems.push(`${where}: description does not list \`${v}\``);
				}
			}
		}
		assert.deepEqual(problems, []);
	});
});

describe('multi-select filters accept the UI array and expression / AI text', () => {
	const cases = [
		['an array from the UI', ['mobile', 'mobile-did'], ['mobile', 'mobile-did']],
		[
			'a comma-separated expression ($fromAI-style text)',
			'={{ "mobile, mobile-did" }}',
			['mobile', 'mobile-did'],
		],
		['a single value as text', '={{ "global" }}', ['global']],
		['an array expression', '={{ ["global"] }}', ['global']],
	];
	for (const [label, productType, expected] of cases) {
		test(label, async () => {
			await runSalvy(api.baseUrl, {
				resource: 'phoneAccount',
				operation: 'getAll',
				limit: 1,
				filters: { productType },
			});
			assert.deepEqual(queryValues(api.requests[0], 'productType'), expected);
		});
	}
});

describe('Limit mode exposes pagination.totalCount', () => {
	test('Limit 1 returns one record carrying the total', async () => {
		api.setTotal(137);
		const items = await runSalvy(api.baseUrl, {
			resource: 'phoneAccount',
			operation: 'getAll',
			limit: 1,
			filters: { status: ['blocked'] },
		});
		assert.deepEqual(items, [{ id: 'rec-1', totalCount: 137 }]);
		assert.equal(api.requests.length, 1);
		assert.deepEqual(queryValues(api.requests[0], 'pageSize'), ['1']);
	});

	test('every record of a Limit page carries the same total, on any list operation', async () => {
		api.setTotal(7);
		const items = await runSalvy(api.baseUrl, {
			resource: 'invoice',
			operation: 'getAll',
			limit: 3,
		});
		assert.deepEqual(
			items.map((i) => [i.id, i.totalCount]),
			[
				['rec-1', 7],
				['rec-2', 7],
				['rec-3', 7],
			],
		);
	});

	test('Limit with no matches outputs a single item with totalCount 0', async () => {
		api.setTotal(0);
		const items = await runSalvy(api.baseUrl, {
			resource: 'phoneAccount',
			operation: 'getAll',
			limit: 1,
		});
		assert.deepEqual(items, [{ totalCount: 0 }]);
	});

	for (const returnAll of [true, '={{ true }}']) {
		test(`Return All (${returnAll}) stays one plain item per record`, async () => {
			api.setTotal(250);
			const items = await runSalvy(api.baseUrl, {
				resource: 'phoneAccount',
				operation: 'getAll',
				returnAll,
			});
			assert.equal(items.length, 250);
			assert.deepEqual(items[0], { id: 'rec-1' });
			assert.deepEqual(items[249], { id: 'rec-250' });
		});
	}
});
