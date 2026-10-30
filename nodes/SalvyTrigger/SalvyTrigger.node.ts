import {
	NodeApiError,
	NodeConnectionTypes,
	type IDataObject,
	type IHookFunctions,
	type IHttpRequestMethods,
	type IHttpRequestOptions,
	type ILoadOptionsFunctions,
	type INodePropertyOptions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
	type JsonObject,
} from 'n8n-workflow';
import { eventDescriptions } from './eventDescriptions';
import { verifySignature } from './verifySignature';

const API_BASE_URL = 'https://api.salvy.com.br/api/v3';

interface WebhookEndpoint {
	id: string;
	url: string;
	eventTypes: string[];
	secret?: string;
}

interface EndpointStaticData {
	endpointId?: string;
	endpointSecret?: string;
}

interface FullResponse<T> {
	statusCode: number;
	body: T;
}

async function salvyRequest<T>(
	context: IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
): Promise<FullResponse<T>> {
	const options: IHttpRequestOptions = {
		method,
		url: `${API_BASE_URL}${path}`,
		json: true,
		body,
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
	};
	const response = (await context.helpers.httpRequestWithAuthentication.call(
		context,
		'salvyApi',
		options,
	)) as FullResponse<T>;
	return response;
}

function apiError(
	context: IHookFunctions | ILoadOptionsFunctions,
	response: FullResponse<unknown>,
	action: string,
): NodeApiError {
	return new NodeApiError(context.getNode(), (response.body ?? {}) as JsonObject, {
		httpCode: String(response.statusCode),
		message: `Salvy API error while trying to ${action} (HTTP ${response.statusCode})`,
	});
}

const sameEventTypes = (a: string[], b: string[]) =>
	a.length === b.length && [...a].sort().join('\n') === [...b].sort().join('\n');

export class SalvyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Salvy Trigger',
		name: 'salvyTrigger',
		icon: { light: 'file:../../icons/salvy.svg', dark: 'file:../../icons/salvy.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["eventTypes"].join(", ")}}',
		description: 'Starts the workflow when Salvy sends a webhook event',
		defaults: {
			name: 'Salvy Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'salvyApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event Names or IDs',
				name: 'eventTypes',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getEventTypes',
				},
				required: true,
				default: [],
				description:
					'The events to listen to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	};

	methods = {
		loadOptions: {
			async getEventTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await salvyRequest<{
					data: Array<{ name: string }>;
				}>(this, 'GET', '/webhook-event-types');
				if (response.statusCode !== 200) {
					throw apiError(this, response, 'list webhook event types');
				}
				return response.body.data
					.map((eventType) => ({
						name: eventType.name,
						value: eventType.name,
						description: eventDescriptions[eventType.name],
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as EndpointStaticData;
				if (!staticData.endpointId || !staticData.endpointSecret) return false;

				const response = await salvyRequest<WebhookEndpoint>(
					this,
					'GET',
					`/webhook-endpoints/${encodeURIComponent(staticData.endpointId)}`,
				);
				if (response.statusCode === 404) {
					delete staticData.endpointId;
					delete staticData.endpointSecret;
					return false;
				}
				if (response.statusCode !== 200) {
					throw apiError(this, response, 'check the webhook endpoint');
				}

				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const eventTypes = this.getNodeParameter('eventTypes', []) as string[];
				const endpoint = response.body;
				if (endpoint.url === webhookUrl && sameEventTypes(endpoint.eventTypes, eventTypes)) {
					return true;
				}

				// Registered for another URL or other events: replace it instead of leaking it.
				const deletion = await salvyRequest<unknown>(
					this,
					'DELETE',
					`/webhook-endpoints/${encodeURIComponent(endpoint.id)}`,
				);
				if (deletion.statusCode !== 204 && deletion.statusCode !== 404) {
					throw apiError(this, deletion, 'replace the outdated webhook endpoint');
				}
				delete staticData.endpointId;
				delete staticData.endpointSecret;
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as EndpointStaticData;
				const workflow = this.getWorkflow();
				const body: IDataObject = {
					url: this.getNodeWebhookUrl('default') as string,
					eventTypes: this.getNodeParameter('eventTypes', []) as string[],
					description: `n8n workflow "${workflow.name ?? workflow.id}"`,
				};
				const response = await salvyRequest<WebhookEndpoint>(
					this,
					'POST',
					'/webhook-endpoints',
					body,
				);
				if (response.statusCode !== 201 || !response.body?.id || !response.body.secret) {
					throw apiError(this, response, 'create the webhook endpoint');
				}
				staticData.endpointId = response.body.id;
				staticData.endpointSecret = response.body.secret;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as EndpointStaticData;
				if (!staticData.endpointId) return true;

				const response = await salvyRequest<unknown>(
					this,
					'DELETE',
					`/webhook-endpoints/${encodeURIComponent(staticData.endpointId)}`,
				);
				if (response.statusCode !== 204 && response.statusCode !== 404) {
					throw apiError(this, response, 'delete the webhook endpoint');
				}
				delete staticData.endpointId;
				delete staticData.endpointSecret;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const headers = this.getHeaderData() as Record<string, string | undefined>;
		const staticData = this.getWorkflowStaticData('node') as EndpointStaticData;
		const rawBody: Buffer | undefined = (req as unknown as { rawBody?: Buffer }).rawBody;

		const result =
			staticData.endpointSecret && rawBody
				? verifySignature(
						staticData.endpointSecret,
						{
							id: headers['svix-id'],
							timestamp: headers['svix-timestamp'],
							signature: headers['svix-signature'],
						},
						rawBody,
					)
				: ({ valid: false, reason: 'missing-secret-or-body' } as const);

		if (!result.valid) {
			this.logger.warn('Rejected Salvy webhook delivery', { reason: result.reason });
			const res = this.getResponseObject();
			res.status(401).send('Unauthorized').end();
			return { noWebhookResponse: true };
		}

		const payload = JSON.parse(rawBody!.toString('utf8')) as IDataObject;
		return {
			workflowData: [
				[
					{
						json: {
							type: payload.type,
							timestamp: payload.timestamp,
							data: payload.data,
						},
					},
				],
			],
		};
	}
}
