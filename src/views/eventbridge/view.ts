import { ExtensionContext } from "vscode";
// import { createNewEvent } from "../../commands/test-events";
import * as vscode from "vscode";
import * as path from "path";
import {
  getArchivesForEventBus,
  getListOfEventBuses,
  getRulesForEventBus,
  getTargetsForRule,
} from "../../utilities/aws/eventbridge";

import {
  ViewRule,
  VisualizeEventBus,
  VisualizeRule,
  CopyEventPatternToClipboard,
  RefreshView,
} from "../../commands/eventbridge";

// Generic commands
import openInConsole from "../../commands/explorer-aws-open-in-console";
import copyArnToClipboard from "../../commands/explorer-aws-copy-arn-to-clipboard";

import { Rule } from "@aws-sdk/client-eventbridge";
import { WebAppPanel } from "../../panels/WebAppPanel";
import { getURLFromArn } from "../../utilities/aws/url-generator";

import awsAuthErrorNotification from "../../notifications/aws-auth-error";
import { getValueFromConfig } from "../../utilities/config";

export class Dependency extends vscode.TreeItem {
  constructor(
    public readonly item: any,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(item.label, collapsibleState);

    //this.tooltip = `${this.label}-${this.version}`;
    this.description = item.description;
    this.contextValue = item.contextValue;
    this.command = item.command;

    console.log('__filename', __filename);
    console.log('__dirname', __dirname);

    let projectDirectory = path.join(__filename, '../../../../');

    if(__filename.includes('out/extension.js')){
      projectDirectory = path.join(__filename, '../../');
    }

    if (item.icon) {
      this.iconPath = {
        light: path.join(projectDirectory, "resources", "light", `${item.icon}.svg`),
        dark: path.join(projectDirectory, "resources", "dark", `${item.icon}.svg`),
      };
    }
  }

  contextValue = "dependency";
}

// This needs to become the data provider.... and render the tree etc...

export class View implements vscode.TreeDataProvider<any> {

  _onDidChangeTreeData: vscode.EventEmitter<undefined> = new vscode.EventEmitter<undefined>();
  onDidChangeTreeData: vscode.Event<undefined> = this._onDidChangeTreeData.event;

  registerCommands(context: ExtensionContext): void {
    context.subscriptions.push(ViewRule());
    context.subscriptions.push(CopyEventPatternToClipboard());
    context.subscriptions.push(VisualizeRule({ context, view: this }));
    context.subscriptions.push(VisualizeEventBus({ context, view: this }));
    context.subscriptions.push(RefreshView({ context, view: this }));

    // AWS Commands
    context.subscriptions.push(openInConsole());
    context.subscriptions.push(copyArnToClipboard());

    // Listen to events from the view
    WebAppPanel.registerListeners("vscode:open-aws-console-from-arn", (data: any) => {
      const url = getURLFromArn(data.Arn);

      if (!url) {
        vscode.window.showErrorMessage(
          "Cannot open the resource in the AWS console. Failed to build URL for resource"
        );
        return;
      }

      vscode.env.openExternal(url as any);
    });

    // Listen to events from the view
    WebAppPanel.registerListeners("vscode:copy-to-clipboard", (data: any) => {
      vscode.env.clipboard.writeText(data);
      vscode.window.showInformationMessage('Copied value to clipboard');
    });
  }

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(item: any): vscode.TreeItem {
    return new Dependency(
      item,
      item.children.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );
  }

  async getTargetsByRule(rule: Rule, bus: string): Promise<vscode.TreeItem[]> {
    const targets = await getTargetsForRule(rule, bus);

    if (!targets) {
      return Promise.resolve([
        {
          label: "[No targets found]",
          children: [],
        },
      ]);
    }

    return targets.map((target: any) => {
      const options = {
        label: `${target.Service} - ${target.Resource || target.Arn}`,
        icon: target.Service,
        arn: target.Arn,
        target,
        contextValue: `eventbridge-target-${target.Service}`,
        children: [],
      };

      if (target.Id === "SchemaDiscovererTarget") {
        options.label = "Schema Discoverer - Enabled";
      }

      return options;
    });
  }

