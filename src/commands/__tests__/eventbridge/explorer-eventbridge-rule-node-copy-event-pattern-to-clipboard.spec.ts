import command from "../../eventbridge/explorer-eventbridge-rule-node-copy-event-pattern-to-clipboard";
import * as vscode from "vscode";

describe("vscode command explorer:aws:copy-arn-to-clipboard", () => {
  it("if no EventPattern is found on the rule an error is shown", async () => {
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;

    command();

    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ arn: "fake-arn" });

    expect(registerCommandMock.mock.calls[0][0]).toEqual(
      "explorer:eventbridge:rule-node:copy-event-pattern-to-clipboard"
    );
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      "Failed to copy EventPattern to clipboard, no pattern found"
    );
  });

  it("when command is executed and rule has an event pattern it is copied to the clipboard", async () => {
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;

    command();

    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ rule: { EventPattern: "mock-event-pattern" } });

    expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith('mock-event-pattern');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Copied EventPattern to clipboard!');

  });
});
