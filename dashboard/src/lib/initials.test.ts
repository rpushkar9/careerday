import { describe, it, expect } from "vitest";
import { getInitials } from "./initials";

describe("getInitials", () => {
  it("returns uppercase initials for a full name", () => {
    expect(getInitials("Alice Chen")).toBe("AC");
  });

  it("handles a single-word name", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("handles a three-word name", () => {
    expect(getInitials("Mary Jane Watson")).toBe("MJW");
  });

  it("handles leading spaces without producing undefined", () => {
    expect(getInitials(" Doe")).toBe("D");
  });

  it("handles double spaces between words", () => {
    expect(getInitials("Foo  Bar")).toBe("FB");
  });

  it("returns empty string for a blank name", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });

  it("uppercases lowercase names", () => {
    expect(getInitials("alice chen")).toBe("AC");
  });
});