  async getArchivesForBus(busArn: string | undefined): Promise<vscode.TreeItem[]> {
    const region = getValueFromConfig("region");

    if (!busArn) {
      return Promise.resolve([
        {
          label: "Failed to get archives for unknown bus",
          children: [],
        },
      ]);
    }

    const archives = await getArchivesForEventBus(busArn);
    if (!archives.length) {
      return Promise.resolve([
        {
          label: "[No archives found]",
          children: [],
        },
      ]);
    }

    return archives.map((archive) => ({
      label: archive.ArchiveName,
      description: `State: ${archive.State?.toLowerCase()}, Events Count: ${archive.EventCount}`,
      tooltip: `Number of events: ${archive.EventCount}`,
      contextValue: "eventbridge-archive",
      archive,
      icon: "eventbridge-archive",
      // archive has no arn..so we make one, with a fake account
      arn: `arn:aws:events:${region}:123456789123:archive/${archive.ArchiveName}`,
      children: [],
    }));
  }

  async getRulesByEventBusName(bus: string | undefined): Promise<vscode.TreeItem[]> {
    if (!bus) {
      return Promise.resolve([
        {
          label: "[Failed to get rules for unknown bus]",
          children: [],
        },
      ]);
    }

    const rules = await getRulesForEventBus(bus);

    if (!rules.length) {
      return Promise.resolve([
        {
          label: "[No rules found]",
          children: [],
        },
      ]);
    }

    return rules.map((rule) => ({
      label: rule.Name,
      description: rule.Description,
      tooltip: rule.Description,
      contextValue: "eventbridge-rule",
      rule,
      icon: "eventbridge-rule",
      arn: rule.Arn,
      children: [
        {
          label: "Targets",
          asyncChildren: () => this.getTargetsByRule(rule, bus),
          icon: "target",
          children: [
            {
              label: "Loading Targets",
              children: [],
            },
          ],
          contextValue: {
            rule,
            id: "eventbridge-rule",
          },
        },
      ],
      command: {
        command: "explorer:eventbridge:rule-node:visualize",
        title: "View rule",
        arguments: [{ rule }],
      },
    }));
  }

  async getEventBusesForList(): Promise<any> {
    try {
      const buses = await getListOfEventBuses();

      if (!buses.length) {
        return Promise.resolve([
          {
            label: "[No event buses found]",
            children: [],
          },
        ]);
      }

      return buses?.map((bus) => ({
        label: bus.Name,
        arn: bus.Arn,
        icon: "eventbridge2",
        contextValue: "eventbridge-bus",
        eventBusName: bus.Name,
        command: {
          command: "explorer:eventbridge:bus-node:visualize",
          arguments: [{ eventBusName: bus.Name }],
        },
        children: [
          {
            label: "Rules",
            icon: "eventbridge-rule",
            asyncChildren: () => this.getRulesByEventBusName(bus.Name),
            children: [
              {
                label: "Loading Rules...",
              },
            ],
            contextValue: {
              bus,
              id: "eventbridge-rules-list",
            },
          },
          {
            label: "Archives",
            icon: "eventbridge-archive",
            asyncChildren: () => this.getArchivesForBus(bus.Arn),
            children: [
              {
                label: "Loading Archives...",
              },
            ],
            contextValue: {
              bus,
              id: "eventbridge-archives-list",
            },
          },
        ],
      }));
    } catch (error) {
      // Failed to kick things off, show auth error
      await awsAuthErrorNotification();

      return [
        {
          label: "[Failed to connected to AWS]",
          children: [],
        },
      ];
    }

    // this.refresh();
  }

  //@ts-ignore
  async getChildren(element?: any): Thenable<[]> {
    // Should we fetch async data?
    if (element?.asyncChildren) {
      return element.asyncChildren.call(this);
    }

    if (element) {
      return Promise.resolve(element.children);
    } else {
      // Initial load of data for the view....
      return Promise.resolve([
        {
          label: "Event Buses",
          children: [
            {
              label: "Loading event buses...",
            },
          ],
          asyncChildren: this.getEventBusesForList,
          emptyMessage: "[No Event Buses]",
        },
      ] as any);
    }
  }
}
