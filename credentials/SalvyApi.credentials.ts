import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SalvyApi implements ICredentialType {
	name = 'salvyApi';

	displayName = 'Salvy API';

	icon: Icon = { light: 'file:../icons/salvy.svg', dark: 'file:../icons/salvy.dark.svg' };

	documentationUrl = 'https://docs.salvy.com.br/api-reference/v3/api-keys';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'Company or organization API key created in the Salvy dashboard. Sandbox and production keys both use https://api.salvy.com.br.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.salvy.com.br',
			url: '/api/v3/companies',
			method: 'GET',
			qs: {
				page: 1,
				pageSize: 1,
			},
		},
	};
}
