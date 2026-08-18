# Source Ledger — Base Sepolia Gateway

**Last reviewed:** August 18, 2026

| Source | Finding used | Boundary |
|---|---|---|
| [Base — Connecting to Base](https://docs.base.org/base-chain/quickstart/connecting-to-base) | Base documentation distinguishes mainnet and Base Sepolia testnet, notes that public endpoints are rate-limited and not for production traffic, and directs production users to a node provider | This gateway presents itself as testnet-only and does not make a production-RPC or service-availability claim |
| [Base — Network Faucets](https://docs.base.org/base-chain/network-information/network-faucets) | Base lists multiple Base Sepolia faucet options and describes testnet assets / claim limits | The site links to official documentation only; it does not create wallets, request assets, or handle faucet credentials |
| [base.arctura.network](https://base.arctura.network/) | Public surface was blank when reviewed | Production must remain unchanged until the preview PR is explicitly authorized for merge |
| [basearcturanetwork source](https://github.com/virtualmase/basearcturanetwork) | `main` contained a blank landing page and minimal README when audited | The preview is a content replacement, not evidence of a deployed payment, wallet, x402, or protocol service |
