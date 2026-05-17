import { describe, it, expect } from "vitest";
import diceRoll from "./diceRoll";
import { hasBitvector } from "./bitvectors";

describe("diceRoll", () => {
  it("parses NdS format correctly", () => {
    const result = diceRoll("1d1");
    expect(result).toBe(1);
  });

  it("applies positive modifiers", () => {
    const result = diceRoll("1d1+5");
    expect(result).toBe(6);
  });

  it("applies negative modifiers", () => {
    const result = diceRoll("1d1-1");
    expect(result).toBe(0);
  });

  it("returns values within valid range for multi-dice", () => {
    for (let i = 0; i < 100; i++) {
      const result = diceRoll("2d6");
      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThanOrEqual(12);
    }
  });

  it("returns values within valid range with modifier", () => {
    for (let i = 0; i < 100; i++) {
      const result = diceRoll("3d8+10");
      expect(result).toBeGreaterThanOrEqual(13);
      expect(result).toBeLessThanOrEqual(34);
    }
  });
});

describe("hasBitvector", () => {
  it("returns true when bitvector character matches at same index", () => {
    expect(hasBitvector("abc", "axx")).toBe(true);
    expect(hasBitvector("abc", "xbx")).toBe(true);
  });

  it("returns false when no character matches at same index", () => {
    expect(hasBitvector("abc", "xyz")).toBe(false);
  });
});
