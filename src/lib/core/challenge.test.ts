import { describe, expect, it } from "vitest";
import { decodeChallenge, encodeChallenge } from "./challenge";
import { resolveLongChallenge } from "@/lib/storage/challenge-service";

describe("challenge codec", () => {
  const payload = {
    gameId: "daily-mix",
    dateSeed: "2026-08-16",
    packId: "geometric-demo",
    targetId: "geometric-demo-orbit",
  };

  it("round trips only stable registry identifiers", () => {
    const code = encodeChallenge(payload);
    expect(decodeChallenge(code)).toEqual({ v: 1, ...payload });
    expect(code).not.toContain("#2F63F5");
  });

  it("resolves registered targets", () => {
    expect(resolveLongChallenge(encodeChallenge(payload))?.target.targetHex).toBe("#2F63F5");
  });

  it("rejects missing targets and malformed values", () => {
    expect(resolveLongChallenge(encodeChallenge({ ...payload, targetId: "missing" }))).toBeNull();
    expect(decodeChallenge("not-json")).toBeNull();
    expect(decodeChallenge("a".repeat(513))).toBeNull();
  });
});
