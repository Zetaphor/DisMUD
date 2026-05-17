import { describe, it, expect } from "vitest";
import { resolveDirection } from "./directions";
import capitalizeFirst from "./capitalizeFirst";
import { stripString } from "./wordFilter";

describe("resolveDirection", () => {
  it("resolves short direction aliases", () => {
    expect(resolveDirection("n")).toBe("north");
    expect(resolveDirection("s")).toBe("south");
    expect(resolveDirection("e")).toBe("east");
    expect(resolveDirection("w")).toBe("west");
    expect(resolveDirection("u")).toBe("up");
    expect(resolveDirection("d")).toBe("down");
  });

  it("resolves full direction names", () => {
    expect(resolveDirection("north")).toBe("north");
    expect(resolveDirection("south")).toBe("south");
    expect(resolveDirection("east")).toBe("east");
    expect(resolveDirection("west")).toBe("west");
    expect(resolveDirection("up")).toBe("up");
    expect(resolveDirection("down")).toBe("down");
  });

  it("is case-insensitive", () => {
    expect(resolveDirection("N")).toBe("north");
    expect(resolveDirection("NORTH")).toBe("north");
    expect(resolveDirection("East")).toBe("east");
  });

  it("returns null for invalid directions", () => {
    expect(resolveDirection("northwest")).toBeNull();
    expect(resolveDirection("left")).toBeNull();
    expect(resolveDirection("")).toBeNull();
    expect(resolveDirection("x")).toBeNull();
  });
});

describe("capitalizeFirst", () => {
  it("capitalizes the first letter", () => {
    expect(capitalizeFirst("hello")).toBe("Hello");
    expect(capitalizeFirst("world")).toBe("World");
  });

  it("handles single character strings", () => {
    expect(capitalizeFirst("a")).toBe("A");
  });

  it("preserves already capitalized strings", () => {
    expect(capitalizeFirst("Hello")).toBe("Hello");
  });

  it("handles empty strings", () => {
    expect(capitalizeFirst("")).toBe("");
  });
});

describe("stripString", () => {
  it("removes special characters", () => {
    expect(stripString("hello!")).toBe("hello");
    expect(stripString("test@#$")).toBe("test");
  });

  it("preserves alphanumeric characters and spaces", () => {
    expect(stripString("hello world")).toBe("hello world");
    expect(stripString("test123")).toBe("test123");
  });

  it("trims whitespace", () => {
    expect(stripString("  hello  ")).toBe("hello");
  });
});
