import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  amountTerm, cellId, cycleTerm, encodeTerm, idTerm, ledgerWitness, memberLabel, memberTerm, memberWitness, poolCycleSite, scoped,
  signedAmountTerm, siteId, siteTerm, sleeveTerm, witnessId, PREDICATES, predicateId, predicateTerm,
} from "@red-cup-engineering/tidepool-evm/terms";
import { envelopeDigest } from "@red-cup-engineering/tidepool-evm/relay-envelope";

// tidepool-sdk consumes the same fixture files as Foundry and tidepool-hive, through the tidepool-evm package exports.
const vec = (name) => JSON.parse(readFileSync(new URL(import.meta.resolve(`@red-cup-engineering/tidepool-evm/vectors/${name}`)), "utf8"));
const T = vec("tidepool-terms.json");

test("every row of tidepool-terms.json round-trips through the JS twin", () => {
  for (const r of T.members) {
    assert.equal(encodeTerm(memberTerm(r.address)), r.encoded);
    assert.equal(witnessId(memberWitness(r.address)), r.witnessId);
  }
  for (const r of T.sleeves) assert.equal(encodeTerm(sleeveTerm(r.address)), r.encoded);
  for (const r of T.ids) assert.equal(encodeTerm(idTerm(r.id)), r.encoded);
  for (const r of T.poolCycleSites) assert.equal(encodeTerm(poolCycleSite(r.poolId, r.cycle, r.caip2)), r.encoded);
  for (const r of T.amounts) assert.equal(encodeTerm(amountTerm(r.value)), r.encoded);
  for (const r of T.signedAmounts) assert.equal(encodeTerm(signedAmountTerm(r.value)), r.encoded);
  for (const r of T.sites) { assert.equal(encodeTerm(siteTerm(r.caip2)), r.encoded); assert.equal("0x" + siteId(r.caip2), r.id); }
  for (const r of T.ledgers) assert.equal(encodeTerm(ledgerWitness(r.caip2, r.address)), r.witness);
  for (const r of T.cycles) assert.equal(encodeTerm(cycleTerm(Number(r.value))), r.encoded);
  for (const r of T.scoped.filter((x) => x.kind === "member")) assert.equal(encodeTerm(scoped(memberLabel(r.arg), r.n)), r.encoded);
});

test("the vocabulary file lists the twin's predicates with their terms and ids", () => {
  const V = vec("tidepool-vocab.json").predicates;
  assert.equal(V.length, PREDICATES.length);
  V.forEach((p, i) => {
    assert.equal(p.name, PREDICATES[i][1]);
    assert.equal(p.term, encodeTerm(predicateTerm(p.name)));
    assert.equal(p.id, "0x" + predicateId(p.name));
  });
});

test("lifecycle cell ids are stable addresses", () => {
  const admitted = T.cells.find((c) => c.name === "admittedBy");
  assert.equal(cellId(memberTerm(admitted.member), "tidepool:admittedBy", idTerm(admitted.digest)), admitted.cellId);
});

test("relay envelope digests equal the file's", () => {
  for (const c of vec("relay-envelope.json").cases) assert.equal(envelopeDigest(c.envelope), c.digest);
});
