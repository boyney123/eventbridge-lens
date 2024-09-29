import { Rule } from "@aws-sdk/client-eventbridge";
import { ExtensionContext, commands } from "vscode";
import * as vscode from "vscode";

import { WebAppPanel } from "../../panels/WebAppPanel";
import { getTargetsForRule } from "../../utilities/aws/eventbridge";

/**
 * Command will get targets and rules for a given EventBus, then will render them out in the web view
 */
export default ({ context }: { context: ExtensionContext; view: any }) =>
  commands.registerCommand(
    "explorer:eventbridge:rule-node:visualize",
    async ({ rule }: { rule: Rule }) => {
      if (!rule || !rule.EventBusName) {
        // Failed to get it.
        vscode.window.showErrorMessage(
          "Failed to get targets for Rules, missing Event Bus information"
        );
        return;
      }

      const targets = await getTargetsForRule(rule, rule.EventBusName);

      const state = {
        route: "/view-rule",
        pageData: {
          Targets: targets,
          Rule: rule,
        },
      };

      WebAppPanel.render(context.extensionUri, state, `${rule.Name} - Visualization`);
    }
  );
