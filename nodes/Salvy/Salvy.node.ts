import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { properties } from './Salvy.properties.generated';

export class Salvy implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Salvy',
		name: 'salvy',
		icon: { light: 'file:../../icons/salvy.svg', dark: 'file:../../icons/salvy.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Manage phone accounts, employees, cost centers, assets and invoices with the Salvy API',
		defaults: {
			name: 'Salvy',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'salvyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.salvy.com.br',
			arrayFormat: 'repeat',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties,
	};
}
