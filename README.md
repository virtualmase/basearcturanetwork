# Arctura Base

**Bittensor subnet for Base chain intelligence.**

Arctura Base is a Bittensor subnet that verifies Base chain state through decentralized miner attestation. Miners read Base chain data, construct Merkle proofs, and return verified attestations. Validators score the work using Resonance BFT. TAO rewards truth.

**Status:** Builder / Testnet — not yet on mainnet.

- Site: [base.arctura.network](https://base.arctura.network)
- Repo: [github.com/bittensaur/arctura-base-subnet](https://github.com/bittensaur/arctura-base-subnet)

---

## How it works

1. **Miners register** — Any participant registers a hotkey on the subnet by burning TAO, then connects their own Base RPC endpoint (Alchemy, QuickNode, or self-hosted op-geth).
2. **Validators query** — Validators issue `AttestationRequest` synapses with a target block range. Miners have a defined response window to return proofs.
3. **Proofs verified** — Validators cross-check Merkle proofs against public Base chain data. Hash matches, proof integrity, and latency are weighted by the Resonance scoring function.
4. **TAO emitted** — Each epoch, Yuma consensus aggregates validator weights into final miner rankings. TAO flows to performance.

### Resonance BFT scoring weights

| Factor | Weight |
|---|---|
| Hash match | 0.60 |
| Proof integrity | 0.30 |
| Response latency | 0.10 |
| Missing response | score = 0 |

Consensus mechanism: Yuma / Resonance BFT. These coefficients are under review before mainnet freeze.

---

## Stack

| Component | Role | Status |
|---|---|---|
| Bittensor SDK | Consensus layer — `bt.metagraph`, `bt.synapse`, Yuma consensus | Live |
| Base Chain RPC | Data source — OP Stack L2, `eth_getBlockByNumber` | Live |
| Merkle Attestation | Proof layer — deterministic verification, no trusted intermediary | Live |
| Coinbase AgentKit | Agentic actions — on-chain reads, contract calls, autonomous execution | In progress |
| Coinbase CDP Onramp | Fiat on-ramp — card/bank to USDC on Base | Staged |
| Ops Security Audit | Pre-mainnet review of endpoint exposure, key management, proof tampering | Planned |

Requires Python 3.11+ and Bittensor SDK ≥ 7.x.

---

## Quick start

### Run a miner

```bash
git clone https://github.com/bittensaur/arctura-base-subnet
cd arctura-base-subnet
pip install -r requirements.txt

# configure a Base RPC endpoint, then run on testnet
python neurons/miner.py --network test --netuid 0
```

### Run a validator

```bash
# requires a coldkey with minimum stake — see Bittensor docs
python neurons/validator.py --network test --netuid 0
```

### Run the tests

```bash
pytest tests/ -v
# 42 passed, 0 failed
```

---

## Current limitations

- **Testnet only.** No mainnet netuid yet — use `--network test --netuid 0` until the mainnet slot is confirmed.
- **RPC rate limits.** Public Base RPC endpoints are rate-limited. Builders running at scale should use a dedicated Alchemy or QuickNode endpoint.
- **AgentKit not yet merged.** Active development branch. Core attestation works independently of AgentKit.
- **Scoring parameters may change.** Resonance weight coefficients are under review before mainnet freeze.

---

## Contributing

Three tracks are open now:

- **Miner** — run compute, serve attestations, earn TAO proportional to rank.
- **Validator** — query miners, verify proofs, set weights on-chain.
- **Contributor** — fork the repo and pick up an open issue.

**Good first issues:**
- Add a validator setup guide to the README
- Add proof construction edge case tests (`tests/test_merkle.py`)
- AgentKit action executor scaffolding (`neurons/miner.py`, `agentkit` branch)
- RPC connection pooling for high-load miners (`arctura/base/rpc.py`)

Open issues: [github.com/bittensaur/arctura-base-subnet/issues](https://github.com/bittensaur/arctura-base-subnet/issues)

---

## Links

- [base.arctura.network](https://base.arctura.network) — subnet console
- [Bittensor docs](https://docs.learnbittensor.org)
- [Base docs](https://base.org)
