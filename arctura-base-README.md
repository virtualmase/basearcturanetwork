# arctura-base-subnet

> **The first open-source Bittensor subnet purpose-built to bridge Base blockchain intelligence into the decentralized AI network.**

[![Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Bittensor](https://img.shields.io/badge/network-Bittensor%20Finney-9b8cff.svg)](https://taostats.io/subnets)
[![Base](https://img.shields.io/badge/chain-Base%20Mainnet-0052ff.svg)](https://base.org)
[![Status](https://img.shields.io/badge/status-Phase%200%20%E2%80%94%20Building-00e5a0.svg)](https://base.arctura.network)

**base.arctura.network** · Part of the [Arctura Network](https://arctura.network) · Funded by Base

---

## What this is

`arctura-base-subnet` is a Bittensor subnet that makes Base chain state a first-class citizen of the decentralized AI network.

**Miners** read Base blockchain data — contract state, transaction history, event logs, and onchain agent actions via AgentKit — and return Merkle-anchored attestation proofs.

**Validators** issue Base chain mandates, verify miner attestations against live Base block hashes using Resonance BFT scoring, and set weights via Yuma Consensus.

**TAO emissions** flow to miners who prove their work. The incentive is cryptoeconomic, not reputational.

```
Base Mainnet  ──▶  arctura-base-subnet (Bittensor)  ──▶  TAO Emissions
     │                        │
  Block state           Resonance BFT
  AgentKit               Attestation
  CDP SDK                Merkle proof
  MCP tools              Truth Ledger
```

---

## Why this matters

There are 128 subnet slots on Bittensor. There are **zero Base subnets**.

Base is Coinbase's L2 — 10M+ daily active addresses, the deepest onchain consumer surface in crypto, with native AI agent tooling (AgentKit, CDP SDK, MCP server) already deployed and open source.

Bittensor is the decentralized AI incentive layer — TAO emissions reward miners who perform verifiable AI work, with validator-set consensus so no single party controls reward distribution.

This subnet is the bridge between them. First-mover, open source, Apache-2.0.

---

## Architecture

The subnet maps directly to the [Arctura six-layer signal stack](https://arctura.network#stack):

| Layer | Component | What it does |
|-------|-----------|--------------|
| L0 · Intent | `BaseSubnetSynapse` | Validators issue mandates: block ranges, contract addresses, event queries |
| L1 · Orchestration | `neurons/validator.py` | Routes mandates to miners, handles retries, escalates failures |
| L2 · Sandbox | Deterministic execution | Same Base state in → same output out. Attestations reproducible by any third party |
| L3 · Cognitive Mesh | AgentKit adapter | Miners optionally execute onchain agent actions as part of mandate execution |
| L4 · Memory Fabric | State index | Local index of Base contract state, tx history, event logs — attested off-chain |
| L5 · Action Surface | MCP bindings | Axon endpoints expose Base reads as MCP tool bindings callable by any AI agent |

### Core Protocol

```python
# arctura_base/protocol.py
class BaseSubnetSynapse(bt.Synapse):
    # Mandate: what Base data to fetch and attest
    base_block_range: tuple[int, int] = (0, 0)
    contract_address: Optional[str] = None
    query_type: str = ""  # "balance" | "events" | "state" | "agent_action"
    mandate_payload: dict = {}

    # Attestation: Merkle-anchored proof of Base chain state
    base_state_hash: Optional[str] = None
    merkle_proof: Optional[list] = None
    block_hash_anchor: Optional[str] = None  # anchored to Base block hash
    execution_trace: Optional[dict] = None
    confidence: float = 0.0
```

### Validator scoring (Resonance BFT)

```python
# neurons/validator.py — simplified scoring loop
def score_miner_response(response: BaseSubnetSynapse, reference_block_hash: str) -> float:
    if not response.merkle_proof or not response.base_state_hash:
        return 0.0
    if not verify_merkle_proof(response.merkle_proof, response.base_state_hash):
        return 0.0
    if response.block_hash_anchor != reference_block_hash:
        return 0.0  # stale or fabricated attestation
    return response.confidence  # [0.0, 1.0] weighted by proof completeness
```

---

## Repository Structure

```
arctura-base-subnet/
├── arctura_base/
│   ├── protocol.py          # BaseSubnetSynapse — mandate + attestation schema
│   ├── base_rpc.py          # Base chain client (Coinbase RPC + CDP SDK)
│   ├── agentkit.py          # AgentKit adapter — onchain actions as mandate types
│   ├── incentive.py         # Resonance BFT scoring logic
│   └── utils.py             # Merkle proof helpers, block hash anchoring
├── neurons/
│   ├── miner.py             # Reads Base RPC, builds Merkle proofs, returns attestation
│   └── validator.py         # Issues mandates, verifies proofs, sets Yuma weights
├── agent/
│   └── arctura-base-agent.html  # Claude-powered Base × Bittensor advisor
├── docs/
│   ├── BASE_INTEGRATION.md  # Base RPC setup, AgentKit, MCP bindings, smart wallets
│   ├── SUBNET_LAUNCH.md     # Wallet setup, TAO acquisition, testnet → mainnet
│   ├── VALIDATOR_GUIDE.md   # Running a validator node, weight-setting, earnings
│   ├── MINER_GUIDE.md       # Running a miner node, Base RPC config, attestation
│   └── FUNDING_GUIDE.md     # All four Base funding programs — step by step
├── scripts/
│   ├── start_miner.sh
│   ├── start_validator.sh
│   └── check_wallets.sh
├── training/
│   └── base_qa_scenarios.json   # 12+ Q&A scenarios for the Base subnet agent
├── tests/
│   ├── test_protocol.py
│   ├── test_attestation.py
│   └── test_scoring.py
├── .env.example
├── requirements.txt
├── pyproject.toml
└── README.md
```

---

## Quick Start

### Prerequisites

```bash
pip install bittensor
pip install web3 coincurve merkletools
# For AgentKit integration:
pip install coinbase-agentkit cdp-sdk
```

### 1. Clone and install

```bash
git clone https://github.com/virtualmase/arctura-base-subnet
cd arctura-base-subnet
pip install -e .
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env:
# BASE_RPC_URL=https://mainnet.base.org       # or Coinbase's node endpoint
# BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
# CDP_API_KEY_NAME=your-cdp-key-name          # optional: AgentKit integration
# CDP_API_KEY_PRIVATE_KEY=your-private-key
```

### 3. Set up Bittensor wallets

```bash
# Owner wallet (registers the subnet)
btcli wallet new_coldkey --wallet.name owner
btcli wallet new_hotkey --wallet.name owner --wallet.hotkey default

# Validator wallet
btcli wallet new_coldkey --wallet.name validator
btcli wallet new_hotkey --wallet.name validator --wallet.hotkey default

# Miner wallet
btcli wallet new_coldkey --wallet.name miner
btcli wallet new_hotkey --wallet.name miner --wallet.hotkey default
```

### 4. Check current subnet registration cost

```bash
# Always check before registering — cost is dynamic
btcli subnet burn_cost --subtensor.network finney
```

### 5. Run locally (local chain)

```bash
# Terminal 1: miner
python neurons/miner.py \
  --wallet.name miner \
  --wallet.hotkey default \
  --subtensor.network local \
  --netuid 1

# Terminal 2: validator
python neurons/validator.py \
  --wallet.name validator \
  --wallet.hotkey default \
  --subtensor.network local \
  --netuid 1
```

### 6. Register on testnet

```bash
# Create subnet on testnet
btcli subnet create \
  --wallet.name owner \
  --subtensor.network test

# Register validator
btcli subnet recycle_register \
  --netuid <your_netuid> \
  --wallet.name validator \
  --subtensor.network test

# Register miner
btcli subnet recycle_register \
  --netuid <your_netuid> \
  --wallet.name miner \
  --subtensor.network test
```

---

## Funding Stack

This project is eligible for and actively pursuing:

| Program | Amount | Status | Link |
|---------|--------|--------|------|
| **Base Builder Rewards** | 2 ETH/week | Applying | [builderscore.xyz](https://builderscore.xyz) |
| **Base Builder Grants** | 1–5 ETH | Shipped → eligible | [paragraph.com/@grants.base.eth](https://paragraph.com/@grants.base.eth/calling-based-builders) |
| **OP Retro Funding** | Variable | Public goods track | [retrofunding.optimism.io](https://retrofunding.optimism.io) |
| **Base Batches** | Significant + VC | Phase 2 target | [basebatches.xyz](https://basebatches.xyz) |
| **TAO Emissions** | Ongoing | Post-mainnet | [taostats.io](https://taostats.io/subnets) |

The subnet is intentionally designed as a **public good** — Apache-2.0, open source, fully forkable. Every line of code Base funds becomes permanent open-source infrastructure for the intersection of Base and Bittensor.

---

## Roadmap

| Phase | Timeline | Milestone |
|-------|----------|-----------|
| **0 · Foundation** | Weeks 1–2 | Repo live, base.arctura.network up, wallets funded, Base Builder Rewards applied |
| **1 · Protocol Build** | Weeks 3–4 | protocol.py, miner.py, validator.py working on local chain. Base RPC verified. |
| **2 · Testnet** | Weeks 5–6 | Registered on Bittensor testnet. End-to-end attestation flow validated. Emissions tested. |
| **3 · Mainnet** | Weeks 7–8 | Mainnet registration. External validators recruited. Immunity period begins. |
| **4 · Base Batches** | Q3 2026 | AgentKit deep integration, smart wallet support, Base Batches application with live netuid |

---

## Contributing

This is an open-source public good. Contributions welcome.

```bash
git clone https://github.com/virtualmase/arctura-base-subnet
cd arctura-base-subnet
pip install -e ".[dev]"
pytest tests/
```

Key contribution areas: Base RPC reliability, Merkle proof optimization, AgentKit mandate types, validator scoring improvements, documentation.

---

## Related

- [arctura.network](https://arctura.network) — Parent subnet and signal stack
- [academy.arctura.network](https://academy.arctura.network) — Learn ARM, Resonance BFT, protocol engineering
- [base.arctura.network](https://base.arctura.network) — Project landing page
- [github.com/virtualmase/arctura](https://github.com/virtualmase/arctura) — Core Arctura repo
- [Base Documentation](https://docs.base.org) — Base chain, AgentKit, CDP SDK
- [Bittensor Documentation](https://docs.bittensor.com) — Subnet creation, neuron development

---

## License

Apache-2.0 — see [LICENSE](LICENSE)

*Transmitted by the Arcturian Council · base.arctura.network*
