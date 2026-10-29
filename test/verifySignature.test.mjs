// Signature verification tests for the Salvy Trigger. Runs against the built
// output: `npm test` (builds first), or `node --test test/` after `npm run build`.

import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const { verifySignature } = require('../dist/nodes/SalvyTrigger/verifySignature.js');

// Known-good vector from the Svix reference library's own test suite:
// https://github.com/svix/svix-webhooks/blob/main/javascript/src/webhook.test.ts
// ("verification works with a known-good signature" vector: key, msgId, timestamp, payload, expected).
const VECTOR = {
	secret: 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw',
	id: 'msg_p5jXN8AQM9LWM0D4loKWxJek',
	timestamp: '1614265330',
	body: '{"test": 2432232314}',
	signature: 'v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=',
};
const AT_VECTOR_TIME = 1614265330 * 1000;

const headers = (overrides = {}) => ({
	id: VECTOR.id,
	timestamp: VECTOR.timestamp,
	signature: VECTOR.signature,
	...overrides,
});

const sign = (secret, id, timestamp, body) =>
	createHmac('sha256', Buffer.from(secret.replace(/^whsec_/, ''), 'base64'))
		.update(`${id}.${timestamp}.${body}`)
		.digest('base64');

test('accepts the Svix known-good vector (string and Buffer body)', () => {
	assert.deepEqual(verifySignature(VECTOR.secret, headers(), VECTOR.body, AT_VECTOR_TIME), {
		valid: true,
	});
	assert.deepEqual(
		verifySignature(VECTOR.secret, headers(), Buffer.from(VECTOR.body), AT_VECTOR_TIME),
		{ valid: true },
	);
});

test('rejects a tampered body', () => {
	const result = verifySignature(VECTOR.secret, headers(), '{"test": 2432232315}', AT_VECTOR_TIME);
	assert.deepEqual(result, { valid: false, reason: 'no-matching-signature' });
});

test('rejects a body that differs only in whitespace (raw body is what is signed)', () => {
	const result = verifySignature(VECTOR.secret, headers(), '{"test":2432232314}', AT_VECTOR_TIME);
	assert.equal(result.valid, false);
});

test('rejects a wrong secret', () => {
	const result = verifySignature(
		'whsec_' + Buffer.from('another-secret-entirely').toString('base64'),
		headers(),
		VECTOR.body,
		AT_VECTOR_TIME,
	);
	assert.deepEqual(result, { valid: false, reason: 'no-matching-signature' });
});

test('rejects a tampered msg id', () => {
	const result = verifySignature(
		VECTOR.secret,
		headers({ id: 'msg_p5jXN8AQM9LWM0D4loKWxJel' }),
		VECTOR.body,
		AT_VECTOR_TIME,
	);
	assert.equal(result.valid, false);
});

test('rejects timestamps more than 5 minutes old or in the future', () => {
	for (const offsetSeconds of [301, -301, 3600]) {
		const result = verifySignature(
			VECTOR.secret,
			headers(),
			VECTOR.body,
			AT_VECTOR_TIME + offsetSeconds * 1000,
		);
		assert.deepEqual(
			result,
			{ valid: false, reason: 'stale-timestamp' },
			`offset ${offsetSeconds}s`,
		);
	}
});

test('accepts timestamps within 5 minutes', () => {
	for (const offsetSeconds of [299, -299, 0]) {
		const result = verifySignature(
			VECTOR.secret,
			headers(),
			VECTOR.body,
			AT_VECTOR_TIME + offsetSeconds * 1000,
		);
		assert.equal(result.valid, true, `offset ${offsetSeconds}s`);
	}
});

test('a fresh, correctly signed delivery passes; the same signature with a re-signed timestamp does not', () => {
	const now = Date.now();
	const ts = String(Math.floor(now / 1000));
	const sig = sign(VECTOR.secret, 'msg_fresh', ts, VECTOR.body);
	assert.equal(
		verifySignature(
			VECTOR.secret,
			{ id: 'msg_fresh', timestamp: ts, signature: `v1,${sig}` },
			VECTOR.body,
			now,
		).valid,
		true,
	);
	const otherTs = String(Number(ts) - 10);
	assert.equal(
		verifySignature(
			VECTOR.secret,
			{ id: 'msg_fresh', timestamp: otherTs, signature: `v1,${sig}` },
			VECTOR.body,
			now,
		).valid,
		false,
	);
});

test('accepts any of several space-separated signatures (key rotation)', () => {
	const signature = `v1,Ceo5qEr07ixe2NLpvHk3FH9bwy/WavXrAFQ/9tdO6mc= v1a,ignored ${VECTOR.signature}`;
	assert.equal(
		verifySignature(VECTOR.secret, headers({ signature }), VECTOR.body, AT_VECTOR_TIME).valid,
		true,
	);
});

test('ignores non-v1 versions even when the value matches', () => {
	const signature = VECTOR.signature.replace('v1,', 'v2,');
	assert.equal(
		verifySignature(VECTOR.secret, headers({ signature }), VECTOR.body, AT_VECTOR_TIME).valid,
		false,
	);
});

test('rejects missing headers and malformed timestamps', () => {
	assert.deepEqual(
		verifySignature(VECTOR.secret, headers({ signature: undefined }), VECTOR.body, AT_VECTOR_TIME),
		{
			valid: false,
			reason: 'missing-headers',
		},
	);
	assert.deepEqual(
		verifySignature(
			VECTOR.secret,
			headers({ timestamp: '16142653.30' }),
			VECTOR.body,
			AT_VECTOR_TIME,
		),
		{
			valid: false,
			reason: 'invalid-timestamp',
		},
	);
});

test('rejects a truncated signature of a different length without throwing', () => {
	const signature = 'v1,g0hM9SsE+OTPJTGt';
	assert.equal(
		verifySignature(VECTOR.secret, headers({ signature }), VECTOR.body, AT_VECTOR_TIME).valid,
		false,
	);
});
