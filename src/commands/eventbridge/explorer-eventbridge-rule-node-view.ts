import { commands } from "vscode";
import * as vscode from "vscode";
import { Rule } from "@aws-sdk/client-eventbridge";

let currentDocument: any;

/**
 * View will take the given Rule and create a new VSCode window showing the rule as a text file.
 */
export default () =>
  commands.registerCommand(
    "explorer:eventbridge:rule-node:view",
    async ({ rule }: { rule: Rule }) => {
      if (!rule.EventBusName || !rule.Name) {
        await vscode.window.showErrorMessage("Failed to view Rule, missing Name or EventBus Name");
        return;
      }

      if (!currentDocument) {
        currentDocument = await vscode.workspace.openTextDocument({
          language: "text",
          content: "",
        });
      }

      const ruleDoc = `Rule: ${rule.Name}
Description: ${rule.Description || ""}
ARN: ${rule.Arn}
State: ${rule.State}
EventBus: ${rule.EventBusName}

----------------------------

Event Pattern:

${JSON.stringify(JSON.parse(rule.EventPattern as any), null, 4)}
    
    `;

      let editor = await vscode.window.showTextDocument(currentDocument, {
        preview: true,
      });

      // insert your text
      editor.edit((editBuilder) => {
        // Create a range that covers the entire document
        let entireRange = new vscode.Range(
          new vscode.Position(0, 0), // Start of the document
          new vscode.Position(5000, 100000)
        );

        // Delete the entire content of the document
        editBuilder.delete(entireRange);

        editBuilder.insert(new vscode.Position(0, 0), ruleDoc);
      });
    }
  );
