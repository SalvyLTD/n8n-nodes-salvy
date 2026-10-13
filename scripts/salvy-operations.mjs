// Mapping of every operation in openapi/salvy-v3.json to the node's resource/operation
// pickers, with English display names. Consumed by scripts/generate.mjs only.
//
// Keys are OpenAPI operationIds. Each entry is either
//   { resource, value, name, action, description, ...flags }
// or
//   { exclude: '<reason>' }
//
// Flags understood by the generator:
//   binary: true     -> response is a file; output goes to a binary property
//   noContent: true  -> 204 response; output { success: true }
//   fields: {...}    -> per-field overrides (see generate.mjs)

export const RESOURCES = {
	asset: 'Asset',
	assetStatement: 'Asset Statement',
	areaCode: 'Area Code',
	company: 'Company',
	costCenter: 'Cost Center',
	employee: 'Employee',
	invoice: 'Invoice',
	phoneAccount: 'Phone Account',
	phoneAccountGroup: 'Phone Account Group',
	plan: 'Plan',
	task: 'Task',
};

export const OPERATIONS = {
	// --- Task -------------------------------------------------------------
	publicGetTaskV3: {
		resource: 'task',
		value: 'get',
		name: 'Get',
		action: 'Get a task',
		description:
			'Get the progress of a background task started by one of your API keys, with applied, failed, pending and canceled item counts',
	},
	publicListTaskResultsV3: {
		resource: 'task',
		value: 'getResults',
		name: 'Get Results',
		action: 'Get the results of a task',
		description:
			'List the result of each processed item of a task, in the order the items were submitted. The "type" field tells the task kind and the shape of each item in "data".',
	},

	// --- WebRTC (excluded) -------------------------------------------------
	publicCreateWebrtcTokenV3: {
		exclude: 'WebRTC is experimental; excluded from this node on purpose.',
	},

	// --- Area Code --------------------------------------------------------
	publicListAreaCodesV3: {
		resource: 'areaCode',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many area codes',
		description:
			'List the area codes (DDD) where your company can create a line of the given type, and whether a number is available in each right now',
	},

	// --- Plan -------------------------------------------------------------
	publicGetPlanV3: {
		resource: 'plan',
		value: 'get',
		name: 'Get',
		action: 'Get a plan',
		description: 'Get a mobile plan available to your company by ID',
	},
	publicListPlansV3: {
		resource: 'plan',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many plans',
		description: 'List the mobile plans available to your company, sorted by name',
	},

	// --- Phone Account Group ----------------------------------------------
	publicCreatePhoneAccountGroupV3: {
		resource: 'phoneAccountGroup',
		value: 'create',
		name: 'Create',
		action: 'Create a phone account group',
		description:
			'Create a phone account group. If a group with the same name already exists, it is returned unchanged.',
	},
	publicListPhoneAccountGroupsV3: {
		resource: 'phoneAccountGroup',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many phone account groups',
		description: 'List your company phone account groups, sorted by name',
	},
	publicDeletePhoneAccountGroupV3: {
		resource: 'phoneAccountGroup',
		value: 'delete',
		name: 'Delete',
		action: 'Delete a phone account group',
		description:
			'Delete a phone account group. Its phone accounts stay active and end up without a group.',
		noContent: true,
	},
	publicGetPhoneAccountGroupV3: {
		resource: 'phoneAccountGroup',
		value: 'get',
		name: 'Get',
		action: 'Get a phone account group',
		description: 'Get a phone account group by ID',
	},
	publicUpdatePhoneAccountGroupV3: {
		resource: 'phoneAccountGroup',
		value: 'update',
		name: 'Update',
		action: 'Update a phone account group',
		description: 'Update a phone account group. Only the fields you set are changed.',
	},

	// --- Phone Account ----------------------------------------------------
	publicActivatePhoneAccountV3: {
		resource: 'phoneAccount',
		value: 'activate',
		name: 'Activate',
		action: 'Activate a phone account',
		description:
			'Retry the activation of an existing mobile phone account. Does not create a new line. Retrying on an active or activating line has no effect.',
	},
	publicBatchUpdatePhoneAccountsCostCenterV3: {
		resource: 'phoneAccount',
		value: 'batchUpdateCostCenter',
		name: 'Batch Update Cost Center',
		action: 'Batch update the cost center of phone accounts',
		description:
			'Apply a cost center to many phone accounts at once, all or nothing. Runs in the background and returns a task ID (see Task > Get).',
	},
	publicBlockPhoneAccountV3: {
		resource: 'phoneAccount',
		value: 'block',
		name: 'Block',
		action: 'Block a phone account',
		description: 'Block a phone account. Blocking an already blocked line has no effect.',
	},
	publicCancelPhoneAccountV3: {
		resource: 'phoneAccount',
		value: 'cancel',
		name: 'Cancel',
		action: 'Cancel a phone account',
		description:
			'Cancel a phone account, immediately or at the end of the current billing cycle (scheduled)',
	},
	publicCreateMobileDidPhoneAccountV3: {
		resource: 'phoneAccount',
		value: 'createMobileDid',
		name: 'Create Mobile DID',
		action: 'Create a mobile DID phone account',
		description:
			'Create a mobile DID (virtual number) phone account. It is available right away; billing starts when the number is validated in an app. In sandbox only area code 41 is accepted.',
	},
	publicCreateMobilePhoneAccountV3: {
		resource: 'phoneAccount',
		value: 'createMobile',
		name: 'Create Mobile',
		action: 'Create a mobile phone account',
		description:
			'Create a mobile phone account with a physical SIM or an eSIM. The line starts pending activation; billing starts after activation.',
		fields: {
			simType: {
				displayName: 'SIM Type',
				options: [
					{ name: 'eSIM', value: 'esim', description: 'Line with an eSIM' },
					{ name: 'Physical SIM', value: 'physical', description: 'Line with a physical SIM' },
				],
				default: 'esim',
				description: 'Type of SIM for the line. A physical SIM requires its ICCID.',
			},
		},
	},
	publicGetPhoneAccountBalanceV3: {
		resource: 'phoneAccount',
		value: 'getBalance',
		name: 'Get Data Balance',
		action: 'Get the data balance of a phone account',
		description:
			'Get the data balance of an active phone account, refreshing it first when the last reading is stale',
	},
	publicGetPhoneAccountEsimV3: {
		resource: 'phoneAccount',
		value: 'getEsim',
		name: 'Get eSIM',
		action: 'Get the embedded SIM activation data of a phone account',
		description:
			'Get the eSIM activation data of a phone account. While provisioning, status is "provisioning" and the other fields are null; poll again shortly.',
	},
	publicGetPhoneAccountV3: {
		resource: 'phoneAccount',
		value: 'get',
		name: 'Get',
		action: 'Get a phone account',
		description: 'Get a phone account by ID',
	},
	publicUpdatePhoneAccountV3: {
		resource: 'phoneAccount',
		value: 'update',
		name: 'Update',
		action: 'Update a phone account',
		description: 'Update a phone account. Only the fields you set are changed.',
	},
	publicListPhoneAccountSmsMessagesV3: {
		resource: 'phoneAccount',
		value: 'getSmsMessages',
		name: 'Get SMS Messages',
		action: 'Get SMS messages of a phone account',
		description:
			'List the SMS messages received by a DID phone account, newest first. Other line types return an empty list.',
	},
	publicListPhoneAccountsV3: {
		resource: 'phoneAccount',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many phone accounts',
		description: 'List your company phone accounts, newest first',
	},
	publicSimulatePhoneAccountSmsV3: {
		resource: 'phoneAccount',
		value: 'simulateSms',
		name: 'Simulate SMS',
		action: 'Simulate an incoming SMS on a phone account',
		description: 'Simulate an incoming SMS on a phone account. Sandbox only.',
		noContent: true,
	},
	publicTopUpPhoneAccountDataV3: {
		resource: 'phoneAccount',
		value: 'topUpData',
		name: 'Top Up Data',
		action: 'Top up data on a phone account',
		description: 'Add data to the allowance of a mobile or global phone account',
	},
	publicUnblockPhoneAccountV3: {
		resource: 'phoneAccount',
		value: 'unblock',
		name: 'Unblock',
		action: 'Unblock a phone account',
		description:
			'Unblock a phone account. Blocks placed by Salvy (non-payment, company cancellation, partial block) are not lifted here.',
	},
	publicUnschedulePhoneAccountCancellationV3: {
		resource: 'phoneAccount',
		value: 'unscheduleCancellation',
		name: 'Unschedule Cancellation',
		action: 'Unschedule the cancellation of a phone account',
		description:
			'Undo a scheduled cancellation so the phone account keeps working after the billing cycle ends',
	},

	// --- Employee ---------------------------------------------------------
	publicBatchSyncEmployeesV3: {
		resource: 'employee',
		value: 'batchSync',
		name: 'Batch Sync',
		action: 'Batch sync employees',
		description:
			'Create or update many employees at once, matched by your integrationId, all or nothing. Runs in the background and returns a task ID (see Task > Get).',
	},
	publicCreateEmployeeV3: {
		resource: 'employee',
		value: 'create',
		name: 'Create',
		action: 'Create an employee',
		description: 'Create an employee',
	},
	publicListEmployeesV3: {
		resource: 'employee',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many employees',
		description: 'List your company employees, newest first by default',
	},
	publicDeleteEmployeeV3: {
		resource: 'employee',
		value: 'delete',
		name: 'Delete',
		action: 'Delete an employee',
		description:
			'Delete an employee together with everything your integrations brought in about them. Cannot be undone through the API.',
		noContent: true,
	},
	publicGetEmployeeV3: {
		resource: 'employee',
		value: 'get',
		name: 'Get',
		action: 'Get an employee',
		description: 'Get an employee by ID',
	},
	publicUpdateEmployeeV3: {
		resource: 'employee',
		value: 'update',
		name: 'Update',
		action: 'Update an employee',
		description:
			'Update an employee. Only the fields you set are changed; an empty value clears your edit and falls back to integration data, if any.',
	},

	// --- Cost Center ------------------------------------------------------
	publicCreateCostCenterV3: {
		resource: 'costCenter',
		value: 'create',
		name: 'Create',
		action: 'Create a cost center',
		description: 'Create a cost center',
	},
	publicListCostCentersV3: {
		resource: 'costCenter',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many cost centers',
		description: 'List your company cost centers, sorted by name',
	},
	publicDeleteCostCenterV3: {
		resource: 'costCenter',
		value: 'delete',
		name: 'Delete',
		action: 'Delete a cost center',
		description:
			'Delete a cost center, moving its phone accounts and employees to a replacement cost center (or to none)',
		noContent: true,
	},
	publicGetCostCenterV3: {
		resource: 'costCenter',
		value: 'get',
		name: 'Get',
		action: 'Get a cost center',
		description: 'Get a cost center by ID',
	},
	publicUpdateCostCenterV3: {
		resource: 'costCenter',
		value: 'update',
		name: 'Update',
		action: 'Update a cost center',
		description: 'Update a cost center. Only the fields you set are changed.',
	},

	// --- Company ----------------------------------------------------------
	publicListCompaniesV3: {
		resource: 'company',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many companies',
		description:
			'List the companies the credential can access: a company key returns its own company; an organization key returns every company in the organization',
	},

	// --- Invoice ----------------------------------------------------------
	publicGetInvoiceNfePdfV3: {
		resource: 'invoice',
		value: 'downloadNfePdf',
		name: 'Download NFe PDF',
		action: 'Download the NFE PDF of an invoice',
		description: 'Download the PDF (DANFE) of the invoice’s NF-e, when there is one',
		binary: { accept: 'application/pdf', fileName: 'nfe.pdf' },
	},
	publicGetInvoiceNfeXmlV3: {
		resource: 'invoice',
		value: 'downloadNfeXml',
		name: 'Download NFe XML',
		action: 'Download the NFE XML of an invoice',
		description: 'Download the XML of the invoice’s NF-e, when there is one',
		binary: { accept: 'application/xml', fileName: 'nfe.xml' },
	},
	publicGetInvoicePdfV3: {
		resource: 'invoice',
		value: 'downloadPdf',
		name: 'Download PDF',
		action: 'Download the PDF of an invoice',
		description:
			'Download the invoice PDF with the current payment data (boleto and Pix). Not available in sandbox (always 404).',
		binary: { accept: 'application/pdf', fileName: 'invoice.pdf' },
	},
	publicGetInvoiceV3: {
		resource: 'invoice',
		value: 'get',
		name: 'Get',
		action: 'Get an invoice',
		description: 'Get an invoice by ID, with its items, NF-e and per-line breakdown',
	},
	publicListInvoicesV3: {
		resource: 'invoice',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many invoices',
		description: 'List invoices sorted by due date',
	},
	publicListInvoicePhoneAccountsV3: {
		resource: 'invoice',
		value: 'getPhoneAccounts',
		name: 'Get Phone Accounts',
		action: 'Get the line breakdown of an invoice',
		description:
			'List the per-phone-account breakdown of an invoice, highest amount first. Empty for non-telecom invoices.',
	},

	// --- Asset ------------------------------------------------------------
	publicArchiveAssetV3: {
		resource: 'asset',
		value: 'archive',
		name: 'Archive',
		action: 'Archive an asset',
		description: 'Archive an asset (reversible with Unarchive)',
	},
	publicCreateAssetTimelineNoteV3: {
		resource: 'asset',
		value: 'createTimelineNote',
		name: 'Create Timeline Note',
		action: 'Create a timeline note on an asset',
		description: 'Add a note to an asset’s timeline',
	},
	publicCreateAssetV3: {
		resource: 'asset',
		value: 'create',
		name: 'Create',
		action: 'Create an asset',
		description: 'Create an asset',
	},
	publicListAssetsV3: {
		resource: 'asset',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many assets',
		description: 'List your company assets, newest first by default',
	},
	publicDeleteAssetV3: {
		resource: 'asset',
		value: 'delete',
		name: 'Delete',
		action: 'Delete an asset',
		description:
			'Delete an asset permanently. Unlike Archive, this cannot be undone through the API.',
		noContent: true,
	},
	publicGetAssetV3: {
		resource: 'asset',
		value: 'get',
		name: 'Get',
		action: 'Get an asset',
		description: 'Get an asset by ID',
	},
	publicUpdateAssetV3: {
		resource: 'asset',
		value: 'update',
		name: 'Update',
		action: 'Update an asset',
		description: 'Update an asset. Only the fields you set are changed.',
	},
	publicUnarchiveAssetV3: {
		resource: 'asset',
		value: 'unarchive',
		name: 'Unarchive',
		action: 'Unarchive an asset',
		description: 'Unarchive an asset, setting the status it returns to',
	},

	// --- Asset Statement --------------------------------------------------
	publicGetAssetStatementV3: {
		resource: 'assetStatement',
		value: 'get',
		name: 'Get',
		action: 'Get an asset statement',
		description: 'Get an asset responsibility or return statement by ID',
	},
	publicGetAssetStatementSignedFileV3: {
		resource: 'assetStatement',
		value: 'downloadSignedFile',
		name: 'Download Signed File',
		action: 'Download the signed file of an asset statement',
		description:
			'Download the signed PDF of an asset statement. Returns 409 while the statement is not signed.',
		binary: { accept: 'application/pdf', fileName: 'asset-statement.pdf' },
	},
	publicListAssetStatementsV3: {
		resource: 'assetStatement',
		value: 'getAll',
		name: 'Get Many',
		action: 'Get many asset statements',
		description:
			'List asset responsibility and return statements, including those sent from the dashboard, newest first',
	},
	publicSendAssetStatementV3: {
		resource: 'assetStatement',
		value: 'send',
		name: 'Send',
		action: 'Send an asset statement',
		description:
			'Send a responsibility or return statement to the employee for e-signature by email. In sandbox no email is sent; use Simulate Signature.',
		fields: {
			type: {
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
				description: 'Kind of statement to send',
			},
		},
	},
	publicSimulateAssetStatementSignatureV3: {
		resource: 'assetStatement',
		value: 'simulateSignature',
		name: 'Simulate Signature',
		action: 'Simulate the signature of an asset statement',
		description:
			'Simulate the employee signing a statement: it becomes signed, the signed PDF becomes available and the asset-statement.signed webhook fires. Sandbox only.',
	},
};
