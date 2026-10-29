// GENERATED FILE - do not edit by hand.
// Source: openapi/salvy-v3.json via scripts/generate.mjs (npm run generate).
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Area Code',
				value: 'areaCode',
			},
			{
				name: 'Asset',
				value: 'asset',
			},
			{
				name: 'Asset Statement',
				value: 'assetStatement',
			},
			{
				name: 'Company',
				value: 'company',
			},
			{
				name: 'Cost Center',
				value: 'costCenter',
			},
			{
				name: 'Employee',
				value: 'employee',
			},
			{
				name: 'Invoice',
				value: 'invoice',
			},
			{
				name: 'Phone Account',
				value: 'phoneAccount',
			},
			{
				name: 'Phone Account Group',
				value: 'phoneAccountGroup',
			},
			{
				name: 'Plan',
				value: 'plan',
			},
			{
				name: 'Task',
				value: 'task',
			},
		],
		default: 'phoneAccount',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['asset'],
			},
		},
		options: [
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive an asset',
				description: 'Archive an asset (reversible with Unarchive)',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/assets/{{$parameter["id"]}}/archive',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an asset',
				description: 'Create an asset',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/assets',
					},
				},
			},
			{
				name: 'Create Timeline Note',
				value: 'createTimelineNote',
				action: 'Create a timeline note on an asset',
				description: 'Add a note to an asset’s timeline',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/assets/{{$parameter["id"]}}/timeline-notes',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an asset',
				description:
					'Delete an asset permanently. Unlike Archive, this cannot be undone through the API.',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/api/v3/assets/{{$parameter["id"]}}',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ { "success": true } }}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an asset',
				description: 'Get an asset by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/assets/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many assets',
				description: 'List your company assets, newest first by default',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/assets',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Unarchive',
				value: 'unarchive',
				action: 'Unarchive an asset',
				description: 'Unarchive an asset, setting the status it returns to',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/assets/{{$parameter["id"]}}/unarchive',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an asset',
				description: 'Update an asset. Only the fields you set are changed.',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v3/assets/{{$parameter["id"]}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['assetStatement'],
			},
		},
		options: [
			{
				name: 'Download Signed File',
				value: 'downloadSignedFile',
				action: 'Download the signed file of an asset statement',
				description:
					'Download the signed PDF of an asset statement. Returns 409 while the statement is not signed.',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/asset-statements/{{$parameter["id"]}}/signed-file',
						encoding: 'arraybuffer',
						json: false,
						headers: {
							Accept: 'application/pdf',
						},
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ {} }}',
								},
							},
							{
								type: 'binaryData',
								properties: {
									destinationProperty: '={{$parameter["binaryPropertyName"]}}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an asset statement',
				description: 'Get an asset responsibility or return statement by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/asset-statements/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many asset statements',
				description:
					'List asset responsibility and return statements, including those sent from the dashboard, newest first',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/asset-statements',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Send',
				value: 'send',
				action: 'Send an asset statement',
				description:
					'Send a responsibility or return statement to the employee for e-signature by email. In sandbox no email is sent; use Simulate Signature.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/asset-statements',
					},
				},
			},
			{
				name: 'Simulate Signature',
				value: 'simulateSignature',
				action: 'Simulate the signature of an asset statement',
				description:
					'Simulate the employee signing a statement: it becomes signed, the signed PDF becomes available and the asset-statement.signed webhook fires. Sandbox only.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/asset-statements/{{$parameter["id"]}}/simulate-signature',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['areaCode'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many area codes',
				description:
					'List the area codes (DDD) where your company can create a line of the given type, and whether a number is available in each right now',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/area-codes',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['company'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many companies',
				description:
					'List the companies the credential can access: a company key returns its own company; an organization key returns every company in the organization',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/companies',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['costCenter'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a cost center',
				description: 'Create a cost center',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/cost-centers',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a cost center',
				description:
					'Delete a cost center, moving its phone accounts and employees to a replacement cost center (or to none)',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/api/v3/cost-centers/{{$parameter["id"]}}',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ { "success": true } }}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a cost center',
				description: 'Get a cost center by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/cost-centers/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many cost centers',
				description: 'List your company cost centers, sorted by name',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/cost-centers',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a cost center',
				description: 'Update a cost center. Only the fields you set are changed.',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v3/cost-centers/{{$parameter["id"]}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['employee'],
			},
		},
		options: [
			{
				name: 'Batch Sync',
				value: 'batchSync',
				action: 'Batch sync employees',
				description:
					'Create or update many employees at once, matched by your integrationId, all or nothing. Runs in the background and returns a task ID (see Task > Get).',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/employees/batch-sync',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an employee',
				description: 'Create an employee',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/employees',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an employee',
				description:
					'Delete an employee together with everything your integrations brought in about them. Cannot be undone through the API.',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/api/v3/employees/{{$parameter["id"]}}',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ { "success": true } }}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an employee',
				description: 'Get an employee by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/employees/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many employees',
				description: 'List your company employees, newest first by default',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/employees',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an employee',
				description:
					'Update an employee. Only the fields you set are changed; an empty value clears your edit and falls back to integration data, if any.',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v3/employees/{{$parameter["id"]}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
			},
		},
		options: [
			{
				name: 'Download NFe PDF',
				value: 'downloadNfePdf',
				action: 'Download the NFE PDF of an invoice',
				description: 'Download the PDF (DANFE) of the invoice’s NF-e, when there is one',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/invoices/{{$parameter["id"]}}/nfe/pdf',
						encoding: 'arraybuffer',
						json: false,
						headers: {
							Accept: 'application/pdf',
						},
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ {} }}',
								},
							},
							{
								type: 'binaryData',
								properties: {
									destinationProperty: '={{$parameter["binaryPropertyName"]}}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Download NFe XML',
				value: 'downloadNfeXml',
				action: 'Download the NFE XML of an invoice',
				description: 'Download the XML of the invoice’s NF-e, when there is one',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/invoices/{{$parameter["id"]}}/nfe/xml',
						encoding: 'arraybuffer',
						json: false,
						headers: {
							Accept: 'application/xml',
						},
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ {} }}',
								},
							},
							{
								type: 'binaryData',
								properties: {
									destinationProperty: '={{$parameter["binaryPropertyName"]}}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Download PDF',
				value: 'downloadPdf',
				action: 'Download the PDF of an invoice',
				description:
					'Download the invoice PDF with the current payment data (boleto and Pix). Not available in sandbox (always 404).',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/invoices/{{$parameter["id"]}}/pdf',
						encoding: 'arraybuffer',
						json: false,
						headers: {
							Accept: 'application/pdf',
						},
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ {} }}',
								},
							},
							{
								type: 'binaryData',
								properties: {
									destinationProperty: '={{$parameter["binaryPropertyName"]}}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an invoice',
				description: 'Get an invoice by ID, with its items, NF-e and per-line breakdown',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/invoices/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many invoices',
				description: 'List invoices sorted by due date',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/invoices',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get Phone Accounts',
				value: 'getPhoneAccounts',
				action: 'Get the line breakdown of an invoice',
				description:
					'List the per-phone-account breakdown of an invoice, highest amount first. Empty for non-telecom invoices.',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/invoices/{{$parameter["id"]}}/phone-accounts',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
			},
		},
		options: [
			{
				name: 'Activate',
				value: 'activate',
				action: 'Activate a phone account',
				description:
					'Retry the activation of an existing mobile phone account. Does not create a new line. Retrying on an active or activating line has no effect.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/activate',
					},
				},
			},
			{
				name: 'Batch Update Cost Center',
				value: 'batchUpdateCostCenter',
				action: 'Batch update the cost center of phone accounts',
				description:
					'Apply a cost center to many phone accounts at once, all or nothing. Runs in the background and returns a task ID (see Task > Get).',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/batch-update-cost-center',
					},
				},
			},
			{
				name: 'Block',
				value: 'block',
				action: 'Block a phone account',
				description: 'Block a phone account. Blocking an already blocked line has no effect.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/block',
					},
				},
			},
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel a phone account',
				description:
					'Cancel a phone account, immediately or at the end of the current billing cycle (scheduled)',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/cancel',
					},
				},
			},
			{
				name: 'Create Mobile',
				value: 'createMobile',
				action: 'Create a mobile phone account',
				description:
					'Create a mobile phone account with a physical SIM or an eSIM. The line starts pending activation; billing starts after activation.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/mobile',
					},
				},
			},
			{
				name: 'Create Mobile DID',
				value: 'createMobileDid',
				action: 'Create a mobile DID phone account',
				description:
					'Create a mobile DID (virtual number) phone account. It is available right away; billing starts when the number is validated in an app. In sandbox only area code 41 is accepted.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/mobile-did',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a phone account',
				description: 'Get a phone account by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Data Balance',
				value: 'getBalance',
				action: 'Get the data balance of a phone account',
				description:
					'Get the data balance of an active phone account, refreshing it first when the last reading is stale',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/balance',
					},
				},
			},
			{
				name: 'Get eSIM',
				value: 'getEsim',
				action: 'Get the embedded SIM activation data of a phone account',
				description:
					'Get the eSIM activation data of a phone account. While provisioning, status is "provisioning" and the other fields are null; poll again shortly.',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/esim',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many phone accounts',
				description: 'List your company phone accounts, newest first',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/phone-accounts',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get SMS Messages',
				value: 'getSmsMessages',
				action: 'Get SMS messages of a phone account',
				description:
					'List the SMS messages received by a DID phone account, newest first. Other line types return an empty list.',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/sms-messages',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Simulate SMS',
				value: 'simulateSms',
				action: 'Simulate an incoming SMS on a phone account',
				description: 'Simulate an incoming SMS on a phone account. Sandbox only.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/sms',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ { "success": true } }}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Top Up Data',
				value: 'topUpData',
				action: 'Top up data on a phone account',
				description: 'Add data to the allowance of a mobile or global phone account',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/top-up-data',
					},
				},
			},
			{
				name: 'Unblock',
				value: 'unblock',
				action: 'Unblock a phone account',
				description:
					'Unblock a phone account. Blocks placed by Salvy (non-payment, company cancellation, partial block) are not lifted here.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/unblock',
					},
				},
			},
			{
				name: 'Unschedule Cancellation',
				value: 'unscheduleCancellation',
				action: 'Unschedule the cancellation of a phone account',
				description:
					'Undo a scheduled cancellation so the phone account keeps working after the billing cycle ends',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}/unschedule-cancellation',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a phone account',
				description: 'Update a phone account. Only the fields you set are changed.',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v3/phone-accounts/{{$parameter["id"]}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a phone account group',
				description:
					'Create a phone account group. If a group with the same name already exists, it is returned unchanged.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v3/phone-account-groups',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a phone account group',
				description:
					'Delete a phone account group. Its phone accounts stay active and end up without a group.',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/api/v3/phone-account-groups/{{$parameter["id"]}}',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ { "success": true } }}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a phone account group',
				description: 'Get a phone account group by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/phone-account-groups/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many phone account groups',
				description: 'List your company phone account groups, sorted by name',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/phone-account-groups',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a phone account group',
				description: 'Update a phone account group. Only the fields you set are changed.',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v3/phone-account-groups/{{$parameter["id"]}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['plan'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a plan',
				description: 'Get a mobile plan available to your company by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/plans/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many plans',
				description: 'List the mobile plans available to your company, sorted by name',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/plans',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a task',
				description:
					'Get the progress of a background task started by one of your API keys, with applied, failed, pending and canceled item counts',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/tasks/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Results',
				value: 'getResults',
				action: 'Get the results of a task',
				description:
					'List the result of each processed item of a task, in the order the items were submitted. The "type" field tells the task kind and the shape of each item in "data".',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v3/tasks/{{$parameter["id"]}}/results',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								enabled:
									'={{ !($parameter.returnAll === true || $parameter.returnAll === "true") }}',
								properties: {
									value:
										'={{ { data: $response.body.data.length ? $response.body.data.map((record) => Object.assign({}, record, { totalCount: $response.body.pagination.totalCount })) : [{ totalCount: $response.body.pagination.totalCount }] } }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Asset ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['archive'],
			},
		},
	},
	{
		displayName: 'Asset ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createTimelineNote'],
			},
		},
	},
	{
		displayName: 'Note',
		name: 'note',
		description: 'Text of the note to record on the timeline',
		type: 'string',
		default: '',
		placeholder: 'Device replaced due to SSD issues.',
		routing: {
			send: {
				type: 'body',
				property: 'note',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createTimelineNote'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createTimelineNote'],
			},
		},
		options: [
			{
				displayName: 'Author Name',
				name: 'authorName',
				description: "Name of the note's author",
				type: 'string',
				default: '',
				placeholder: 'John Smith',
				routing: {
					send: {
						type: 'body',
						property: 'authorName',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
								includeArchived: '={{ $request.qs["includeArchived"] }}',
								status: '={{ $request.qs["status"] }}',
								category: '={{ $request.qs["category"] }}',
								employeeId: '={{ $request.qs["employeeId"] }}',
								serialNumber: '={{ $request.qs["serialNumber"] }}',
								enrollmentId: '={{ $request.qs["enrollmentId"] }}',
								createdAtFrom: '={{ $request.qs["createdAtFrom"] }}',
								createdAtTo: '={{ $request.qs["createdAtTo"] }}',
								sortBy: '={{ $request.qs["sortBy"] }}',
								sortOrder: '={{ $request.qs["sortOrder"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				description:
					'Filter by exact asset category. Use __null__ for assets without a category. Comma-separated for multiple values.',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'category',
						propertyInDotNotation: false,
						value: '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Created At From',
				name: 'createdAtFrom',
				description: 'Assets created from this date on (inclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2026-05-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'createdAtFrom',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Created At To',
				name: 'createdAtTo',
				description: 'Assets created before this date (exclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2026-06-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'createdAtTo',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				description:
					'Filter by the employees the assets are attached to. Use __null__ for assets without an employee. Comma-separated for multiple values.',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'employeeId',
						propertyInDotNotation: false,
						value: '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Enrollment ID',
				name: 'enrollmentId',
				description: 'Filter by exact asset tag (enrollment number)',
				type: 'string',
				default: '',
				placeholder: 'SLY-12345',
				routing: {
					send: {
						type: 'query',
						property: 'enrollmentId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Include Archived',
				name: 'includeArchived',
				description: 'Whether to include archived assets in the response (default: false)',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'query',
						property: 'includeArchived',
						propertyInDotNotation: false,
						value: '={{ String($value) }}',
					},
				},
			},
			{
				displayName: 'Serial Number',
				name: 'serialNumber',
				description: 'Filter by exact asset serial number',
				type: 'string',
				default: '',
				placeholder: 'SN1234567890',
				routing: {
					send: {
						type: 'query',
						property: 'serialNumber',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Filter by asset status. Does not include archived; use Include Archived to bring archived assets. Values: `available`, `in-use`, `allocated`, `maintenance`, `broken`, `lost`, `stolen`, `sold`, `donated`, `discarded`, `obsolete`, `blocked`, `pending-verification`, `awaiting-quote`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Allocated',
						value: 'allocated',
					},
					{
						name: 'Available',
						value: 'available',
					},
					{
						name: 'Awaiting Quote',
						value: 'awaiting-quote',
					},
					{
						name: 'Blocked',
						value: 'blocked',
					},
					{
						name: 'Broken',
						value: 'broken',
					},
					{
						name: 'Discarded',
						value: 'discarded',
					},
					{
						name: 'Donated',
						value: 'donated',
					},
					{
						name: 'In Use',
						value: 'in-use',
					},
					{
						name: 'Lost',
						value: 'lost',
					},
					{
						name: 'Maintenance',
						value: 'maintenance',
					},
					{
						name: 'Obsolete',
						value: 'obsolete',
					},
					{
						name: 'Pending Verification',
						value: 'pending-verification',
					},
					{
						name: 'Sold',
						value: 'sold',
					},
					{
						name: 'Stolen',
						value: 'stolen',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'status',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				description:
					'Field used to sort the results. Default: createdAt. Values: `createdAt`, `enrollmentId`, `category`.',
				type: 'options',
				options: [
					{
						name: 'Category',
						value: 'category',
					},
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Enrollment ID',
						value: 'enrollmentId',
					},
				],
				default: 'createdAt',
				routing: {
					send: {
						type: 'query',
						property: 'sortBy',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				description: 'Sort direction. Default: desc. Values: `asc`, `desc`.',
				type: 'options',
				options: [
					{
						name: 'Asc',
						value: 'asc',
					},
					{
						name: 'Desc',
						value: 'desc',
					},
				],
				default: 'asc',
				routing: {
					send: {
						type: 'query',
						property: 'sortOrder',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentId',
		description: 'Asset tag (enrollment number) of the asset',
		type: 'string',
		default: '',
		placeholder: 'SLY-12345',
		routing: {
			send: {
				type: 'body',
				property: 'enrollmentId',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		description:
			'Asset status. Archived is not accepted on creation; archive the asset with Asset > Archive after creating it. Values: `available`, `in-use`, `allocated`, `maintenance`, `broken`, `lost`, `stolen`, `sold`, `donated`, `discarded`, `obsolete`, `blocked`, `pending-verification`, `awaiting-quote`.',
		type: 'options',
		options: [
			{
				name: 'Allocated',
				value: 'allocated',
			},
			{
				name: 'Available',
				value: 'available',
			},
			{
				name: 'Awaiting Quote',
				value: 'awaiting-quote',
			},
			{
				name: 'Blocked',
				value: 'blocked',
			},
			{
				name: 'Broken',
				value: 'broken',
			},
			{
				name: 'Discarded',
				value: 'discarded',
			},
			{
				name: 'Donated',
				value: 'donated',
			},
			{
				name: 'In Use',
				value: 'in-use',
			},
			{
				name: 'Lost',
				value: 'lost',
			},
			{
				name: 'Maintenance',
				value: 'maintenance',
			},
			{
				name: 'Obsolete',
				value: 'obsolete',
			},
			{
				name: 'Pending Verification',
				value: 'pending-verification',
			},
			{
				name: 'Sold',
				value: 'sold',
			},
			{
				name: 'Stolen',
				value: 'stolen',
			},
		],
		default: 'available',
		routing: {
			send: {
				type: 'body',
				property: 'status',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Acquisition Date',
				name: 'acquisitionDate',
				description: 'Asset acquisition date',
				type: 'string',
				default: '',
				placeholder: '2025-12-10',
				routing: {
					send: {
						type: 'body',
						property: 'acquisitionDate',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Acquisition Type',
				name: 'acquisitionType',
				description: 'How the asset was acquired. Values: `bought`, `rented`, `other`.',
				type: 'options',
				options: [
					{
						name: 'Bought',
						value: 'bought',
					},
					{
						name: 'Other',
						value: 'other',
					},
					{
						name: 'Rented',
						value: 'rented',
					},
				],
				default: 'bought',
				routing: {
					send: {
						type: 'body',
						property: 'acquisitionType',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Allocated Location',
				name: 'allocatedLocation',
				description: 'Where the asset is allocated',
				type: 'string',
				default: '',
				placeholder: 'HR Room',
				routing: {
					send: {
						type: 'body',
						property: 'allocatedLocation',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Brand',
				name: 'brand',
				description: 'Asset brand',
				type: 'string',
				default: '',
				placeholder: 'Dell',
				routing: {
					send: {
						type: 'body',
						property: 'brand',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Category',
				name: 'category',
				description:
					'Asset category. A category with this name is created automatically if it does not exist yet.',
				type: 'string',
				default: '',
				placeholder: 'notebook',
				routing: {
					send: {
						type: 'body',
						property: 'category',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Contract ID',
				name: 'contractId',
				description: 'Identifier of the contract related to the asset',
				type: 'string',
				default: '',
				placeholder: 'CT-2024-0001',
				routing: {
					send: {
						type: 'body',
						property: 'contractId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				description: 'Custom fields of the asset',
				type: 'json',
				default: '[\n  {\n    "label": "teste",\n    "value": "teste"\n  }\n]',
				routing: {
					send: {
						type: 'body',
						property: 'customFields',
						propertyInDotNotation: false,
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Employee Attached At',
				name: 'employeeAttachedAt',
				description: 'Date the employee was attached to the asset',
				type: 'string',
				default: '',
				placeholder: '2025-01-01T00:00:00.000Z',
				routing: {
					send: {
						type: 'body',
						property: 'employeeAttachedAt',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				description:
					'ID of the employee the asset is assigned to. Must belong to the same company as the API key.',
				type: 'string',
				default: '',
				placeholder: '123e4567-e89b-12d3-a456-426614174000',
				routing: {
					send: {
						type: 'body',
						property: 'employeeId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Idempotency key for this request. Will return the same response if the same request is made again with the same key. Fails if parameters are different.',
				routing: {
					request: {
						headers: {
							'idempotency-key': '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Model',
				name: 'model',
				description: 'Asset model',
				type: 'string',
				default: '',
				placeholder: 'XPS 13',
				routing: {
					send: {
						type: 'body',
						property: 'model',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'NFe Number',
				name: 'nfeNumber',
				description: 'Number of the acquisition invoice (NF-e) of the asset',
				type: 'string',
				default: '',
				placeholder: '000123456789',
				routing: {
					send: {
						type: 'body',
						property: 'nfeNumber',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Price Cents',
				name: 'priceCents',
				description: 'Acquisition price of the asset, in cents',
				type: 'number',
				default: 0,
				routing: {
					send: {
						type: 'body',
						property: 'priceCents',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Serial Number',
				name: 'serialNumber',
				description: 'Asset serial number',
				type: 'string',
				default: '',
				placeholder: 'SN1234567890',
				routing: {
					send: {
						type: 'body',
						property: 'serialNumber',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Vendor Name',
				name: 'vendorName',
				description: "Name of the asset's vendor",
				type: 'string',
				default: '',
				placeholder: 'Tech Supplier Inc.',
				routing: {
					send: {
						type: 'body',
						property: 'vendorName',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Warranty Expiration Date',
				name: 'warrantyExpirationDate',
				description: 'Asset warranty expiration date',
				type: 'string',
				default: '',
				placeholder: '2025-12-24',
				routing: {
					send: {
						type: 'body',
						property: 'warrantyExpirationDate',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Asset ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Asset ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Acquisition Date',
				name: 'acquisitionDate',
				description: 'Asset acquisition date',
				type: 'string',
				default: '',
				placeholder: '2025-12-10',
				routing: {
					send: {
						type: 'body',
						property: 'acquisitionDate',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Acquisition Type',
				name: 'acquisitionType',
				description: 'How the asset was acquired. Values: `bought`, `rented`, `other`.',
				type: 'options',
				options: [
					{
						name: 'Bought',
						value: 'bought',
					},
					{
						name: 'Other',
						value: 'other',
					},
					{
						name: 'Rented',
						value: 'rented',
					},
				],
				default: 'bought',
				routing: {
					send: {
						type: 'body',
						property: 'acquisitionType',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Allocated Location',
				name: 'allocatedLocation',
				description: 'Where the asset is allocated',
				type: 'string',
				default: '',
				placeholder: 'HR Room',
				routing: {
					send: {
						type: 'body',
						property: 'allocatedLocation',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Brand',
				name: 'brand',
				description: 'Asset brand',
				type: 'string',
				default: '',
				placeholder: 'Dell',
				routing: {
					send: {
						type: 'body',
						property: 'brand',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Category',
				name: 'category',
				description:
					'Asset category. A category with this name is created automatically if it does not exist yet.',
				type: 'string',
				default: '',
				placeholder: 'notebook',
				routing: {
					send: {
						type: 'body',
						property: 'category',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Contract ID',
				name: 'contractId',
				description: 'Identifier of the contract related to the asset',
				type: 'string',
				default: '',
				placeholder: 'CT-2024-0001',
				routing: {
					send: {
						type: 'body',
						property: 'contractId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				description: 'Custom fields of the asset',
				type: 'json',
				default: '[\n  {\n    "label": "teste",\n    "value": "teste"\n  }\n]',
				routing: {
					send: {
						type: 'body',
						property: 'customFields',
						propertyInDotNotation: false,
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Employee Attached At',
				name: 'employeeAttachedAt',
				description:
					'Date the employee was attached to the asset. Removed automatically if the employee is detached.',
				type: 'string',
				default: '',
				placeholder: '2025-01-01T00:00:00.000Z',
				routing: {
					send: {
						type: 'body',
						property: 'employeeAttachedAt',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				description:
					'ID of the employee the asset is assigned to. Must belong to the same company as the API key. Leave empty to remove the association.',
				type: 'string',
				default: '',
				placeholder: '123e4567-e89b-12d3-a456-426614174000',
				routing: {
					send: {
						type: 'body',
						property: 'employeeId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Enrollment ID',
				name: 'enrollmentId',
				description: 'Asset tag (enrollment number) of the asset',
				type: 'string',
				default: '',
				placeholder: 'SLY-12345',
				routing: {
					send: {
						type: 'body',
						property: 'enrollmentId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Model',
				name: 'model',
				description: 'Asset model',
				type: 'string',
				default: '',
				placeholder: 'XPS 13',
				routing: {
					send: {
						type: 'body',
						property: 'model',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'NFe Number',
				name: 'nfeNumber',
				description: 'Number of the acquisition invoice (NF-e) of the asset',
				type: 'string',
				default: '',
				placeholder: '000123456789',
				routing: {
					send: {
						type: 'body',
						property: 'nfeNumber',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Price Cents',
				name: 'priceCents',
				description: 'Acquisition price of the asset, in cents',
				type: 'number',
				default: 0,
				routing: {
					send: {
						type: 'body',
						property: 'priceCents',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Serial Number',
				name: 'serialNumber',
				description: 'Asset serial number',
				type: 'string',
				default: '',
				placeholder: 'SN1234567890',
				routing: {
					send: {
						type: 'body',
						property: 'serialNumber',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Asset status. Archived is not accepted here; use Asset > Archive or Asset > Unarchive. Values: `available`, `in-use`, `allocated`, `maintenance`, `broken`, `lost`, `stolen`, `sold`, `donated`, `discarded`, `obsolete`, `blocked`, `pending-verification`, `awaiting-quote`.',
				type: 'options',
				options: [
					{
						name: 'Allocated',
						value: 'allocated',
					},
					{
						name: 'Available',
						value: 'available',
					},
					{
						name: 'Awaiting Quote',
						value: 'awaiting-quote',
					},
					{
						name: 'Blocked',
						value: 'blocked',
					},
					{
						name: 'Broken',
						value: 'broken',
					},
					{
						name: 'Discarded',
						value: 'discarded',
					},
					{
						name: 'Donated',
						value: 'donated',
					},
					{
						name: 'In Use',
						value: 'in-use',
					},
					{
						name: 'Lost',
						value: 'lost',
					},
					{
						name: 'Maintenance',
						value: 'maintenance',
					},
					{
						name: 'Obsolete',
						value: 'obsolete',
					},
					{
						name: 'Pending Verification',
						value: 'pending-verification',
					},
					{
						name: 'Sold',
						value: 'sold',
					},
					{
						name: 'Stolen',
						value: 'stolen',
					},
				],
				default: 'available',
				routing: {
					send: {
						type: 'body',
						property: 'status',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Vendor Name',
				name: 'vendorName',
				description: "Name of the asset's vendor",
				type: 'string',
				default: '',
				placeholder: 'Tech Supplier Inc.',
				routing: {
					send: {
						type: 'body',
						property: 'vendorName',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Warranty Expiration Date',
				name: 'warrantyExpirationDate',
				description: 'Asset warranty expiration date',
				type: 'string',
				default: '',
				placeholder: '2025-12-24',
				routing: {
					send: {
						type: 'body',
						property: 'warrantyExpirationDate',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Asset ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['delete'],
			},
		},
	},
	{
		displayName: 'Asset ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['unarchive'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		description:
			"Asset status after unarchiving. Required: unarchiving does not restore the asset's previous status. Values: `available`, `in-use`, `allocated`, `maintenance`, `broken`, `lost`, `stolen`, `sold`, `donated`, `discarded`, `obsolete`, `blocked`, `pending-verification`, `awaiting-quote`.",
		type: 'options',
		options: [
			{
				name: 'Allocated',
				value: 'allocated',
			},
			{
				name: 'Available',
				value: 'available',
			},
			{
				name: 'Awaiting Quote',
				value: 'awaiting-quote',
			},
			{
				name: 'Blocked',
				value: 'blocked',
			},
			{
				name: 'Broken',
				value: 'broken',
			},
			{
				name: 'Discarded',
				value: 'discarded',
			},
			{
				name: 'Donated',
				value: 'donated',
			},
			{
				name: 'In Use',
				value: 'in-use',
			},
			{
				name: 'Lost',
				value: 'lost',
			},
			{
				name: 'Maintenance',
				value: 'maintenance',
			},
			{
				name: 'Obsolete',
				value: 'obsolete',
			},
			{
				name: 'Pending Verification',
				value: 'pending-verification',
			},
			{
				name: 'Sold',
				value: 'sold',
			},
			{
				name: 'Stolen',
				value: 'stolen',
			},
		],
		default: 'available',
		routing: {
			send: {
				type: 'body',
				property: 'status',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['unarchive'],
			},
		},
	},
	{
		displayName: 'Asset Statement ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset statement',
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Asset Statement ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset statement',
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['downloadSignedFile'],
			},
		},
	},
	{
		displayName: 'Put Output File in Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		hint: 'The name of the output binary field to put the file in',
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['downloadSignedFile'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
								assetId: '={{ $request.qs["assetId"] }}',
								employeeId: '={{ $request.qs["employeeId"] }}',
								status: '={{ $request.qs["status"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Asset ID',
				name: 'assetId',
				description:
					'Only statements that include any of these assets. Comma-separated for multiple values.',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'assetId',
						propertyInDotNotation: false,
						value: '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				description:
					'Only statements signed (or to be signed) by these employees. Comma-separated for multiple values.',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'employeeId',
						propertyInDotNotation: false,
						value: '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Filter by statement status. Values: `pending-signature`, `signed`, `canceled`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Canceled',
						value: 'canceled',
					},
					{
						name: 'Pending Signature',
						value: 'pending-signature',
					},
					{
						name: 'Signed',
						value: 'signed',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'status',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Type',
		name: 'type',
		description: 'Kind of statement to send. Values: `responsibility`, `return`.',
		type: 'options',
		options: [
			{
				name: 'Responsibility',
				value: 'responsibility',
				description:
					'Sent when assets are handed over; signed by the employee the assets are assigned to',
			},
			{
				name: 'Return',
				value: 'return',
				description: 'Sent when the employee returns the assets',
			},
		],
		default: 'responsibility',
		routing: {
			send: {
				type: 'body',
				property: 'type',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'Asset IDs',
		name: 'assetIds',
		description:
			'IDs of the assets listed in the statement, up to 6. All must belong to the same company. Comma-separated.',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'assetIds',
				propertyInDotNotation: false,
				value: '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'Employee ID',
		name: 'employeeId',
		description:
			'ID of the employee who returns the assets and signs the statement. Must belong to the same company as the assets.',
		type: 'string',
		default: '',
		placeholder: '123e4567-e89b-12d3-a456-426614174000',
		routing: {
			send: {
				type: 'body',
				property: 'employeeId',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['send'],
				type: ['return'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Idempotency key for this request. Will return the same response if the same request is made again with the same key. Fails if parameters are different.',
				routing: {
					request: {
						headers: {
							'idempotency-key': '={{ $value }}',
						},
					},
				},
			},
		],
	},
	{
		displayName: 'Asset Statement ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the asset statement',
		displayOptions: {
			show: {
				resource: ['assetStatement'],
				operation: ['simulateSignature'],
			},
		},
	},
	{
		displayName: 'Product Type',
		name: 'productType',
		description:
			'Line type to list area codes for: mobile (mobile line) or mobile-did (virtual number). One type per request. Values: `mobile`, `mobile-did`.',
		type: 'options',
		options: [
			{
				name: 'Mobile',
				value: 'mobile',
			},
			{
				name: 'Mobile DID',
				value: 'mobile-did',
			},
		],
		default: 'mobile',
		routing: {
			send: {
				type: 'query',
				property: 'productType',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['areaCode'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['areaCode'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Available',
				name: 'available',
				description:
					'Whether to return only area codes with a number available right now (on) or only those without one (off)',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'query',
						property: 'available',
						propertyInDotNotation: false,
						value: '={{ String($value) }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
								status: '={{ $request.qs["status"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Filter by cost center status. Values: `active`, `disabled`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Disabled',
						value: 'disabled',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'status',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Code',
		name: 'code',
		description: 'Cost center code defined by your company',
		type: 'string',
		default: '',
		placeholder: 'ENG-01',
		routing: {
			send: {
				type: 'body',
				property: 'code',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		description: 'Cost center name',
		type: 'string',
		default: '',
		placeholder: 'Engineering',
		routing: {
			send: {
				type: 'body',
				property: 'name',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				description: 'Date on which the cost center is disabled automatically',
				type: 'string',
				default: '',
				placeholder: '2026-08-31',
				routing: {
					send: {
						type: 'body',
						property: 'endDate',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Idempotency key for this request. Will return the same response if the same request is made again with the same key. Fails if parameters are different.',
				routing: {
					request: {
						headers: {
							'idempotency-key': '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Parent ID',
				name: 'parentId',
				description:
					'ID of the cost center this one is nested under. Leave empty to keep it at the root.',
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'parentId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Responsible Employee ID',
				name: 'responsibleEmployeeId',
				description: 'ID of the employee responsible for the cost center',
				type: 'string',
				default: '',
				placeholder: '0197aa3e-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'responsibleEmployeeId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Cost center status: active (in use) or disabled (disabled by the company). Defaults to active when omitted. Values: `active`, `disabled`.',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Disabled',
						value: 'disabled',
					},
				],
				default: 'active',
				routing: {
					send: {
						type: 'body',
						property: 'status',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Type',
				name: 'type',
				description:
					'Cost center type: standard or project (a project of the parent cost center). Values: `standard`, `project`.',
				type: 'options',
				options: [
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Standard',
						value: 'standard',
					},
				],
				default: 'standard',
				routing: {
					send: {
						type: 'body',
						property: 'type',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Cost Center ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the cost center',
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Cost Center ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the cost center',
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Code',
				name: 'code',
				description: 'Cost center code defined by your company',
				type: 'string',
				default: '',
				placeholder: 'ENG-01',
				routing: {
					send: {
						type: 'body',
						property: 'code',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				description: 'Date on which the cost center is disabled automatically',
				type: 'string',
				default: '',
				placeholder: '2026-08-31',
				routing: {
					send: {
						type: 'body',
						property: 'endDate',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				description: 'Cost center name',
				type: 'string',
				default: '',
				placeholder: 'Engineering',
				routing: {
					send: {
						type: 'body',
						property: 'name',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Parent ID',
				name: 'parentId',
				description:
					'ID of the cost center this one is nested under. Leave empty to keep it at the root.',
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'parentId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Responsible Employee ID',
				name: 'responsibleEmployeeId',
				description:
					'ID of the employee responsible for the cost center. Leave empty to remove the current responsible employee.',
				type: 'string',
				default: '',
				placeholder: '0197aa3e-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'responsibleEmployeeId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Cost center status: active (in use) or disabled (disabled by the company). Values: `active`, `disabled`.',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Disabled',
						value: 'disabled',
					},
				],
				default: 'active',
				routing: {
					send: {
						type: 'body',
						property: 'status',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Type',
				name: 'type',
				description:
					'Cost center type: standard or project (a project of the parent cost center). Values: `standard`, `project`.',
				type: 'options',
				options: [
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Standard',
						value: 'standard',
					},
				],
				default: 'standard',
				routing: {
					send: {
						type: 'body',
						property: 'type',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Cost Center ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the cost center',
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['delete'],
			},
		},
	},
	{
		displayName: 'Replacement ID',
		name: 'replacementId',
		description:
			'Cost center that receives the phone accounts and employees linked to the deleted one. Leave empty to leave them without a cost center.',
		type: 'string',
		default: '',
		placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
		routing: {
			send: {
				type: 'body',
				property: 'replacementId',
				propertyInDotNotation: false,
				value: '={{ $value === "" ? null : $value }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['costCenter'],
				operation: ['delete'],
			},
		},
	},
	{
		displayName: 'Employees',
		name: 'employees',
		description:
			'Employees to create or update, up to 1,000 per request, each with a distinct integrationId. The request body is limited to 1 MB; split larger syncs into several requests.',
		type: 'json',
		default: '[]',
		routing: {
			send: {
				type: 'body',
				property: 'employees',
				propertyInDotNotation: false,
				value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['batchSync'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['batchSync'],
			},
		},
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Idempotency key for this request. Will return the same response if the same request is made again with the same key. Fails if parameters are different.',
				routing: {
					request: {
						headers: {
							'idempotency-key': '={{ $value }}',
						},
					},
				},
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
								status: '={{ $request.qs["status"] }}',
								contractType: '={{ $request.qs["contractType"] }}',
								cpf: '={{ $request.qs["cpf"] }}',
								admittedAtFrom: '={{ $request.qs["admittedAtFrom"] }}',
								admittedAtTo: '={{ $request.qs["admittedAtTo"] }}',
								terminatedAtFrom: '={{ $request.qs["terminatedAtFrom"] }}',
								terminatedAtTo: '={{ $request.qs["terminatedAtTo"] }}',
								sortBy: '={{ $request.qs["sortBy"] }}',
								sortOrder: '={{ $request.qs["sortOrder"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Admitted At From',
				name: 'admittedAtFrom',
				description: 'Employees admitted from this date on (inclusive), YYYY-MM-DD',
				type: 'string',
				default: '',
				placeholder: '2026-05-01',
				routing: {
					send: {
						type: 'query',
						property: 'admittedAtFrom',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Admitted At To',
				name: 'admittedAtTo',
				description:
					'Employees admitted before this date (exclusive), YYYY-MM-DD. To include a whole day, use the next day (e.g. 2026-06-01 to include all of 2026-05-31).',
				type: 'string',
				default: '',
				placeholder: '2026-06-01',
				routing: {
					send: {
						type: 'query',
						property: 'admittedAtTo',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Contract Type',
				name: 'contractType',
				description:
					'Filter by employee contract type. Use __null__ for employees without a contract type. Values: `pj`, `clt`, `intern`, `apprentice`, `temporary`, `third-party`, `__null__`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Apprentice',
						value: 'apprentice',
					},
					{
						name: 'CLT',
						value: 'clt',
					},
					{
						name: 'Intern',
						value: 'intern',
					},
					{
						name: 'Not Set',
						value: '__null__',
					},
					{
						name: 'PJ',
						value: 'pj',
					},
					{
						name: 'Temporary',
						value: 'temporary',
					},
					{
						name: 'Third Party',
						value: 'third-party',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'contractType',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'CPF',
				name: 'cpf',
				description:
					"Filter by the employee's exact CPF. Accepts formatted (with punctuation) or digits only.",
				type: 'string',
				default: '',
				placeholder: '198.099.750-07',
				routing: {
					send: {
						type: 'query',
						property: 'cpf',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Filter by employee status. Values: `active`, `terminated`, `on-hold`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'On Hold',
						value: 'on-hold',
					},
					{
						name: 'Terminated',
						value: 'terminated',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'status',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Terminated At From',
				name: 'terminatedAtFrom',
				description: 'Employees terminated from this date on (inclusive), YYYY-MM-DD',
				type: 'string',
				default: '',
				placeholder: '2026-05-01',
				routing: {
					send: {
						type: 'query',
						property: 'terminatedAtFrom',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Terminated At To',
				name: 'terminatedAtTo',
				description:
					'Employees terminated before this date (exclusive), YYYY-MM-DD. To include a whole day, use the next day (e.g. 2026-06-01 to include all of 2026-05-31).',
				type: 'string',
				default: '',
				placeholder: '2026-06-01',
				routing: {
					send: {
						type: 'query',
						property: 'terminatedAtTo',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				description:
					'Field used to sort the results. Default: createdAt. Values: `createdAt`, `fullName`, `admittedAt`.',
				type: 'options',
				options: [
					{
						name: 'Admitted At',
						value: 'admittedAt',
					},
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Full Name',
						value: 'fullName',
					},
				],
				default: 'createdAt',
				routing: {
					send: {
						type: 'query',
						property: 'sortBy',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				description: 'Sort direction. Default: desc. Values: `asc`, `desc`.',
				type: 'options',
				options: [
					{
						name: 'Asc',
						value: 'asc',
					},
					{
						name: 'Desc',
						value: 'desc',
					},
				],
				default: 'asc',
				routing: {
					send: {
						type: 'query',
						property: 'sortOrder',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Full Name',
		name: 'fullName',
		type: 'string',
		default: '',
		placeholder: 'John Smith',
		routing: {
			send: {
				type: 'body',
				property: 'fullName',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		description: 'Employee status. Values: `active`, `terminated`, `on-hold`.',
		type: 'options',
		options: [
			{
				name: 'Active',
				value: 'active',
			},
			{
				name: 'On Hold',
				value: 'on-hold',
			},
			{
				name: 'Terminated',
				value: 'terminated',
			},
		],
		default: 'active',
		routing: {
			send: {
				type: 'body',
				property: 'status',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'collection',
		placeholder: 'Add Address Field',
		default: {},
		description: 'Employee address',
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.city',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Complement',
				name: 'complement',
				type: 'string',
				default: '',
				description: 'Address complement',
				routing: {
					send: {
						type: 'body',
						property: 'address.complement',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.country',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Neighborhood',
				name: 'neighborhood',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.neighborhood',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.state',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Street Name',
				name: 'streetName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.streetName',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Street Number',
				name: 'streetNumber',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.streetNumber',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Zip Code',
				name: 'zipCode',
				type: 'string',
				default: '',
				description: 'ZIP code (CEP)',
				routing: {
					send: {
						type: 'body',
						property: 'address.zipCode',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
		],
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Admitted At',
				name: 'admittedAt',
				description: 'Admission date',
				type: 'string',
				default: '',
				placeholder: '2020-05-27',
				routing: {
					send: {
						type: 'body',
						property: 'admittedAt',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Area',
				name: 'area',
				description: 'Department',
				type: 'string',
				default: '',
				placeholder: 'Engineering',
				routing: {
					send: {
						type: 'body',
						property: 'area',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Birth Date',
				name: 'birthDate',
				description: 'Date of birth',
				type: 'string',
				default: '',
				placeholder: '1990-04-15',
				routing: {
					send: {
						type: 'body',
						property: 'birthDate',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Cost Center ID',
				name: 'costCenterId',
				description:
					"ID of the employee's cost center (see Cost Center > Get Many). Returns 404 if the cost center does not exist in the company.",
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'costCenterId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'CPF',
				name: 'cpf',
				description: 'CPF number',
				type: 'string',
				default: '',
				placeholder: '198.099.750-07',
				routing: {
					send: {
						type: 'body',
						property: 'cpf',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Idempotency key for this request. Will return the same response if the same request is made again with the same key. Fails if parameters are different.',
				routing: {
					request: {
						headers: {
							'idempotency-key': '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Manager Full Name',
				name: 'managerFullName',
				description: "Manager's full name",
				type: 'string',
				default: '',
				placeholder: 'Mary Johnson',
				routing: {
					send: {
						type: 'body',
						property: 'managerFullName',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Personal Email',
				name: 'personalEmail',
				type: 'string',
				default: '',
				placeholder: 'johnsmith04@gmail.com',
				routing: {
					send: {
						type: 'body',
						property: 'personalEmail',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Personal Phone Number',
				name: 'personalPhoneNumber',
				type: 'string',
				default: '',
				placeholder: '+5541987654321',
				routing: {
					send: {
						type: 'body',
						property: 'personalPhoneNumber',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Position',
				name: 'position',
				description: 'Job title',
				type: 'string',
				default: '',
				placeholder: 'Developer',
				routing: {
					send: {
						type: 'body',
						property: 'position',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Social Name',
				name: 'socialName',
				type: 'string',
				default: '',
				placeholder: 'John',
				routing: {
					send: {
						type: 'body',
						property: 'socialName',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Terminated At',
				name: 'terminatedAt',
				description: 'Termination date',
				type: 'string',
				default: '',
				placeholder: '2021-01-20',
				routing: {
					send: {
						type: 'body',
						property: 'terminatedAt',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Work Email',
				name: 'workEmail',
				type: 'string',
				default: '',
				placeholder: 'john.smith@company.com',
				routing: {
					send: {
						type: 'body',
						property: 'workEmail',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Work Phone Number',
				name: 'workPhoneNumber',
				type: 'string',
				default: '',
				placeholder: '+5541923456789',
				routing: {
					send: {
						type: 'body',
						property: 'workPhoneNumber',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Employee ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the employee',
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Employee ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the employee',
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'collection',
		placeholder: 'Add Address Field',
		default: {},
		description: 'Employee address. Clearing the address through this node is not supported.',
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.city',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Complement',
				name: 'complement',
				type: 'string',
				default: '',
				description: 'Address complement',
				routing: {
					send: {
						type: 'body',
						property: 'address.complement',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.country',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Neighborhood',
				name: 'neighborhood',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.neighborhood',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.state',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Street Name',
				name: 'streetName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.streetName',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Street Number',
				name: 'streetNumber',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'address.streetNumber',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Zip Code',
				name: 'zipCode',
				type: 'string',
				default: '',
				description: 'ZIP code (CEP)',
				routing: {
					send: {
						type: 'body',
						property: 'address.zipCode',
						propertyInDotNotation: true,
						value: '={{ $value }}',
					},
				},
			},
		],
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Admitted At',
				name: 'admittedAt',
				description: 'Admission date',
				type: 'string',
				default: '',
				placeholder: '2020-05-27',
				routing: {
					send: {
						type: 'body',
						property: 'admittedAt',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Area',
				name: 'area',
				description: 'Department',
				type: 'string',
				default: '',
				placeholder: 'Engineering',
				routing: {
					send: {
						type: 'body',
						property: 'area',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Birth Date',
				name: 'birthDate',
				description: 'Date of birth',
				type: 'string',
				default: '',
				placeholder: '1990-04-15',
				routing: {
					send: {
						type: 'body',
						property: 'birthDate',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Cost Center ID',
				name: 'costCenterId',
				description:
					"ID of the employee's cost center (see Cost Center > Get Many). Set another ID to change it, or leave empty to remove it. Returns 404 if the cost center does not exist in the company.",
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'costCenterId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'CPF',
				name: 'cpf',
				description: 'CPF number',
				type: 'string',
				default: '',
				placeholder: '198.099.750-07',
				routing: {
					send: {
						type: 'body',
						property: 'cpf',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Full Name',
				name: 'fullName',
				type: 'string',
				default: '',
				placeholder: 'John Smith',
				routing: {
					send: {
						type: 'body',
						property: 'fullName',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Manager Full Name',
				name: 'managerFullName',
				description: "Manager's full name",
				type: 'string',
				default: '',
				placeholder: 'Mary Johnson',
				routing: {
					send: {
						type: 'body',
						property: 'managerFullName',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Personal Email',
				name: 'personalEmail',
				type: 'string',
				default: '',
				placeholder: 'johnsmith04@gmail.com',
				routing: {
					send: {
						type: 'body',
						property: 'personalEmail',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Personal Phone Number',
				name: 'personalPhoneNumber',
				type: 'string',
				default: '',
				placeholder: '+5541987654321',
				routing: {
					send: {
						type: 'body',
						property: 'personalPhoneNumber',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Position',
				name: 'position',
				description: 'Job title',
				type: 'string',
				default: '',
				placeholder: 'Developer',
				routing: {
					send: {
						type: 'body',
						property: 'position',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Social Name',
				name: 'socialName',
				type: 'string',
				default: '',
				placeholder: 'John',
				routing: {
					send: {
						type: 'body',
						property: 'socialName',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description: 'Employee status. Values: `active`, `terminated`, `on-hold`.',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'On Hold',
						value: 'on-hold',
					},
					{
						name: 'Terminated',
						value: 'terminated',
					},
				],
				default: 'active',
				routing: {
					send: {
						type: 'body',
						property: 'status',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Terminated At',
				name: 'terminatedAt',
				description: 'Termination date',
				type: 'string',
				default: '',
				placeholder: '2021-01-20',
				routing: {
					send: {
						type: 'body',
						property: 'terminatedAt',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Work Email',
				name: 'workEmail',
				type: 'string',
				default: '',
				placeholder: 'john.smith@company.com',
				routing: {
					send: {
						type: 'body',
						property: 'workEmail',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Work Phone Number',
				name: 'workPhoneNumber',
				type: 'string',
				default: '',
				placeholder: '+5541923456789',
				routing: {
					send: {
						type: 'body',
						property: 'workPhoneNumber',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Employee ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the employee',
		displayOptions: {
			show: {
				resource: ['employee'],
				operation: ['delete'],
			},
		},
	},
	{
		displayName: 'Invoice ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the invoice',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['downloadNfePdf'],
			},
		},
	},
	{
		displayName: 'Put Output File in Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		hint: 'The name of the output binary field to put the file in',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['downloadNfePdf'],
			},
		},
	},
	{
		displayName: 'Invoice ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the invoice',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['downloadNfeXml'],
			},
		},
	},
	{
		displayName: 'Put Output File in Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		hint: 'The name of the output binary field to put the file in',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['downloadNfeXml'],
			},
		},
	},
	{
		displayName: 'Invoice ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the invoice',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['downloadPdf'],
			},
		},
	},
	{
		displayName: 'Put Output File in Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		hint: 'The name of the output binary field to put the file in',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['downloadPdf'],
			},
		},
	},
	{
		displayName: 'Invoice ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the invoice',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
								status: '={{ $request.qs["status"] }}',
								product: '={{ $request.qs["product"] }}',
								monthYear: '={{ $request.qs["monthYear"] }}',
								fromMonthYear: '={{ $request.qs["fromMonthYear"] }}',
								toMonthYear: '={{ $request.qs["toMonthYear"] }}',
								sortBy: '={{ $request.qs["sortBy"] }}',
								sortOrder: '={{ $request.qs["sortOrder"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'From Month Year',
				name: 'fromMonthYear',
				description: 'Invoices with reference month from this month on (inclusive), YYYY-MM',
				type: 'string',
				default: '',
				placeholder: '2026-01',
				routing: {
					send: {
						type: 'query',
						property: 'fromMonthYear',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Month Year',
				name: 'monthYear',
				description:
					'Invoices for a specific reference month, YYYY-MM. Cannot be combined with From Month Year / To Month Year.',
				type: 'string',
				default: '',
				placeholder: '2026-07',
				routing: {
					send: {
						type: 'query',
						property: 'monthYear',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Product',
				name: 'product',
				description:
					'Filter by billed product. Values: `telecom`, `asset-management`, `saas-management`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Asset Management',
						value: 'asset-management',
					},
					{
						name: 'Saas Management',
						value: 'saas-management',
					},
					{
						name: 'Telecom',
						value: 'telecom',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'product',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Filter by invoice status. Late is derived: matches open invoices past their due date. Values: `pending`, `paid`, `failed`, `voided`, `refunded`, `charged-back`, `late`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Charged Back',
						value: 'charged-back',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
					{
						name: 'Late',
						value: 'late',
					},
					{
						name: 'Paid',
						value: 'paid',
					},
					{
						name: 'Pending',
						value: 'pending',
					},
					{
						name: 'Refunded',
						value: 'refunded',
					},
					{
						name: 'Voided',
						value: 'voided',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'status',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'To Month Year',
				name: 'toMonthYear',
				description: 'Invoices with reference month up to this month (inclusive), YYYY-MM',
				type: 'string',
				default: '',
				placeholder: '2026-07',
				routing: {
					send: {
						type: 'query',
						property: 'toMonthYear',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				description:
					'Field used to sort the results. Default: dueDate. Values: `dueDate`, `referenceMonth`, `amountCents`, `status`, `createdAt`.',
				type: 'options',
				options: [
					{
						name: 'Amount Cents',
						value: 'amountCents',
					},
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Due Date',
						value: 'dueDate',
					},
					{
						name: 'Reference Month',
						value: 'referenceMonth',
					},
					{
						name: 'Status',
						value: 'status',
					},
				],
				default: 'dueDate',
				routing: {
					send: {
						type: 'query',
						property: 'sortBy',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				description: 'Sort direction. Default: desc. Values: `asc`, `desc`.',
				type: 'options',
				options: [
					{
						name: 'Asc',
						value: 'asc',
					},
					{
						name: 'Desc',
						value: 'desc',
					},
				],
				default: 'asc',
				routing: {
					send: {
						type: 'query',
						property: 'sortOrder',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Invoice ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the invoice',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getPhoneAccounts'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getPhoneAccounts'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getPhoneAccounts'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['activate'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['activate'],
			},
		},
		options: [
			{
				displayName: 'ICCID',
				name: 'iccid',
				description:
					'ICCID suffix (7 to 10 digits) or full ICCID of the new physical SIM. Only send it when reactivating a physical-SIM line with a corrected SIM; eSIM lines must not send this field.',
				type: 'string',
				default: '',
				placeholder: '1234567',
				routing: {
					send: {
						type: 'body',
						property: 'iccid',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Phone Account IDs',
		name: 'phoneAccountIds',
		description:
			'IDs of the phone accounts that receive the cost center, up to 1,000 per request. All must belong to your company; if any does not, none is changed. Repeated IDs count once. Comma-separated.',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'phoneAccountIds',
				propertyInDotNotation: false,
				value: '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['batchUpdateCostCenter'],
			},
		},
	},
	{
		displayName: 'Cost Center ID',
		name: 'costCenterId',
		description:
			'ID of the cost center applied to the phone accounts (see Cost Center > Get Many). Leave empty to remove the cost center from the phone accounts.',
		type: 'string',
		default: '',
		placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
		routing: {
			send: {
				type: 'body',
				property: 'costCenterId',
				propertyInDotNotation: false,
				value: '={{ $value === "" ? null : $value }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['batchUpdateCostCenter'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['batchUpdateCostCenter'],
			},
		},
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Idempotency key for this request. Will return the same response if the same request is made again with the same key. Fails if parameters are different.',
				routing: {
					request: {
						headers: {
							'idempotency-key': '={{ $value }}',
						},
					},
				},
			},
		],
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['block'],
			},
		},
	},
	{
		displayName: 'Reason',
		name: 'reason',
		description:
			'Reason for blocking the phone account. Values: `theft`, `loss`, `misuse`, `no-usage`, `whatsapp-ban`, `unnecessary`, `technical-issues`, `trip-ended`, `other`.',
		type: 'options',
		options: [
			{
				name: 'Loss',
				value: 'loss',
			},
			{
				name: 'Misuse',
				value: 'misuse',
			},
			{
				name: 'No Usage',
				value: 'no-usage',
			},
			{
				name: 'Other',
				value: 'other',
			},
			{
				name: 'Technical Issues',
				value: 'technical-issues',
			},
			{
				name: 'Theft',
				value: 'theft',
			},
			{
				name: 'Trip Ended',
				value: 'trip-ended',
			},
			{
				name: 'Unnecessary',
				value: 'unnecessary',
			},
			{
				name: 'WhatsApp Ban',
				value: 'whatsapp-ban',
			},
		],
		default: 'theft',
		routing: {
			send: {
				type: 'body',
				property: 'reason',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['block'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['block'],
			},
		},
		options: [
			{
				displayName: 'Other Reason',
				name: 'otherReason',
				description: 'Reason details. Required when Reason is Other.',
				type: 'string',
				default: '',
				placeholder: 'Lost access to the device',
				routing: {
					send: {
						type: 'body',
						property: 'otherReason',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['cancel'],
			},
		},
	},
	{
		displayName: 'Reason',
		name: 'reason',
		description:
			'Reason for canceling the phone account. Values: `employee-fired`, `unnecessary`, `no-coverage`, `technical-problems`, `whatsapp-problems`, `whatsapp-blocked`, `sim-card-swap`, `other`.',
		type: 'options',
		options: [
			{
				name: 'Employee Fired',
				value: 'employee-fired',
			},
			{
				name: 'No Coverage',
				value: 'no-coverage',
			},
			{
				name: 'Other',
				value: 'other',
			},
			{
				name: 'Sim Card Swap',
				value: 'sim-card-swap',
			},
			{
				name: 'Technical Problems',
				value: 'technical-problems',
			},
			{
				name: 'Unnecessary',
				value: 'unnecessary',
			},
			{
				name: 'WhatsApp Blocked',
				value: 'whatsapp-blocked',
			},
			{
				name: 'WhatsApp Problems',
				value: 'whatsapp-problems',
			},
		],
		default: 'employee-fired',
		routing: {
			send: {
				type: 'body',
				property: 'reason',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['cancel'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['cancel'],
			},
		},
		options: [
			{
				displayName: 'Reason Detail',
				name: 'reasonDetail',
				description: 'Reason details. Required when Reason is Other. Maximum of 248 characters.',
				type: 'string',
				default: '',
				placeholder: 'Customer closed the branch',
				routing: {
					send: {
						type: 'body',
						property: 'reasonDetail',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Type',
				name: 'type',
				description:
					'When the phone account is canceled. Immediate cancels right away. Scheduled keeps it working until the end of the current billing cycle and cancels it on that date. Only an active phone account can have its cancellation scheduled. In both cases the current month is billed. Values: `immediate`, `scheduled`.',
				type: 'options',
				options: [
					{
						name: 'Immediate',
						value: 'immediate',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
				],
				default: 'immediate',
				routing: {
					send: {
						type: 'body',
						property: 'type',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Area Code',
		name: 'areaCode',
		description: 'Area code (DDD) of the phone account',
		type: 'number',
		default: 0,
		routing: {
			send: {
				type: 'body',
				property: 'areaCode',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['createMobileDid'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['createMobileDid'],
			},
		},
		options: [
			{
				displayName: 'Cost Center ID',
				name: 'costCenterId',
				description: "ID of the phone account's cost center (see Cost Center > Get Many)",
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'costCenterId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				description:
					'Custom fields for the phone account. Fields must be created beforehand in the Salvy dashboard (https://app.salvy.com.br/settings/custom-fields); unknown labels are ignored.',
				type: 'json',
				default: '[\n  {\n    "label": "Departamento",\n    "value": "Vendas"\n  }\n]',
				routing: {
					send: {
						type: 'body',
						property: 'customFields',
						propertyInDotNotation: false,
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				description:
					'ID of the employee associated with the phone account. Must belong to the same company as the API key.',
				type: 'string',
				default: '',
				placeholder: '0197aa3e-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'employeeId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				description:
					'ID of the phone account group the line joins (see Phone Account Group > Get Many)',
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'groupId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Idempotency key for this request. Will return the same response if the same request is made again with the same key. Fails if parameters are different.',
				routing: {
					request: {
						headers: {
							'idempotency-key': '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				description: 'Phone account name, set by you to make management easier',
				type: 'string',
				default: '',
				placeholder: 'Mary - Sales',
				routing: {
					send: {
						type: 'body',
						property: 'name',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Idempotency Key',
		name: 'idempotencyKey',
		type: 'string',
		default: '',
		description:
			'Idempotency key for this request. A new call with the same key returns the phone account already created instead of creating another one.',
		routing: {
			request: {
				headers: {
					'idempotency-key': '={{ $value }}',
				},
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['createMobile'],
			},
		},
	},
	{
		displayName: 'SIM Type',
		name: 'simType',
		description:
			'Type of SIM for the line. A physical SIM requires its ICCID. Values: `esim`, `physical`.',
		type: 'options',
		options: [
			{
				name: 'eSIM',
				value: 'esim',
				description: 'Line with an eSIM',
			},
			{
				name: 'Physical SIM',
				value: 'physical',
				description: 'Line with a physical SIM',
			},
		],
		default: 'esim',
		routing: {
			send: {
				type: 'body',
				property: 'simType',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['createMobile'],
			},
		},
	},
	{
		displayName: 'ICCID',
		name: 'iccid',
		description: 'ICCID (or its last 7 to 10 digits) of the physical SIM used to activate the line',
		type: 'string',
		default: '',
		placeholder: '1234567890',
		routing: {
			send: {
				type: 'body',
				property: 'iccid',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['createMobile'],
				simType: ['physical'],
			},
		},
	},
	{
		displayName: 'Subscription Plan ID',
		name: 'subscriptionPlanId',
		description: 'ID of the subscription plan for the line (see Plan > Get Many)',
		type: 'string',
		default: '',
		placeholder: '0197aa3e-3815-45b7-9e60-8e137cad845c',
		routing: {
			send: {
				type: 'body',
				property: 'subscriptionPlanId',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['createMobile'],
			},
		},
	},
	{
		displayName: 'Area Code',
		name: 'areaCode',
		description: 'Area code (DDD) of the phone account',
		type: 'number',
		default: 0,
		routing: {
			send: {
				type: 'body',
				property: 'areaCode',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['createMobile'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['createMobile'],
			},
		},
		options: [
			{
				displayName: 'Cost Center ID',
				name: 'costCenterId',
				description: "ID of the phone account's cost center (see Cost Center > Get Many)",
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'costCenterId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				description:
					'Custom fields for the phone account. Fields must be created beforehand in the Salvy dashboard (https://app.salvy.com.br/settings/custom-fields); unknown labels are ignored.',
				type: 'json',
				default: '[\n  {\n    "label": "Departamento",\n    "value": "Vendas"\n  }\n]',
				routing: {
					send: {
						type: 'body',
						property: 'customFields',
						propertyInDotNotation: false,
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				description:
					'ID of the employee associated with the phone account. Must belong to the same company as the API key.',
				type: 'string',
				default: '',
				placeholder: '0197aa3e-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'employeeId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				description:
					'ID of the phone account group the line joins (see Phone Account Group > Get Many)',
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'groupId',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				description: 'Phone account name, set by you to make management easier',
				type: 'string',
				default: '',
				placeholder: 'Mary - Sales',
				routing: {
					send: {
						type: 'body',
						property: 'name',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getBalance'],
			},
		},
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getEsim'],
			},
		},
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Cost Center ID',
				name: 'costCenterId',
				description:
					"ID of the phone account's cost center (see Cost Center > Get Many). Leave empty to remove it.",
				type: 'string',
				default: '',
				placeholder: '0198c2f1-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'costCenterId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				description:
					'Custom fields for the phone account. Fields must be created beforehand in the Salvy dashboard (https://app.salvy.com.br/settings/custom-fields); unknown labels are ignored.',
				type: 'json',
				default: '[\n  {\n    "label": "Departamento",\n    "value": "Vendas"\n  }\n]',
				routing: {
					send: {
						type: 'body',
						property: 'customFields',
						propertyInDotNotation: false,
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				description:
					'ID of the employee associated with the phone account. Must belong to the same company as the API key. Leave empty to remove the association.',
				type: 'string',
				default: '',
				placeholder: '0197aa3e-3815-45b7-9e60-8e137cad845c',
				routing: {
					send: {
						type: 'body',
						property: 'employeeId',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				description: 'Phone account name, set by you to make management easier',
				type: 'string',
				default: '',
				placeholder: 'Mary - Sales',
				routing: {
					send: {
						type: 'body',
						property: 'name',
						propertyInDotNotation: false,
						value: '={{ $value === "" ? null : $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getSmsMessages'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getSmsMessages'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
								receivedAtFrom: '={{ $request.qs["receivedAtFrom"] }}',
								receivedAtTo: '={{ $request.qs["receivedAtTo"] }}',
								service: '={{ $request.qs["service"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getSmsMessages'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getSmsMessages'],
			},
		},
		options: [
			{
				displayName: 'Received At From',
				name: 'receivedAtFrom',
				description: 'Only messages received from this date on (inclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2025-09-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'receivedAtFrom',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Received At To',
				name: 'receivedAtTo',
				description: 'Only messages received before this date (exclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2025-10-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'receivedAtTo',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Service',
				name: 'service',
				description:
					'Only messages whose detected service is in the list. Use __null__ to include messages with no detected service. Values: `whatsapp`, `google`, `telegram`, `tiktok`, `shopee`, `amazon`, `facebook`, `nubank`, `microsoft`, `instagram`, `hotmart`, `discord`, `godaddy`, `twilio`, `youtube`, `claude`, `samsung`, `c6`, `ifood`, `paypal`, `autodesk`, `globo`, `apple`, `asaas`, `mercado-livre`, `wechat`, `alipay`, `airbnb`, `snapchat`, `hostgator`, `messages`, `sendpulse`, `kwai`, `salvy`, `santander`, `itau`, `temu`, `mercado-pago`, `indeed`, `zoom`, `x`, `hostinger`, `bradesco`, `banco-do-brasil`, `caixa`, `inter`, `btg`, `sicoob`, `pagbank`, `bmg`, `infinitepay`, `enel`, `booking`, `expedia`, `linkedin`, `pinterest`, `twitch`, `tinder`, `unknown`, `__null__`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Airbnb',
						value: 'airbnb',
					},
					{
						name: 'Alipay',
						value: 'alipay',
					},
					{
						name: 'Amazon',
						value: 'amazon',
					},
					{
						name: 'Apple',
						value: 'apple',
					},
					{
						name: 'Asaas',
						value: 'asaas',
					},
					{
						name: 'Autodesk',
						value: 'autodesk',
					},
					{
						name: 'Banco Do Brasil',
						value: 'banco-do-brasil',
					},
					{
						name: 'BMG',
						value: 'bmg',
					},
					{
						name: 'Booking',
						value: 'booking',
					},
					{
						name: 'Bradesco',
						value: 'bradesco',
					},
					{
						name: 'BTG',
						value: 'btg',
					},
					{
						name: 'C6',
						value: 'c6',
					},
					{
						name: 'Caixa',
						value: 'caixa',
					},
					{
						name: 'Claude',
						value: 'claude',
					},
					{
						name: 'Discord',
						value: 'discord',
					},
					{
						name: 'Enel',
						value: 'enel',
					},
					{
						name: 'Expedia',
						value: 'expedia',
					},
					{
						name: 'Facebook',
						value: 'facebook',
					},
					{
						name: 'Globo',
						value: 'globo',
					},
					{
						name: 'GoDaddy',
						value: 'godaddy',
					},
					{
						name: 'Google',
						value: 'google',
					},
					{
						name: 'HostGator',
						value: 'hostgator',
					},
					{
						name: 'Hostinger',
						value: 'hostinger',
					},
					{
						name: 'Hotmart',
						value: 'hotmart',
					},
					{
						name: 'iFood',
						value: 'ifood',
					},
					{
						name: 'Indeed',
						value: 'indeed',
					},
					{
						name: 'InfinitePay',
						value: 'infinitepay',
					},
					{
						name: 'Instagram',
						value: 'instagram',
					},
					{
						name: 'Inter',
						value: 'inter',
					},
					{
						name: 'Itaú',
						value: 'itau',
					},
					{
						name: 'Kwai',
						value: 'kwai',
					},
					{
						name: 'LinkedIn',
						value: 'linkedin',
					},
					{
						name: 'Mercado Livre',
						value: 'mercado-livre',
					},
					{
						name: 'Mercado Pago',
						value: 'mercado-pago',
					},
					{
						name: 'Messages',
						value: 'messages',
					},
					{
						name: 'Microsoft',
						value: 'microsoft',
					},
					{
						name: 'Not Set',
						value: '__null__',
					},
					{
						name: 'Nubank',
						value: 'nubank',
					},
					{
						name: 'PagBank',
						value: 'pagbank',
					},
					{
						name: 'PayPal',
						value: 'paypal',
					},
					{
						name: 'Pinterest',
						value: 'pinterest',
					},
					{
						name: 'Salvy',
						value: 'salvy',
					},
					{
						name: 'Samsung',
						value: 'samsung',
					},
					{
						name: 'Santander',
						value: 'santander',
					},
					{
						name: 'SendPulse',
						value: 'sendpulse',
					},
					{
						name: 'Shopee',
						value: 'shopee',
					},
					{
						name: 'Sicoob',
						value: 'sicoob',
					},
					{
						name: 'Snapchat',
						value: 'snapchat',
					},
					{
						name: 'Telegram',
						value: 'telegram',
					},
					{
						name: 'Temu',
						value: 'temu',
					},
					{
						name: 'TikTok',
						value: 'tiktok',
					},
					{
						name: 'Tinder',
						value: 'tinder',
					},
					{
						name: 'Twilio',
						value: 'twilio',
					},
					{
						name: 'Twitch',
						value: 'twitch',
					},
					{
						name: 'Unknown',
						value: 'unknown',
					},
					{
						name: 'WeChat',
						value: 'wechat',
					},
					{
						name: 'WhatsApp',
						value: 'whatsapp',
					},
					{
						name: 'X',
						value: 'x',
					},
					{
						name: 'YouTube',
						value: 'youtube',
					},
					{
						name: 'Zoom',
						value: 'zoom',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'service',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
								status: '={{ $request.qs["status"] }}',
								productType: '={{ $request.qs["productType"] }}',
								phoneNumber: '={{ $request.qs["phoneNumber"] }}',
								employeeId: '={{ $request.qs["employeeId"] }}',
								costCenterId: '={{ $request.qs["costCenterId"] }}',
								createdAtFrom: '={{ $request.qs["createdAtFrom"] }}',
								createdAtTo: '={{ $request.qs["createdAtTo"] }}',
								activatedAtFrom: '={{ $request.qs["activatedAtFrom"] }}',
								activatedAtTo: '={{ $request.qs["activatedAtTo"] }}',
								canceledAtFrom: '={{ $request.qs["canceledAtFrom"] }}',
								canceledAtTo: '={{ $request.qs["canceledAtTo"] }}',
								sortBy: '={{ $request.qs["sortBy"] }}',
								sortOrder: '={{ $request.qs["sortOrder"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Activated At From',
				name: 'activatedAtFrom',
				description: 'Phone accounts activated from this date on (inclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2026-05-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'activatedAtFrom',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Activated At To',
				name: 'activatedAtTo',
				description: 'Phone accounts activated before this date (exclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2026-06-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'activatedAtTo',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Canceled At From',
				name: 'canceledAtFrom',
				description: 'Phone accounts canceled from this date on (inclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2026-05-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'canceledAtFrom',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Canceled At To',
				name: 'canceledAtTo',
				description: 'Phone accounts canceled before this date (exclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2026-06-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'canceledAtTo',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Cost Center ID',
				name: 'costCenterId',
				description:
					"Filter by the phone account's cost center. Use __null__ for phone accounts without a cost center. Comma-separated for multiple values.",
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'costCenterId',
						propertyInDotNotation: false,
						value: '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Created At From',
				name: 'createdAtFrom',
				description: 'Phone accounts created from this date on (inclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2026-05-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'createdAtFrom',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Created At To',
				name: 'createdAtTo',
				description: 'Phone accounts created before this date (exclusive), ISO 8601',
				type: 'string',
				default: '',
				placeholder: '2026-06-01T00:00:00Z',
				routing: {
					send: {
						type: 'query',
						property: 'createdAtTo',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				description:
					'Filter by phone accounts associated with these employees. Comma-separated for multiple values.',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'employeeId',
						propertyInDotNotation: false,
						value: '={{ String($value).split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				description:
					"Filter by the number the customer knows as the line's, in E.164 format: matches the active number, the number chosen or being ported before activation, and the number of an ongoing or failed port-in. A line can match a number it does not display (e.g. a canceled line whose port-in never completed), so compare with phoneNumber in the result.",
				type: 'string',
				default: '',
				placeholder: '+5541999887766',
				routing: {
					send: {
						type: 'query',
						property: 'phoneNumber',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Product Type',
				name: 'productType',
				description:
					"Filter by the phone account's product type. Values: `mobile`, `mobile-did`, `landline-did`, `global`. In an expression, use an array or a comma-separated list.",
				type: 'multiOptions',
				options: [
					{
						name: 'Global',
						value: 'global',
					},
					{
						name: 'Landline DID',
						value: 'landline-did',
					},
					{
						name: 'Mobile',
						value: 'mobile',
					},
					{
						name: 'Mobile DID',
						value: 'mobile-did',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'productType',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				description:
					"Filter by the phone account's public status. Values: `pending`, `available`, `active`, `partial-block`, `blocked`, `canceled`. In an expression, use an array or a comma-separated list.",
				type: 'multiOptions',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Available',
						value: 'available',
					},
					{
						name: 'Blocked',
						value: 'blocked',
					},
					{
						name: 'Canceled',
						value: 'canceled',
					},
					{
						name: 'Partial Block',
						value: 'partial-block',
					},
					{
						name: 'Pending',
						value: 'pending',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'status',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				description:
					'Field used to sort the results. Default: createdAt. Values: `createdAt`, `activatedAt`, `name`.',
				type: 'options',
				options: [
					{
						name: 'Activated At',
						value: 'activatedAt',
					},
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Name',
						value: 'name',
					},
				],
				default: 'createdAt',
				routing: {
					send: {
						type: 'query',
						property: 'sortBy',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				description: 'Sort direction. Default: desc. Values: `asc`, `desc`.',
				type: 'options',
				options: [
					{
						name: 'Asc',
						value: 'asc',
					},
					{
						name: 'Desc',
						value: 'desc',
					},
				],
				default: 'asc',
				routing: {
					send: {
						type: 'query',
						property: 'sortOrder',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['simulateSms'],
			},
		},
	},
	{
		displayName: 'Raw Text',
		name: 'rawText',
		description: 'Content of the simulated SMS, up to 160 characters',
		type: 'string',
		default: '',
		placeholder: 'Your verification code is 123456',
		routing: {
			send: {
				type: 'body',
				property: 'rawText',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['simulateSms'],
			},
		},
	},
	{
		displayName: 'Origin Phone Number',
		name: 'originPhoneNumber',
		description: 'Origin number of the simulated SMS (A2P short code or alphanumeric sender)',
		type: 'string',
		default: '',
		placeholder: '23456',
		routing: {
			send: {
				type: 'body',
				property: 'originPhoneNumber',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['simulateSms'],
			},
		},
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['topUpData'],
			},
		},
	},
	{
		displayName: 'Quantity GB',
		name: 'quantityGB',
		description: 'Amount of data to add to the phone account, in gigabytes',
		type: 'number',
		default: 0,
		routing: {
			send: {
				type: 'body',
				property: 'quantityGB',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['topUpData'],
			},
		},
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['unblock'],
			},
		},
	},
	{
		displayName: 'Phone Account ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account',
		displayOptions: {
			show: {
				resource: ['phoneAccount'],
				operation: ['unscheduleCancellation'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		description:
			'Group name. Unique within the company, ignoring case and accents: "Sales SP" and "sales sp" are the same group.',
		type: 'string',
		default: '',
		placeholder: 'Sales NY',
		routing: {
			send: {
				type: 'body',
				property: 'name',
				propertyInDotNotation: false,
				value: '={{ $value }}',
			},
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				description:
					'Group color. Defaults to cyan when omitted. Values: `cyan`, `red`, `purple`, `lime`, `yellow`, `pink`.',
				type: 'options',
				options: [
					{
						name: 'Cyan',
						value: 'cyan',
					},
					{
						name: 'Lime',
						value: 'lime',
					},
					{
						name: 'Pink',
						value: 'pink',
					},
					{
						name: 'Purple',
						value: 'purple',
					},
					{
						name: 'Red',
						value: 'red',
					},
					{
						name: 'Yellow',
						value: 'yellow',
					},
				],
				default: 'cyan',
				routing: {
					send: {
						type: 'body',
						property: 'color',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Idempotency key for this request. Will return the same response if the same request is made again with the same key. Fails if parameters are different.',
				routing: {
					request: {
						headers: {
							'idempotency-key': '={{ $value }}',
						},
					},
				},
			},
		],
	},
	{
		displayName: 'Phone Account Group ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account group',
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Phone Account Group ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account group',
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				description: 'Group color. Values: `cyan`, `red`, `purple`, `lime`, `yellow`, `pink`.',
				type: 'options',
				options: [
					{
						name: 'Cyan',
						value: 'cyan',
					},
					{
						name: 'Lime',
						value: 'lime',
					},
					{
						name: 'Pink',
						value: 'pink',
					},
					{
						name: 'Purple',
						value: 'purple',
					},
					{
						name: 'Red',
						value: 'red',
					},
					{
						name: 'Yellow',
						value: 'yellow',
					},
				],
				default: 'cyan',
				routing: {
					send: {
						type: 'body',
						property: 'color',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				description:
					"Group name. Must not repeat another group's name in the company, ignoring case and accents.",
				type: 'string',
				default: '',
				placeholder: 'Sales NY',
				routing: {
					send: {
						type: 'body',
						property: 'name',
						propertyInDotNotation: false,
						value: '={{ $value }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Phone Account Group ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the phone account group',
		displayOptions: {
			show: {
				resource: ['phoneAccountGroup'],
				operation: ['delete'],
			},
		},
	},
	{
		displayName: 'Plan ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the plan',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Task ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the task',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Task ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the task',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['getResults'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['getResults'],
			},
		},
		routing: {
			send: {
				paginate: '={{ ($value === true || $value === "true") }}',
			},
			request: {
				qs: {
					page: 1,
					pageSize: '={{ ($value === true || $value === "true") ? 200 : $parameter.limit }}',
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue:
							'={{ $response.body.pagination.page < $response.body.pagination.totalPages }}',
						request: {
							qs: {
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
								pageSize: '={{ $request.qs["pageSize"] }}',
								status: '={{ $request.qs["status"] }}',
							},
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
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['getResults'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['getResults'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				description:
					'Filter by item result: applied or failed. Values: `applied`, `failed`. In an expression, use an array or a comma-separated list.',
				type: 'multiOptions',
				options: [
					{
						name: 'Applied',
						value: 'applied',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
				],
				default: [],
				routing: {
					send: {
						type: 'query',
						property: 'status',
						propertyInDotNotation: false,
						value:
							'={{ (Array.isArray($value) ? $value : String($value).split(",")).map((v) => String(v).trim()).filter((v) => v) }}',
					},
				},
			},
		],
	},
];
