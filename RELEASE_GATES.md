# Base Arctura Gateway Release Gates

## Current release scope

The current release is a static Base Sepolia gateway descriptor and health declaration. It may be merged only after preview verification confirms that `/gateway.json` and `/health.json` are publicly reachable, parse correctly, and retain their disabled capabilities.

## Financial action boundary

The command layer stated a **maximum risk ceiling of $20**. This is a risk cap, not an instruction to create or connect a wallet, receive funds, fund a wallet, sign, transfer, swap, trade, pay, or settle an x402 request.

Before any irreversible financial action, the implementation record must state and receive an immediate final confirmation for all of the following:

| Required field | Why it is required |
|---|---|
| Network | Distinguishes Base Sepolia from Base Mainnet and other chains |
| Asset and maximum amount | Enforces the $20 ceiling and avoids an implicit denomination |
| Funding source and target | Identifies where value leaves and arrives |
| Exact action | Separates wallet creation, funding, transfer, swap, trade, signing, payment, or contract call |
| Approval screen / transaction consequence | Makes the irreversible result visible before a user confirms |

No static endpoint changes this requirement.

## Current disabled functions

Wallet creation and connection, custody, balance reads, payment fulfillment, x402, receiver and facilitator configuration, transfers, swaps, trading, signing, contract calls, autonomous execution, and mainnet are all disabled in the static descriptor. A later activation would require separate design, security, legal, and specific user-approval gates.

## Production gate

The production branch must be merged through its existing pull request after preview verification. Publishing is a user-operated deployment action; once the merge is approved, use the hosting control plane’s **Publish** action to release the merged production branch. Do not publish a separate unreviewed deployment or alter domain settings.
