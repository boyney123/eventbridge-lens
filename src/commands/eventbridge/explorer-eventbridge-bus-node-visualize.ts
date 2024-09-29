import { Archive } from "@aws-sdk/client-eventbridge";
import { ExtensionContext, commands } from "vscode";
import * as vscode from "vscode";

import { WebAppPanel } from "../../panels/WebAppPanel";
import {
  describeArchive,
  describeEventBus,
  getArchivesForEventBus,
  getRulesForEventBus,
  getTargetsForRule,
} from "../../utilities/aws/eventbridge";

/**
 * Command will get targets and rules for a given EventBus, then will render them out in the web view
 */
export default ({ context }: { context: ExtensionContext; view: any }) =>
  commands.registerCommand(
    "explorer:eventbridge:bus-node:visualize",
    async ({ eventBusName }: { eventBusName: string }) => {
      if (!eventBusName) {
        // Failed to get it.
        vscode.window.showErrorMessage("Missing event bus name to visualize");
        return;
      }

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Visualizing ${eventBusName}, fetching data...`,
          cancellable: false,
        },
        async (progress) => {
          const eventBus = await describeEventBus(eventBusName);
          progress.report({ increment: 25 });

          const rulesForBus = await getRulesForEventBus(eventBusName);
          progress.report({ increment: 50 });

          const rules = rulesForBus.map(async (rule) => {
            const targetsForRule = await getTargetsForRule(rule, eventBusName);
            return {
              ...rule,
              Targets: targetsForRule,
            };
          });

          progress.report({ increment: 75 });

          const rulesWithTargets = await Promise.all(rules);

          // Get the archives for the event bus
          let archivesForBus = [] as undefined | Archive[];

          try {
            
            if (eventBus.Arn) {
              archivesForBus = await getArchivesForEventBus(eventBus.Arn);

              const archives = archivesForBus.map((archive) => {
                return describeArchive(archive.ArchiveName || "");
              });

              archivesForBus = await Promise.all(archives);
            }
          } catch (error) {
            console.log('Failed to get archives', error);
          }

          const state = {
            route: "/view-bus",
            pageData: {
              Rules: rulesWithTargets,
              EventBusName: eventBusName,
              EventBus: eventBus,
              Archives: archivesForBus,
            },
          };

          progress.report({ increment: 100 });

          WebAppPanel.render(context.extensionUri, state, `${eventBusName} - Visualization`);
        }
      );
    }
  );
