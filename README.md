# @red-cup-engineering/tidepool-sdk

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

The JS client for Tidepool: member flows (deploy a sleeve, deposit, route yield, declare obligations and a barrier, draw, settle, assent/object/withdraw), reads (section, census, line, barrier, questions, sites), cell-term helpers shared with `signstuff-evm`, and the demo script that drives the v0.1 demo across Base Sepolia, Gnosis Chiado and Hive. Browser and Node; EVM through `viem`; Hive through `tidepool-hive`'s intents (signing stays with the member's wallet or Keychain).
