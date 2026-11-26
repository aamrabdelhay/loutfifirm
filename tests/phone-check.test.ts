import assert from "node:assert/strict";
import { isValidEgyptMobile, dialableNumber, hasPhone, isMobileLabel } from "../src/features/call/phone-check";

assert.equal(isValidEgyptMobile("0122411292"), false, "10 digits is invalid");
assert.equal(isValidEgyptMobile("01224112921"), true);
assert.equal(isValidEgyptMobile("+20 122 411 2921"), true);
assert.equal(isValidEgyptMobile("٠١٢٢٤١١٢٩٢١"), true, "Arabic-Indic digits");
assert.equal(isValidEgyptMobile("01324112921"), false, "01[3] is not a mobile prefix");
assert.equal(dialableNumber(undefined, "0122411292"), null, "invalid mobile: no dialing");
assert.equal(dialableNumber("", "01224112921"), "01224112921");
assert.equal(dialableNumber("0100000000", "01224112921"), "01224112921", "invalid callNumber falls to valid mobile");
assert.equal(hasPhone([{ value: "012 2411 2921" }], "01224112921"), true);
assert.equal(isMobileLabel("محمول المكتب"), true);
assert.equal(isMobileLabel("هاتف أرضي"), false);
console.log("phone-check: all passed");

import { effectiveMobile, dialableFromContact } from "../src/features/call/phone-check";
const bad = { mobile: "0122411292", phones: [{ label: "محمول المكتب", value: "0122411292" }, { label: "هاتف", value: "37606575" }] };
assert.equal(effectiveMobile(bad), "0122411292");
assert.equal(dialableFromContact(bad), null, "both copies invalid: no call");
const fixedMobileField = { ...bad, mobile: "01224112921" };
assert.equal(effectiveMobile(fixedMobileField), "01224112921", "valid mobile field wins over stale list entry");
assert.equal(dialableFromContact(fixedMobileField), "01224112921");
const fixedListEntry = { mobile: "0122411292", phones: [{ label: "محمول المكتب", value: "01224112921" }] };
assert.equal(dialableFromContact(fixedListEntry), "01224112921", "fixing the list entry also works");
console.log("phone-check (contact): all passed");
