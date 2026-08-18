import { readFile } from "node:fs/promises";

const [gatewayText, healthText] = await Promise.all([
  readFile(new URL("./gateway.json", import.meta.url), "utf8"),
  readFile(new URL("./health.json", import.meta.url), "utf8"),
]);

const gateway = JSON.parse(gatewayText);
const health = JSON.parse(healthText);

const disabledCapabilities = [
  "wallet_custody",
  "wallet_creation",
  "wallet_connection",
  "balance_access",
  "payments",
  "trading",
  "transfers",
  "swaps",
  "signing",
  "contract_calls",
  "autonomous_execution",
];

if (gateway.network?.caip2 !== "eip155:84532") {
  throw new Error("Gateway must identify Base Sepolia as eip155:84532.");
}

if (gateway.network?.mainnet_enabled !== false || gateway.x402?.state !== "paused") {
  throw new Error("Mainnet must remain disabled and x402 must remain paused.");
}

for (const capability of disabledCapabilities) {
  if (gateway.capabilities?.[capability] !== false) {
    throw new Error(`Capability must remain disabled: ${capability}`);
  }
}

if (
  health.status !== "configuration-ready" ||
  health.wallet_activity !== false ||
  health.payment_activity !== false ||
  health.trading_activity !== false ||
  health.mainnet_activity !== false ||
  health.x402_state !== "paused"
) {
  throw new Error("Health declaration does not preserve static gateway boundaries.");
}

const sensitivePattern = /(private[_ -]?key|seed phrase|mnemonic|api[_ -]?key|secret|password)/i;
if (sensitivePattern.test(gatewayText) || sensitivePattern.test(healthText)) {
  throw new Error("Static endpoint contains a credential-like field or value.");
}

console.log("Static Base Arctura gateway endpoint validation passed.");
