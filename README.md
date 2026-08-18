# Arctura × Base — Testnet Gateway

This repository contains a preview-only static gateway for **Base Sepolia testnet** exploration. It connects three concepts without conflating their authority: bounded work, controlled resource access, and reviewable evidence receipts.

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
