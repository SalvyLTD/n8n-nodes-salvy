// Runs the built Salvy node through n8n's real declarative engine (n8n-core's
// RoutingNode) against an in-process fake of the Salvy API, and records every
// HTTP request the engine actually sends. Never touches the real API.

import { createServer } from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const core = require('n8n-core');
// Resolve n8n-workflow and the DI container from n8n-core so the engine and the
// test share one copy of each.
const coreRequire = createRequire(require.resolve('n8n-core'));
const { Workflow } = coreRequire('n8n-workflow');
const { Container } = coreRequire('@n8n/di');
const { Salvy } = require('../dist/nodes/Salvy/Salvy.node.js');
const { SalvyApi } = require('../dist/credentials/SalvyApi.credentials.js');

Container.set(core.InstanceSettings, { n8nFolder: '/nonexistent', instanceId: 'test' });

const API_KEY = 'test-key';

/**
 * Fake list endpoint: any GET returns `total` records split into pages, in the
 * API's `{ data, pagination }` shape. Like the real API, it rejects a repeated
 * `page` and a pageSize above 200 with 422.
 */
export async function startFakeApi({ total = 5 } = {}) {
	const requests = [];
	const server = createServer((req, res) => {
		const url = new URL(req.url, 'http://fake');
		const query = [...url.searchParams.entries()];
		requests.push({ method: req.method, path: url.pathname, query });
		const send = (status, body) => {
			res.writeHead(status, { 'content-type': 'application/json' });
			res.end(JSON.stringify(body));
		};
		if (req.headers.authorization !== `Bearer ${API_KEY}`)
			return send(401, { message: 'unauthorized' });
		if (requests.length > 50) return send(500, { message: 'runaway pagination' });
		const pages = url.searchParams.getAll('page');
		const sizes = url.searchParams.getAll('pageSize');
		if (pages.length !== 1 || sizes.length !== 1) {
			return send(422, { message: 'page and pageSize must be sent exactly once' });
		}
		const page = Number(pages[0]);
		const pageSize = Number(sizes[0]);
		if (!(page >= 1) || !(pageSize >= 1 && pageSize <= 200)) {
			return send(422, { message: 'invalid page or pageSize' });
		}
		const start = (page - 1) * pageSize;
		const data = Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, i) => ({
			id: `rec-${start + i + 1}`,
		}));
		send(200, {
			data,
			pagination: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize) },
		});
	});
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
	return {
		baseUrl: `http://127.0.0.1:${server.address().port}`,
		requests,
		setTotal: (n) => (total = n),
		close: () =>
			new Promise((resolve) => {
				server.closeAllConnections();
				server.close(resolve);
			}),
	};
}

/** Executes the node once with `parameters`; returns the output items' json. */
export async function runSalvy(baseUrl, parameters) {
	const nodeType = new Salvy();
	nodeType.description.requestDefaults.baseURL = baseUrl;
	const credentialType = new SalvyApi();
	const node = {
		id: 'node-1',
		name: 'Salvy',
		type: 'salvy',
		typeVersion: 1,
		position: [0, 0],
		parameters,
		credentials: { salvyApi: { id: 'cred-1', name: 'Salvy API' } },
	};
	const nodeTypes = {
		getByName: () => nodeType,
		getByNameAndVersion: () => nodeType,
		getKnownTypes: () => ({}),
	};
	// The Workflow constructor fills unset parameters with their defaults, as n8n does.
	const workflow = new Workflow({
		id: 'wf-1',
		nodes: [node],
		connections: {},
		active: false,
		nodeTypes,
	});
	const additionalData = {
		credentialsHelper: {
			getDecrypted: async () => ({ apiKey: API_KEY }),
			authenticate: async (credentials, _type, options) => ({
				...options,
				headers: { ...options.headers, Authorization: `Bearer ${credentials.apiKey}` },
			}),
			preAuthentication: async () => undefined,
			getParentTypes: () => [],
			getCredentialsProperties: () => credentialType.properties,
			isCredentialUsableByNode: () => true,
		},
		restApiUrl: 'http://n8n.test/rest',
		instanceBaseUrl: 'http://n8n.test',
		webhookBaseUrl: 'http://n8n.test/webhook',
		webhookWaitingBaseUrl: 'http://n8n.test/webhook-waiting',
		webhookTestBaseUrl: 'http://n8n.test/webhook-test',
		formWaitingBaseUrl: 'http://n8n.test/form-waiting',
		variables: {},
		executionId: 'exec-1',
		userId: 'user-1',
	};
	const wfNode = workflow.getNode('Salvy');
	const inputData = { main: [[{ json: {} }]] };
	const executeData = { node: wfNode, data: inputData, source: null };
	const context = new core.ExecuteContext(
		workflow,
		wfNode,
		additionalData,
		'manual',
		{ resultData: { runData: {} } },
		0,
		[{ json: {} }],
		inputData,
		executeData,
		[],
	);
	const [items] = await new core.RoutingNode(context, nodeType).runNode();
	return items.map((item) => item.json);
}

/** Values of `name` in a captured request's query string. */
export const queryValues = (request, name) =>
	request.query.filter(([key]) => key === name).map(([, value]) => value);
