# Base Arctura Production UI/UX Redesign Brief

## Product posture

The Base Arctura gateway is not a trading terminal or payment product. The interface should feel like a **calm launch console for a bounded Base Sepolia integration**: it makes scope, state, evidence, and prohibited actions legible at a glance.

## Audit finding

The existing page establishes a strong visual direction, but it behaves primarily as a marketing landing page. The next interface should make an operator’s first questions easier to answer:

| Operator question | UI response |
|---|---|
| What is live? | A high-visibility deployment status card with static endpoint links |
| What can this gateway do? | A compact capability matrix with enabled and disabled states |
| What must never happen here? | A persistent, accessible boundary panel—not an afterthought in the page flow |
| How do I evaluate it? | A three-step verification path with descriptor, health, and source links |
| What is the next action? | A focused route to documentation and evidence, not a wallet or payment action |

## Visual system

The redesign uses an **orbital control-plane** style: near-black space, restrained cobalt and cyan signal lines, warm amber only for gated states, deep panel gradients, fine blueprint grids, and typographic contrast between an expressive display face and a precise monospace operational layer. Motion is limited to low-amplitude scanning and orbit effects and is fully disabled for users who prefer reduced motion.

## Interaction model

The page remains static and dependency-free. Anchors lead to meaningful sections, native `details` elements disclose the exact disabled capability set, and all state markers use text alongside color. There are no wallet prompts, hidden network calls, credential fields, transaction controls, or accidental execution paths.

## Responsive and accessibility standard

Desktop surfaces use an asymmetric mission / state grid; mobile collapses the same information into a single clear reading order. Every interactive element retains visible keyboard focus, every status uses readable text labels, and contrast is maintained against all layered backgrounds.
