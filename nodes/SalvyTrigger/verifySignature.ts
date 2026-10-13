import { createHmac, timingSafeEqual } from 'crypto';

/** Maximum allowed distance between the delivery timestamp and now, in seconds. */
export const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

export interface SignatureHeaders {
	id?: string;
	timestamp?: string;
	signature?: string;
}

export type VerificationResult =
	| { valid: true }
	| {
			valid: false;
			reason:
				| 'missing-headers'
				| 'invalid-secret'
				| 'invalid-timestamp'
				| 'stale-timestamp'
				| 'no-matching-signature';
	  };

function decodeSecret(secret: string): Buffer | undefined {
	const encoded = secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret;
	const key = Buffer.from(encoded, 'base64');
	return key.length > 0 ? key : undefined;
}

/**
 * Verifies a Standard Webhooks (Svix) delivery: HMAC-SHA256 over
 * `${id}.${timestamp}.${rawBody}`, keyed with the base64 part of the `whsec_` secret.
 * The signature header may carry several space-separated `v1,<base64>` entries;
 * any one matching is enough. Timestamps more than five minutes from `nowMs` are rejected.
 */
export function verifySignature(
	secret: string,
	headers: SignatureHeaders,
	rawBody: Buffer | string,
	nowMs: number = Date.now(),
): VerificationResult {
	const { id, timestamp, signature } = headers;
	if (!id || !timestamp || !signature) return { valid: false, reason: 'missing-headers' };

	const key = decodeSecret(secret);
	if (!key) return { valid: false, reason: 'invalid-secret' };

	if (!/^\d+$/.test(timestamp)) return { valid: false, reason: 'invalid-timestamp' };
	const ageSeconds = Math.abs(nowMs / 1000 - Number(timestamp));
	if (ageSeconds > TIMESTAMP_TOLERANCE_SECONDS) return { valid: false, reason: 'stale-timestamp' };

	const body = typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : rawBody;
	const expected = createHmac('sha256', key)
		.update(Buffer.concat([Buffer.from(`${id}.${timestamp}.`, 'utf8'), body]))
		.digest();

	for (const entry of signature.split(' ')) {
		const [version, value] = entry.split(',', 2);
		if (version !== 'v1' || !value) continue;
		const candidate = Buffer.from(value, 'base64');
		if (candidate.length === expected.length && timingSafeEqual(candidate, expected)) {
			return { valid: true };
		}
	}
	return { valid: false, reason: 'no-matching-signature' };
}
