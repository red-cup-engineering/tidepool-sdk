# tidepool-sdk roadmap (revision 3)

Spec: master specification revision 3, §3 (A1–A7, B1, B4), §8 (the two-part demo). Conventions: ESM, `viem` pinned, ABIs and manifests from `tidepool-evm` (TP-EVM-014's artifacts; the SDK refuses a manifest whose `charterHash` differs from the chain), cell terms from `tidepool-evm/scripts/lib/tidepool-terms.mjs`, no key handling beyond a `WalletClient` the caller supplies. **Note rule:** every task's acceptance includes a note at `tidepool-engineering-services-section/content/text/documents/articles/notes/YYYY/MM/DD/YYYY-MM-DD-note-on-<task-id>-<slug>.md`; a task without its note is unfinished.

## Phase 1 (v0.1)

### TP-SDK-001 `v0.1` Bindings, terms, refusal decoding
- Goal: `src/contracts.mjs` (typed wrappers over the Appendix A ABIs, manifest-driven per chain id, `charterHash` check), `src/terms.mjs` (re-exports the JS twin; `cellOf`, `memberWitness`), `src/refusals.mjs` (decodes every custom error in Appendix A into `{name, datum}` from simulation revert data; this is how "refuse by name" reaches a person), `src/sites.mjs`.
- Acceptance: every row of `tidepool-terms.json` round-trips; every error selector in the ABIs decodes; a wrong `charterHash` refuses.
- Depends: TP-EVM-014.

### TP-SDK-002 `v0.1` Member flows
- Goal: `src/member.mjs`: `ensureSleeve`, `deposit(assets, minShares)`, `redeemPrincipal`, `redeemAll`, `redeemSurplus`, `routeYield`, `declareObligation` (with the bond), `declareBarrier`, `declareStage`, `draw` (builds and signs the EIP-3009 authorization with `nonce = drawIdFor(member, nonce)`, `to = desk`, `value = amount + price`, validity per A3.1; or approves under `Allowance` mode), `settle`, `assent`/`object`/`withdraw`/`rejoin`, `claim`, `claimReseed`, `openEdge`/`admitEdge`, `challengeTotal`, `linkHive`; each returns the transaction hash, the cells told, and, on refusal, the decoded name and datum.
- Acceptance: the end-to-end Foundry scenario reproduces through the SDK against anvil; `draw` with a zero `feeAvoided` surfaces `FeeAvoidedUnknown` as a named refusal; a Gnosis-mode draw uses `Allowance`.
- Depends: TP-SDK-001.

### TP-SDK-003 `v0.1` Reads
- Goal: `src/read.mjs`: `section(cells[])`, `census()`, `heldCells()`, `line(member)` (with `openExposure` and `limit`), `barrier(fromDay, toDay)`, `question(q)` and `participation`, `unheard(q)`, `sites()`, `meetOf(site, cycle)`, `treasuryView()`, `claimable(to)`, `defaultsHeld()`, `claims()`, `edges(party)`; `watch(poolId)`.
- Acceptance: reads against anvil match the Foundry assertions.
- Depends: TP-SDK-001.

### TP-SDK-004a `v0.1` Demo part one: money reaching projects
- Goal: `scripts/demo-part-one.mjs --sites base-sepolia,gnosis-chiado,hive`: five sleeves (founder, 561 Group cell, two kin, one disclosed agent member seeded by the deploy script); deposits and routed yield; a stranger closes a cycle on each EVM site and is paid; the cycle question: one withdrawal (member still a member, line untouched), one lone objection (recorded; the standing formula executes), then a second cycle with nobody heard (adjourns to `F0`); `execute` accrues to the first-roster cells; a cell `claim`s; Hive contributes a head (TP-KEEP-003 output). Prints the receipt table with plain-language labels and the formal term on request (`--gloss`).
- Acceptance: every step's expected storage and cell values asserted; `--dry-run` on anvil in CI.
- Depends: TP-SDK-002, TP-SDK-003, TP-KEEP-001, TP-KEEP-002, TP-KEEP-003.

### TP-SDK-004b `v0.1` Demo part two: credit, default held, reseed, clearing, the live disagreement
- Goal: `scripts/demo-part-two.mjs`: a draw admitted against the exposure cap; a second refused by name at the barrier horizon; a draw marked overdue after the grace, shown on the opsroom as a default held, then settled late with the line recovering; a reseed claim granted through an A4 question with the heard quorum, and one refused for silence; a three-party obligation cycle netted with no asset moving; a Hive release and repayment recorded as provisional cells and reconciled; the live adversarial disagreement: an audience wallet admitted by vouch challenges a site's cycle total with a bond, the cell goes ⊤, `meetOf` pays the minimum, the opsroom shows the held mass, and a `SettleMeet` question releases it.
- Acceptance: as 004a; the audience step works with any address the operator admits during the demo.
- Depends: TP-SDK-004a.

## Phase 2 (v0.2)

- TP-SDK-005 instrument wrappers (`TallyVoteV1`, `CellRegistryV1`, `SettlementBountyV1`, `WorklistV1`, `AlgedonicV1`, EnterpriseAccount UserOperation builder); TP-SDK-006 integration examples.

## Capability-ledger citations

`tp-route-directed-yield-intent` (fold-into `src/intents.mjs` in TP-ENG-005); `tp-site-position-calldata` (TP-SDK-002); `tp-site-admission-intake` (the site's admission form posts a `SponsorVouch` request the SDK encodes); `tp-pool-cli` (retire-with-reason: superseded by the demo scripts and member flows; its verbs are mapped in TP-ENG-002's matrix); `tp-claim-first-cycle-rewards`, `tp-first-cash-plan` (retire-with-reason).
