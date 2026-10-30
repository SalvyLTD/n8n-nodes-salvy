// English descriptions for the event types the API lists (its own descriptions are pt-BR).
// An event missing here is shown by name only, so the dropdown never falls back to Portuguese.
export const eventDescriptions: Record<string, string> = {
	'asset-statement.canceled':
		'Sent when an asset responsibility or return statement is canceled: replaced by a newer statement, invalidated because an asset moved to another employee before signing, canceled by the company, or declined by the employee. See `cancelReason` in `GET /asset-statements/{id}`.',
	'asset-statement.signed':
		'Sent when an employee signs an asset responsibility or return statement',
	'asset.created': 'Sent when an asset is created',
	'asset.deleted': 'Sent when an asset is deleted',
	'asset.updated': 'Sent when an asset is updated',
	'employee.created': 'Sent when an employee is created',
	'employee.deleted': 'Sent when an employee is deleted',
	'employee.updated': 'Sent when an employee is updated',
	'phone-account.activated': 'Sent when a phone line is activated',
	'phone-account.blocked': 'Sent when a phone line is blocked',
	'phone-account.canceled': 'Sent when a phone line is canceled',
	'phone-account.data-balance-low':
		"Sent when a line's data balance drops to 20% or less of its plan, or when the plan's data runs out (0%). If one reading crosses both levels, a single event is sent with the more severe one. The event reflects the balance as last read from the carrier, which can lag slightly behind actual usage.",
	'phone-account.esim-ready': "Sent when a line's eSIM activation code becomes available",
	'phone-account.reactivated': 'Sent when a phone line is reactivated',
	'phone-account.unblocked': 'Sent when a phone line is unblocked',
	'sms.received': 'Sent when a virtual line receives an SMS',
	'task.failed':
		'Sent when a task started by an API key finishes with at least one item whose change was not applied',
	'task.succeeded':
		'Sent when a task started by an API key finishes with the change applied to every item',
};
