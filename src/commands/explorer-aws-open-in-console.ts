import { commands } from "vscode";
import * as vscode from "vscode";
import { getURLFromArn } from "../utilities/aws/url-generator";

interface AWSNode extends vscode.TreeItem {
  arn: string;
}

export default () =>
  commands.registerCommand(
    "explorer:aws:open-in-console",

    async (node: AWSNode) => {
      if (node.arn) {
        const url = getURLFromArn(node.arn);

        if (!url) {
          vscode.window.showErrorMessage(
            "Cannot open the resource in the AWS console. Failed to build URL for resource"
          );
          return;
        }

        vscode.env.openExternal(url as any);
      } else {
        vscode.window.showErrorMessage("Failed to open resource in AWS console, no ARN found");
      }
    }
  );
