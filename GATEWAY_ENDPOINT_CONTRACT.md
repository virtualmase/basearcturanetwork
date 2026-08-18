# Base Arctura Static Gateway Endpoint Contract

**State:** `preview`
**Network:** `Base Sepolia · eip155:84532`
**Endpoint class:** Static configuration descriptor; no dynamic service, authentication, wallet, or payment behavior.

## Purpose

`/gateway.json` provides a machine-readable description of the Base Arctura testnet gateway. It allows a human or client to confirm scope before following a documentation link or considering a future integration. It is not an API for account access, task execution, payment fulfillment, settlement, or on-chain action.

`/health.json` provides a static deployment-scope declaration. It intentionally does not claim live payment, wallet, or chain health.

## Required fields

| Field | Meaning | Boundary |
|---|---|---|
| `state` | Lifecycle state of the descriptor | `preview`; does not imply production readiness |
| `network` | Chain identifier and human-readable name | Base Sepolia only; no mainnet selection |
| `capabilities` | Explicit feature booleans | Wallet custody, payments, trading, signing, transfers, swaps, contract calls, and autonomous execution must remain `false` |
| `x402` | Resource-gating state | `paused`; no receiver, facilitator, payment amount, or fulfillment flow exposed |
| `links` | Documentation and public site references | Official Base docs and Arctura Observatory only; no credential-bearing URLs |
| `updated_at` | Manual descriptor version date | Static content timestamp; not a chain or payment status |

## Prohibited fields

The descriptor and health declaration must not include private keys, seed phrases, passkeys, API keys, Base Builder credentials, wallet addresses, balances, account identifiers, trading signals, payment receivers, facilitator URLs, token-sale language, or an instruction to execute a transaction.

## Validation standard

The JSON files must parse cleanly, use only the Base Sepolia CAIP-2 identifier `eip155:84532`, contain no credential-like patterns, and match the restrictions documented in the repository README. The preview deployment must be checked before any merge to `main`.

## Sources

- [Base: Connecting to Base](https://docs.base.org/base-chain/quickstart/connecting-to-base)
- [Base: Network Faucets](https://docs.base.org/base-chain/network-information/network-faucets)
