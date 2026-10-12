# @red-cup-engineering/tidepool-sdk

The JS client for Tidepool: member flows (deploy a sleeve, deposit, route yield, declare obligations and a barrier, draw, settle, assent/object/withdraw), reads (section, census, line, barrier, questions, sites), cell-term helpers shared with `signstuff-evm`, and the demo script that drives the v0.1 demo across Base Sepolia, Gnosis Chiado and Hive. Browser and Node; EVM through `viem`; Hive through `tidepool-hive`'s intents (signing stays with the member's wallet or Keychain).
