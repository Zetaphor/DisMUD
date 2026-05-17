import { describe, it, expect, vi } from "vitest";

vi.mock("./util/logger", () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

vi.mock("./commands", () => {
  const handler = vi.fn();
  return {
    commands: { look: handler, move: handler },
    commandWords: ["look", "move"],
    commandAliases: { n: handler },
    aliasWords: ["n"],
    adminCommands: { goto: handler },
    adminCommandWords: ["goto"],
  };
});

vi.mock("./messages/system", () => ({
  default: { unknownCommand: vi.fn() },
}));

import parseCommand from "./parseCommand";
import { commands, adminCommands, commandAliases } from "./commands";
import systemMessages from "./messages/system";

describe("parseCommand", () => {
  const mockWorldState = {} as any;

  function makeUserData(admin = false) {
    return { admin, user: { send: vi.fn() } } as any;
  }

  it("routes to a known command", () => {
    const userData = makeUserData();
    parseCommand(mockWorldState, userData, "look");
    expect(commands["look"]).toHaveBeenCalledWith(mockWorldState, userData, ["look"]);
  });

  it("strips filler words from command", () => {
    const userData = makeUserData();
    parseCommand(mockWorldState, userData, "look at the thing");
    expect(commands["look"]).toHaveBeenCalledWith(mockWorldState, userData, ["thing"]);
  });

  it("routes aliases correctly", () => {
    const userData = makeUserData();
    parseCommand(mockWorldState, userData, "n");
    expect(commandAliases["n"]).toHaveBeenCalledWith(mockWorldState, userData, ["n"]);
  });

  it("routes admin commands for admin users", () => {
    const userData = makeUserData(true);
    parseCommand(mockWorldState, userData, "goto 100");
    expect(adminCommands["goto"]).toHaveBeenCalledWith(mockWorldState, userData, ["100"]);
  });

  it("shows unknown command for invalid input", () => {
    const userData = makeUserData();
    parseCommand(mockWorldState, userData, "xyzzy");
    expect(systemMessages.unknownCommand).toHaveBeenCalledWith(userData.user, "xyzzy");
  });
});
