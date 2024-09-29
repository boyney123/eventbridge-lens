import command from "../explorer-aws-open-in-console";
import * as vscode from "vscode";

describe("vscode command explorer-aws-open-in-console", () => {
  it("takes the arn from the node and opens the URL", async () => {
    
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
    
    command();
    
    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ arn: "arn:aws:logs:us-west-2:1234567891234:log-group:/aws/apprunner/myapp/test/application" });

    expect(registerCommandMock.mock.calls[0][0]).toEqual("explorer:aws:open-in-console");
    expect(vscode.env.openExternal).toHaveBeenCalledWith('https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:log-groups/log-group/%2Faws%2Fapprunner%2Fmyapp%2Ftest%2Fapplication');

  });

  it("takes the arn from the node and shows an error when the AWS resource is not supported", async () => {
    
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
    
    command();
    
    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ arn: "arn:aws:iam::1234567891234:user/RandomArnNotSupported" });

    expect(registerCommandMock.mock.calls[0][0]).toEqual("explorer:aws:open-in-console");
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Cannot open the resource in the AWS console. Failed to build URL for resource');

  });

  it("when command is executed and no ARN can be found, an error is shown in vscode", async () => {

    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
    
    command();
    
    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ arn: undefined });

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to open resource in AWS console, no ARN found');

  });
});
