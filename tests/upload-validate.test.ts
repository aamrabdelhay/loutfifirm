import assert from "node:assert/strict";
import { validateFile, MAX_BYTES, safeName } from "../src/features/uploads/validate";

const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 1, 2]);
assert.equal(validateFile("a.pdf", "application/pdf", pdf).ok, true);
assert.equal(validateFile("a.pdf", "image/png", pdf).ok, false, "type/extension mismatch");
assert.equal(validateFile("a.png", "image/png", pdf).ok, false, "pdf bytes declared as png");
assert.equal(validateFile("a.exe", "application/x-msdownload", pdf).ok, false, "type not allowed");
assert.equal(validateFile("a.pdf", "application/pdf", new Uint8Array(0)).ok, false, "empty");
assert.equal(validateFile("a.pdf", "application/pdf", new Uint8Array(MAX_BYTES + 1)).ok, false, "too big");
assert.equal(safeName("../../etc/passwd"), ".._.._etc_passwd");
console.log("upload-validate: all passed");
