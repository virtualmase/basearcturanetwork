import assert from "node:assert/strict";
import test from "node:test";

import { readConfig } from "../server.mjs";

const valid = {
  PORT: "4021",
  X402_NETWORK: "eip155:84532",
  X402_PAY_TO: "0x2222222222222222222222222222222222222222",
  X402_FACILITATOR_URL: "https://x402.org/facilitator",
  X402_MARKET_ANALYSIS_PRICE: "$0.01",
};

test("accepts an explicit Base Sepolia canary configuration", () => {
  const config = readConfig(valid);
  assert.equal(config.network, "eip155:84532");
  assert.equal(config.marketAnalysisPrice, "$0.01");
});

test("refuses a missing or zero receiver", () => {
  assert.throws(() => readConfig({ ...valid, X402_PAY_TO: undefined }), /X402_PAY_TO/);
  assert.throws(
    () => readConfig({ ...valid, X402_PAY_TO: `0x${"0".repeat(40)}` }),
    /X402_PAY_TO/,
  );
});

test("refuses mainnet and uncapped prices", () => {
  assert.throws(() => readConfig({ ...valid, X402_NETWORK: "eip155:8453" }), /Base Sepolia/);
  assert.throws(() => readConfig({ ...valid, X402_MARKET_ANALYSIS_PRICE: "$1.00" }), /canary price/);
});
