#!/usr/bin/env node
// Generates nodes/Salvy/Salvy.properties.generated.ts from openapi/salvy-v3.json.
//
// Build-time only: @devlikeapro/n8n-openapi-node is a devDependency used here to
// produce static properties that get committed. The node itself imports nothing
// from it, so the published package has no runtime dependencies.
//
// Pipeline:
//   1. preprocess the spec (retag operations by resource, drop excluded ones,
//      collapse OpenAPI 3.1 nullable types, merge oneOf request bodies)
//   2. run N8NPropertiesBuilder with Salvy-specific operation/resource parsers
//   3. post-process into n8n conventions (Additional/Update Fields, Filters,
//      Return All/Limit pagination, multi-value query params, binary downloads,
//      English descriptions) and record every fix per operation
//   4. write the TypeScript file and the operations table in README.md
//
// Usage: node scripts/generate.mjs

import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OPERATIONS, RESOURCES } from './salvy-operations.mjs';

const require = createRequire(import.meta.url);
const {
	N8NPropertiesBuilder,
	DefaultOperationParser,
	OperationsCollector,
} = require('@devlikeapro/n8n-openapi-node');

// The exported collector prepends a "METHOD /path" notice to every operation; the
// base class (not exported) does not. Skip one level up the prototype chain.
class QuietOperationsCollector extends OperationsCollector {
	parseOperation(operation, context) {
		const base = Object.getPrototypeOf(OperationsCollector.prototype);
		return base.parseOperation.call(this, operation, context);
	}
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC_PATH = join(root, 'openapi/salvy-v3.json');
const OUT_PATH = join(root, 'nodes/Salvy/Salvy.properties.generated.ts');
const README_PATH = join(root, 'README.md');
const DESCRIPTIONS_EN = JSON.parse(
	readFileSync(join(root, 'scripts/i18n/descriptions.en.json'), 'utf8'),
);

const spec = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

// Per-operation audit: opId -> { fixes: Set<string>, excluded?: string }
const audit = {};
const fix = (opId, reason) => audit[opId].fixes.add(reason);

// ---------------------------------------------------------------------------
// 1. Preprocess
// ---------------------------------------------------------------------------

/** Collapse `type: [X, "null"]` and `anyOf: [X, {type: "null"}]` into X + x-nullable. */
function normalizeNullable(schema) {
	if (!schema || typeof schema !== 'object') return { schema, changed: false };
	let changed = false;
	if (Array.isArray(schema.type)) {
		const nonNull = schema.type.filter((t) => t !== 'null');
		if (nonNull.length !== schema.type.length) schema['x-nullable'] = true;
		schema.type = nonNull[0];
		changed = true;
	}
	if (Array.isArray(schema.anyOf)) {
		const nonNull = schema.anyOf.filter((s) => s.type !== 'null');
		if (nonNull.length === 1 && nonNull.length !== schema.anyOf.length) {
			const { anyOf, ...rest } = schema;
			Object.assign(schema, { ...nonNull[0], ...rest, 'x-nullable': true });
			delete schema.anyOf;
			changed = true;
		}
	}
	for (const key of ['properties']) {
		for (const child of Object.values(schema[key] ?? {})) {
			changed = normalizeNullable(child).changed || changed;
		}
	}
	if (schema.items) changed = normalizeNullable(schema.items).changed || changed;
	return { schema, changed };
}

/** Merge a oneOf body into one object schema; returns the discriminator property name. */
function mergeOneOf(schema) {
	const branches = schema.oneOf;
	const properties = {};
	let discriminator;
	for (const branch of branches) {
		for (const [key, prop] of Object.entries(branch.properties)) {
			if ('const' in prop) {
				discriminator = key;
				properties[key] ??= { type: 'string', enum: [] };
				properties[key].enum.push(prop.const);
			} else {
				properties[key] ??= prop;
			}
		}
	}
	const required = branches
		.map((b) => b.required ?? [])
		.reduce((acc, req) => acc.filter((k) => req.includes(k)));
	delete schema.oneOf;
	Object.assign(schema, { type: 'object', properties, required });
	// Remember which branch requires what, for displayOptions later.
	schema['x-branches'] = branches.map((b) => ({
		value: b.properties[discriminator].const,
		properties: Object.keys(b.properties),
		required: b.required ?? [],
	}));
	schema['x-discriminator'] = discriminator;
	return discriminator;
}

const opIndex = {}; // opId -> { method, path, op }
for (const [path, item] of Object.entries(spec.paths)) {
	for (const method of METHODS) {
		const op = item[method];
		if (!op) continue;
		const cfg = OPERATIONS[op.operationId];
		if (!cfg) {
			throw new Error(
				`Operation ${op.operationId} (${method.toUpperCase()} ${path}) is not mapped in scripts/salvy-operations.mjs`,
			);
		}
		audit[op.operationId] = { fixes: new Set(), method, path };
		if (cfg.exclude) {
			audit[op.operationId].excluded = cfg.exclude;
			delete item[method];
			continue;
		}
		if (op.deprecated) fix(op.operationId, 'deprecated in spec (generator skips these by default)');
		op.tags = [cfg.resource];
		for (const param of op.parameters ?? []) {
			if (normalizeNullable(param.schema).changed) {
				fix(op.operationId, 'nullable types (OpenAPI 3.1) collapsed');
			}
		}
		const body = op.requestBody?.content?.['application/json']?.schema;
		if (body) {
			if (body.oneOf) {
				const d = mergeOneOf(body);
				fix(op.operationId, `oneOf body merged; branch-only fields shown per \`${d}\``);
			}
			if (normalizeNullable(body).changed) {
				fix(op.operationId, 'nullable types (OpenAPI 3.1) collapsed');
			}
		}
		opIndex[op.operationId] = { method, path, op, cfg };
	}
	if (Object.keys(item).every((k) => !METHODS.includes(k))) delete spec.paths[path];
}
spec.tags = Object.keys(RESOURCES).map((name) => ({ name }));

// ---------------------------------------------------------------------------
// 2. Generate
// ---------------------------------------------------------------------------

class SalvyOperationParser extends DefaultOperationParser {
	name(operation) {
		return operation.operationId;
	}
	value(operation) {
		return operation.operationId;
	}
	action(operation) {
		return operation.operationId;
	}
	description() {
		return '';
	}
}

class SalvyResourceParser {
	name(tag) {
		return RESOURCES[tag.name];
	}
	value(tag) {
		return tag.name;
	}
	description() {
		return '';
	}
}

const warnings = [];
const logger = {
	info() {},
	debug() {},
	warn: (data, msg) => warnings.push(`${msg}: ${JSON.stringify(data)}`),
	error: (data, msg) => warnings.push(`${msg}: ${JSON.stringify(data)}`),
};

const generated = new N8NPropertiesBuilder(spec, {
	logger,
	OperationsCollector: QuietOperationsCollector,
	operation: new SalvyOperationParser(),
	resource: new SalvyResourceParser(),
}).build();

if (warnings.length) {
	throw new Error(`Generator warnings:\n${warnings.join('\n')}`);
}

// ---------------------------------------------------------------------------
// 3. Post-process
// ---------------------------------------------------------------------------

const WORDS = {
	Id: 'ID',
	Ids: 'IDs',
	Gb: 'GB',
	Iccid: 'ICCID',
	Cpf: 'CPF',
	Nfe: 'NFe',
	Sms: 'SMS',
	Did: 'DID',
	Esim: 'eSIM',
	Pj: 'PJ',
	Clt: 'CLT',
	Whatsapp: 'WhatsApp',
	Tiktok: 'TikTok',
	Paypal: 'PayPal',
	Godaddy: 'GoDaddy',
	Youtube: 'YouTube',
	Linkedin: 'LinkedIn',
	Pagbank: 'PagBank',
	Infinitepay: 'InfinitePay',
	Hostgator: 'HostGator',
	Sendpulse: 'SendPulse',
	Wechat: 'WeChat',
	Ifood: 'iFood',
	Bmg: 'BMG',
	Btg: 'BTG',
	Itau: 'Itaú',
	Sp: 'SP',
};
const startCase = (s) =>
	s
		.replace(/[-_.]+/g, ' ')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.split(' ')
		.filter(Boolean)
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.map((w) => WORDS[w] ?? w)
		.join(' ');

function translate(opId, text) {
	if (!text) return undefined;
	const en = DESCRIPTIONS_EN[text];
	if (!en) {
		throw new Error(
			`Missing English description for ${opId}: ${JSON.stringify(text)}\nAdd it to scripts/i18n/descriptions.en.json`,
		);
	}
	return en;
}

const enumOptions = (values) =>
	values
		.map((value) => ({ name: value === '__null__' ? 'Not Set' : startCase(value), value }))
		.sort((a, b) => a.name.localeCompare(b.name));

const NULLABLE_VALUE = '={{ $value === "" ? null : $value }}';
const SPLIT_VALUE = '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}';
const JSON_VALUE = '={{ typeof $value === "string" ? JSON.parse($value) : $value }}';

/** Item schema of an array query param: { enumValues?, allowsNull } */
function arrayItemInfo(items) {
	const variants = items.anyOf ?? [items];
	const enumValues = [];
	let freeText = false;
	let allowsNull = false;
	for (const v of variants) {
		if (v.const === '__null__') allowsNull = true;
		else if (v.enum) enumValues.push(...v.enum);
		else freeText = true;
	}
	return { enumValues: freeText ? undefined : enumValues, allowsNull };
}

function buildQueryField(opId, param) {
	const schema = param.schema;
	const description = translate(opId, schema.description ?? param.description);
	const base = { displayName: startCase(param.name), name: param.name, description };
	const send = (value) => ({
		send: { type: 'query', property: param.name, propertyInDotNotation: false, value },
	});
	if (schema.type === 'array') {
		const { enumValues, allowsNull } = arrayItemInfo(schema.items);
		if (enumValues) {
			fix(opId, 'array query params as multi-select (generator sends them as a JSON string)');
			return {
				...base,
				type: 'multiOptions',
				options: enumOptions(allowsNull ? [...enumValues, '__null__'] : enumValues),
				default: [],
				routing: send('={{ $value }}'),
			};
		}
		fix(opId, 'array query params as comma-separated text (generator sends them as a JSON string)');
		return {
			...base,
			type: 'string',
			default: '',
			description: `${description} Comma-separated for multiple values.`,
			routing: send(SPLIT_VALUE),
		};
	}
	if (schema.enum) {
		return {
			...base,
			type: 'options',
			options: enumOptions(schema.enum),
			default: schema.default ?? schema.enum[0],
			routing: send('={{ $value }}'),
		};
	}
	if (
		schema.type === 'boolean' ||
		(schema.type === 'string' && /^include|^available$/.test(param.name))
	) {
		if (schema.type !== 'boolean')
			fix(opId, `\`${param.name}\` is a string in the spec; exposed as a boolean`);
		return { ...base, type: 'boolean', default: false, routing: send('={{ String($value) }}') };
	}
	if (schema.type === 'integer' || schema.type === 'number') {
		return {
			...base,
			type: 'number',
			default: schema.default ?? 0,
			routing: send('={{ $value }}'),
		};
	}
	return {
		...base,
		type: 'string',
		default: '',
		placeholder: schema.example !== undefined ? String(schema.example) : undefined,
		routing: send('={{ $value }}'),
	};
}

/** Transform one generated body field using the (normalized) spec schema. */
function buildBodyField(opId, key, prop, generatedField, cfg) {
	const description = translate(opId, prop.description);
	const base = { displayName: startCase(key), name: key, description };
	const send = (value, extra = {}) => ({
		send: { type: 'body', property: key, propertyInDotNotation: false, value, ...extra },
	});
	const nullable = !!prop['x-nullable'];
	if (prop.type === 'array' && prop.items?.type === 'string') {
		fix(opId, `\`${key}\` (array of IDs) as comma-separated text (generator: raw JSON field)`);
		return {
			...base,
			type: 'string',
			default: '',
			description: `${description} Comma-separated.`,
			routing: send(SPLIT_VALUE),
		};
	}
	if (prop.type === 'array' || prop.type === 'object') {
		fix(opId, `nested \`${key}\` exposed as a JSON field (generator: first level only)`);
		const example = prop.example ?? (prop.type === 'array' ? [] : {});
		return {
			...base,
			type: 'json',
			default: JSON.stringify(example, null, 2),
			routing: send(JSON_VALUE),
		};
	}
	if (prop.enum) {
		return {
			...base,
			type: 'options',
			options: enumOptions(prop.enum),
			default: prop.default ?? prop.enum[0],
			routing: send('={{ $value }}'),
		};
	}
	if (prop.type === 'boolean') {
		return {
			...base,
			type: 'boolean',
			default: prop.default ?? false,
			routing: send('={{ $value }}'),
		};
	}
	if (prop.type === 'integer' || prop.type === 'number') {
		return { ...base, type: 'number', default: prop.default ?? 0, routing: send('={{ $value }}') };
	}
	if (generatedField.type !== 'string' && generatedField.type !== undefined) {
		throw new Error(`${opId}.${key}: unexpected generated type ${generatedField.type}`);
	}
	return {
		...base,
		type: 'string',
		default: '',
		placeholder:
			prop.example !== undefined && prop.example !== null ? String(prop.example) : undefined,
		routing: send(nullable ? NULLABLE_VALUE : '={{ $value }}'),
	};
}

/** Employee address: hand-written nested collection (generator only handles the first level). */
function addressCollection(opId, prop) {
	fix(opId, 'nested `address` hand-written as a collection (generator: first level only)');
	return {
		displayName: 'Address',
		name: 'address',
		type: 'collection',
		placeholder: 'Add Address Field',
		default: {},
		description: translate(opId, prop.description),
		options: Object.entries(prop.properties)
			.sort(([a], [b]) => startCase(a).localeCompare(startCase(b)))
			.map(([k, p]) => ({
				displayName: startCase(k),
				name: k,
				type: 'string',
				default: '',
				description: translate(opId, p.description),
				routing: {
					send: {
						type: 'body',
						property: `address.${k}`,
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			})),
	};
}

const sortByName = (a, b) => a.displayName.localeCompare(b.displayName);
const clean = (obj) => JSON.parse(JSON.stringify(obj)); // drops undefined

const fieldsOut = [];
const operationProps = [];

for (const resource of Object.keys(RESOURCES)) {
	const opIds = Object.keys(opIndex).filter((id) => opIndex[id].cfg.resource === resource);
	const generatedOp = generated.find(
		(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.[0] === resource,
	);
	const options = [];

	for (const opId of opIds) {
		const { op, cfg, method } = opIndex[opId];
		const genOption = generatedOp.options.find((o) => o.value === opId);
		const show = { resource: [resource], operation: [cfg.value] };
		const genFields = generated.filter((p) => p.displayOptions?.show?.operation?.[0] === opId);
		const routing = { request: { ...genOption.routing.request } };
		const top = [];
		const additional = [];
		const filters = [];
		const sortOptions = [];
		const bodySchema = op.requestBody?.content?.['application/json']?.schema;
		const isUpdate = method === 'patch';
		let paginated = false;

		for (const field of genFields) {
			const send = field.routing?.send;
			const headerName = Object.keys(field.routing?.request?.headers ?? {})[0];
			const param = (op.parameters ?? []).find((p) =>
				send?.type === 'query'
					? p.in === 'query' && p.name === send.property
					: headerName
						? p.in === 'header' && p.name === headerName
						: !send && p.in === 'path' && p.name === field.name,
			);
			if (param?.in === 'path') {
				top.push({
					displayName: `${RESOURCES[resource]} ID`,
					name: param.name,
					type: 'string',
					required: true,
					default: '',
					description: `ID of the ${RESOURCES[resource].toLowerCase()}`,
				});
				continue;
			}
			if (param?.in === 'query') {
				if (param.name === 'page') continue;
				if (param.name === 'pageSize') {
					paginated = true;
					continue;
				}
				const built = buildQueryField(opId, param);
				if (param.required) top.push({ ...built, required: true });
				else if (param.name.startsWith('sort')) sortOptions.push(built);
				else filters.push(built);
				continue;
			}
			if (param?.in === 'header') {
				const built = {
					displayName: startCase(param.name),
					name: 'idempotencyKey',
					type: 'string',
					default: '',
					description: translate(opId, param.schema.description ?? param.description),
					routing: { request: { headers: { [param.name]: '={{ $value }}' } } },
				};
				if (param.required) top.push({ ...built, required: true });
				else additional.push(built);
				continue;
			}
			// Body field
			const key = field.routing?.send?.property;
			const prop = bodySchema?.properties?.[key];
			if (!prop) throw new Error(`${opId}: cannot map generated field ${JSON.stringify(field)}`);
			if (key === 'address' && prop.properties) {
				top.push(addressCollection(opId, prop));
				continue;
			}
			const built = buildBodyField(opId, key, prop, field, cfg);
			const required = (bodySchema.required ?? []).includes(key);
			const branches = bodySchema['x-branches'];
			if (branches && key === bodySchema['x-discriminator']) {
				top.push({ ...built, required: true, ...(cfg.fields?.[key] ?? {}) });
				continue;
			}
			if (branches) {
				const requiredIn = branches.filter((b) => b.required.includes(key)).map((b) => b.value);
				const presentIn = branches.filter((b) => b.properties.includes(key)).map((b) => b.value);
				if (requiredIn.length && !required) {
					top.push({
						...built,
						required: true,
						displayOptions: { show: { ...show, [bodySchema['x-discriminator']]: requiredIn } },
					});
					continue;
				}
				if (presentIn.length < branches.length) {
					throw new Error(`${opId}.${key}: optional branch-only field needs handling`);
				}
			}
			if (required) {
				top.push({ ...built, required: true });
			} else if (prop['x-nullable'] && (bodySchema.required ?? []).includes(key)) {
				top.push(built);
			} else {
				additional.push(built);
			}
		}

		// Required-but-nullable body fields: optional in the UI, empty -> null.
		for (const key of bodySchema?.required ?? []) {
			const prop = bodySchema.properties[key];
			const f = top.find((t) => t.name === key);
			if (prop?.['x-nullable'] && f) {
				delete f.required;
				f.routing.send.value = NULLABLE_VALUE;
			}
		}

		// Operation-specific overrides
		for (const [name, override] of Object.entries(cfg.fields ?? {})) {
			const f = [...top, ...additional, ...filters].find((t) => t.name === name);
			if (!f) throw new Error(`${opId}: override for unknown field ${name}`);
			Object.assign(f, override);
		}

		for (const f of top) {
			f.displayOptions = { show: { ...show, ...(f.displayOptions?.show ?? {}) } };
		}
		fieldsOut.push(...top);

		if (paginated) {
			fix(opId, 'page/pageSize replaced by Return All + Limit with generic pagination');
			fieldsOut.push(
				{
					displayName: 'Return All',
					name: 'returnAll',
					type: 'boolean',
					default: false,
					description: 'Whether to return all results or only up to a given limit',
					displayOptions: { show },
					routing: {
						send: { paginate: '={{ $value }}', type: 'query', property: 'pageSize', value: '200' },
						operations: {
							pagination: {
								type: 'generic',
								properties: {
									continue:
										'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
									request: {
										// Generic pagination replaces whole option keys, so `qs` cannot be
										// patched here without dropping the filters; page goes in the URL.
										url: '={{ $request.url + "?page=" + (($response.body?.pagination?.page ?? 0) + 1) }}',
									},
								},
							},
						},
					},
				},
				{
					displayName: 'Limit',
					name: 'limit',
					type: 'number',
					typeOptions: { minValue: 1, maxValue: 200 },
					default: 50,
					description: 'Max number of results to return',
					displayOptions: { show: { ...show, returnAll: [false] } },
					routing: {
						request: { qs: { page: 1, pageSize: '={{ $value }}' } },
						output: { maxResults: '={{ $value }}' },
					},
				},
			);
		}

		const collection = (displayName, name, placeholder, opts) =>
			opts.length && {
				displayName,
				name,
				type: 'collection',
				placeholder,
				default: {},
				displayOptions: { show },
				options: opts.sort(sortByName),
			};
		const additionalName = isUpdate
			? ['Update Fields', 'updateFields']
			: ['Additional Fields', 'additionalFields'];
		if (additional.some((f) => f.routing?.send?.type === 'body')) {
			fix(
				opId,
				isUpdate
					? 'optional body fields grouped under Update Fields (generator sends every field, even empty)'
					: 'optional body fields grouped under Additional Fields (generator sends every field, even empty)',
			);
		}
		if (filters.length || sortOptions.length) {
			fix(
				opId,
				'optional query params grouped under Filters/Options (generator sends every param, even empty)',
			);
		}
		for (const c of [
			collection(additionalName[0], additionalName[1], 'Add Field', additional),
			collection('Filters', 'filters', 'Add Filter', filters),
			collection('Options', 'options', 'Add Option', sortOptions),
		]) {
			if (c) fieldsOut.push(c);
		}

		// Output handling
		const responses = op.responses ?? {};
		const okSchema = Object.entries(responses).find(([c]) => c.startsWith('2'))?.[1]?.content?.[
			'application/json'
		]?.schema;
		if (okSchema?.oneOf) {
			fix(
				opId,
				'response is a oneOf union keyed by `type`; items are passed through as-is (the generator does not read responses)',
			);
		}
		if (cfg.binary) {
			fix(opId, 'file response returned as n8n binary data (generator: JSON only)');
			routing.request.encoding = 'arraybuffer';
			routing.request.json = false;
			routing.request.headers = { Accept: cfg.binary.accept };
			routing.output = {
				postReceive: [
					// Drop the raw buffer from item.json; the file goes to item.binary.
					{ type: 'set', properties: { value: '={{ {} }}' } },
					{
						type: 'binaryData',
						properties: { destinationProperty: '={{$parameter["binaryPropertyName"]}}' },
					},
				],
			};
			fieldsOut.push({
				displayName: 'Put Output File in Field',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				default: 'data',
				hint: 'The name of the output binary field to put the file in',
				displayOptions: { show },
			});
		} else if (cfg.noContent) {
			fix(opId, '204 No Content mapped to { success: true }');
			routing.output = {
				postReceive: [{ type: 'set', properties: { value: '={{ { "success": true } }}' } }],
			};
		} else if (
			[okSchema, ...(okSchema?.oneOf ?? [])].some((sc) => sc?.properties?.data?.type === 'array')
		) {
			fix(opId, 'list response split into one item per record (`data`)');
			routing.output = {
				postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }],
			};
		}

		options.push({
			name: cfg.name,
			value: cfg.value,
			action: cfg.action,
			description: cfg.description,
			routing,
		});
	}

	options.sort((a, b) => a.name.localeCompare(b.name));
	operationProps.push({
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options,
		default: (
			options.find((o) => o.value === 'getAll') ??
			options.find((o) => o.value === 'get') ??
			options[0]
		).value,
	});
}

const resourceProp = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: Object.entries(RESOURCES)
		.map(([value, name]) => ({ name, value }))
		.sort((a, b) => a.name.localeCompare(b.name)),
	default: 'phoneAccount',
};

// n8n description conventions (eslint-plugin-n8n-nodes-base, enforced by the
// community package scanner): single sentences have no final period, multiple
// sentences end with one, and a description equal to the display name is dropped.
function normalizeDescriptions(node) {
	if (Array.isArray(node)) return node.forEach(normalizeDescriptions);
	if (!node || typeof node !== 'object') return;
	if (typeof node.description === 'string') {
		let d = node.description.trim();
		const sentences = d.replace('e.g.', '').split('. ').length;
		if (sentences === 1 && d.endsWith('.')) d = d.slice(0, -1);
		if (sentences > 1 && !/[.!?]$/.test(d)) d = `${d}.`;
		const label = (node.displayName ?? node.name ?? '').toLowerCase();
		if (d.toLowerCase() === label) delete node.description;
		else node.description = d;
	}
	for (const key of ['options', 'values']) if (node[key]) normalizeDescriptions(node[key]);
}

const properties = clean([resourceProp, ...operationProps, ...fieldsOut]);
normalizeDescriptions(properties);

// ---------------------------------------------------------------------------
// 4. Write
// ---------------------------------------------------------------------------

const header = `// GENERATED FILE - do not edit by hand.
// Source: openapi/salvy-v3.json via scripts/generate.mjs (npm run generate).
`;
writeFileSync(
	OUT_PATH,
	`${header}import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = ${JSON.stringify(properties, null, '\t')};
`,
);

execFileSync(join(root, 'node_modules/.bin/prettier'), ['--write', OUT_PATH], { stdio: 'ignore' });

// Operations table in README (between markers)
const rows = Object.entries(audit).map(([opId, a]) => {
	const cfg = OPERATIONS[opId];
	if (a.excluded) {
		return `| — | — | \`${a.method.toUpperCase()} ${a.path}\` | excluded | ${a.excluded} |`;
	}
	const status = a.fixes.size ? 'fixed' : 'generated';
	return `| ${RESOURCES[cfg.resource]} | ${cfg.name} | \`${a.method.toUpperCase()} ${a.path}\` | ${status} | ${[...a.fixes].join('; ') || '—'} |`;
});
rows.sort();
const table = [
	'| Resource | Operation | Endpoint | Status | Notes |',
	'| --- | --- | --- | --- | --- |',
	...rows,
].join('\n');
const readme = readFileSync(README_PATH, 'utf8');
const START = '<!-- operations:start -->';
const END = '<!-- operations:end -->';
if (readme.includes(START)) {
	writeFileSync(
		README_PATH,
		readme.replace(new RegExp(`${START}[\\s\\S]*${END}`), `${START}\n${table}\n${END}`),
	);
}

execFileSync(join(root, 'node_modules/.bin/prettier'), ['--write', README_PATH], {
	stdio: 'ignore',
});

const counts = Object.values(audit).reduce(
	(acc, a) => {
		acc[a.excluded ? 'excluded' : a.fixes.size ? 'fixed' : 'generated']++;
		return acc;
	},
	{ generated: 0, fixed: 0, excluded: 0 },
);
console.log(
	`Wrote ${properties.length} properties for ${Object.keys(opIndex).length} operations ` +
		`(generated ${counts.generated}, fixed ${counts.fixed}, excluded ${counts.excluded}).`,
);
writeFileSync(
	join(root, 'openapi/audit.json'),
	`${JSON.stringify(
		Object.fromEntries(
			Object.entries(audit).map(([id, a]) => [
				id,
				{
					endpoint: `${a.method.toUpperCase()} ${a.path}`,
					status: a.excluded ? 'excluded' : a.fixes.size ? 'fixed' : 'generated',
					notes: a.excluded ? [a.excluded] : [...a.fixes],
				},
			]),
		),
		null,
		'\t',
	)}\n`,
);
