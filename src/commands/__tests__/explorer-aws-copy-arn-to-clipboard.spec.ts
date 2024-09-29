import command from "../explorer-aws-copy-arn-to-clipboard";
import * as vscode from "vscode";

describe("vscode command explorer:aws:copy-arn-to-clipboard", () => {
  it("takes the arn from the clicked node and copies it to vscode clipboard", async () => {
    
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
    
    command();
    
    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ arn: "fake-arn" });

    expect(registerCommandMock.mock.calls[0][0]).toEqual("explorer:aws:copy-arn-to-clipboard");
    expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith('fake-arn');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Copied ARN to clipboard');

  });

  it("when command is executed and no ARN can be found, an error is shown in vscode", async () => {

    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
    
    command();
    
    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ arn: undefined });

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to copy ARN to clipboard, no ARN found');

  });
});
