import assert from "node:assert/strict";
import { deriveSubmissionId, manageToken, verifyManageToken } from "../src/features/booking/token";
process.env.APPOINTMENTS_API_SECRET = "unit-secret"; // read at call time

const a = deriveSubmissionId("11111111-1111-4111-8111-111111111111")!;
assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
assert.equal(deriveSubmissionId("11111111-1111-4111-8111-111111111111"), a, "same request id, same id (idempotent)");
assert.notEqual(deriveSubmissionId("22222222-2222-4222-8222-222222222222"), a);
const t = manageToken(a)!;
assert.equal(verifyManageToken(a, t), true);
assert.equal(verifyManageToken(a, t.slice(0, -2) + "xx"), false, "tampered signature");
assert.equal(verifyManageToken("33333333-3333-4333-8333-333333333333", t), false, "token for another id");
const old = manageToken(a, Date.now() - 91 * 24 * 3600 * 1000)!;
assert.equal(verifyManageToken(a, old), false, "expired token");
assert.equal(verifyManageToken(a, "garbage"), false);
console.log("booking-token: all passed");
