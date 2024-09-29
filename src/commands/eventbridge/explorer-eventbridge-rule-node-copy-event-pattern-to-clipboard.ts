import { Rule } from "@aws-sdk/client-eventbridge";
import { commands } from "vscode";
import * as vscode from "vscode";

export default () =>
  commands.registerCommand(
    "explorer:eventbridge:rule-node:copy-event-pattern-to-clipboard",
    async ({ rule }: { rule: Rule }) => {
      if (!rule || !rule.EventPattern) {
        vscode.window.showErrorMessage(
          "Failed to copy EventPattern to clipboard, no pattern found"
        );
        return;
      }

      try {
        await vscode.env.clipboard.writeText(rule.EventPattern);
        vscode.window.showInformationMessage("Copied EventPattern to clipboard!");
      } catch (err) {
        vscode.window.showErrorMessage("Failed to copy EventPattern to clipboard");
      }
    }
  );
