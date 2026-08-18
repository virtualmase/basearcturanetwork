# Arctura × Base — Testnet Gateway

This repository contains a static gateway and an activation-gated x402 resource
server for **Base Sepolia testnet**. It connects bounded work, controlled
resource access, and reviewable evidence receipts without conflating their
authority.

> **Status:** Early-access testnet surface. It is not a wallet, custodian, exchange, banking service, token sale, investment product, financial-advice service, payment processor, or mainnet application.

## Public boundaries

| Surface | Current state |
|---|---|
| Network | Base Sepolia testnet only |
| Wallets | User-controlled; this site must never request private keys, seed phrases, or custody |
| Payment | No payment fulfillment is configured in this static project |
| x402 | A future controlled resource-gating layer; requires a separately reviewed server, facilitator, receiver address, price cap, and explicit test authorization |
| Mainnet | Not in scope |
| Claims | Every product, task, resource, and evidence claim must carry a state and source boundary |

## Static gateway endpoints

| Endpoint | State | Purpose |
|---|---|---|
| [`/gateway.json`](./gateway.json) | `preview` | Machine-readable Base Sepolia gateway descriptor with explicit disabled capability fields |
| [`/health.json`](./health.json) | `configuration-ready` | Static deployment-scope declaration; it does not claim live chain, wallet, payment, or service health |

Both files are static and public. They contain no credentials, wallet addresses, receiver addresses, facilitator URLs, payment amounts, account data, or transaction behavior. See [`GATEWAY_ENDPOINT_CONTRACT.md`](./GATEWAY_ENDPOINT_CONTRACT.md) for their required contract and validation boundaries.

## x402 canary server

The dynamic server protects `GET /api/v1/market-analysis` with the official
x402 v2 Express middleware and exact EVM payment scheme. It refuses startup
unless a non-zero receiver and HTTPS facilitator are explicitly supplied.

```bash
npm install
X402_PAY_TO=0xYourBaseSepoliaReceiver \
X402_FACILITATOR_URL=https://x402.org/facilitator \
npm start
```

The canary is restricted in code to Base Sepolia and a maximum price of
`$0.01`. `GET /health` reports dynamic service health; an unpaid request to the
protected endpoint returns the protocol-standard `402` challenge.

## Local review

Use any static server, for example:

```bash
python3 -m http.server 4176
```

Then open `http://localhost:4176`.

## References

- [Base: Connecting to Base](https://docs.base.org/base-chain/quickstart/connecting-to-base)
- [Base: Network Faucets](https://docs.base.org/base-chain/network-information/network-faucets)
- [Arctura Observatory](https://arctura.org)

## Production gate

Changes must be reviewed on a preview branch and deployment before merging to `main`. Production publication needs explicit authorization. Do not add a real payment receiver, wallet integration, facilitator, mainnet asset, investment language, or autonomous action without separate design, security, legal, and user-approval gates.
