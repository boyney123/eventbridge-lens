import { commands } from "vscode";
import * as vscode from "vscode";

interface AWSNode extends vscode.TreeItem {
  arn: string;
}

export default () =>
  commands.registerCommand(
    "explorer:aws:copy-arn-to-clipboard",

    async (node: AWSNode) => {
      if (node.arn) {
        await vscode.env.clipboard.writeText(node.arn);
        vscode.window.showInformationMessage("Copied ARN to clipboard");
      } else {
        vscode.window.showErrorMessage("Failed to copy ARN to clipboard, no ARN found");
      }
    }
  );
