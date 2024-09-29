import * as vscode from "vscode";
import * as path from "path";

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

    if (item.icon) {
      this.iconPath = {
        light: path.join(__filename, "..", "..", "resources", "light", `${item.icon}.svg`),
        dark: path.join(__filename, "..", "..", "resources", "dark", `${item.icon}.svg`),
      };
    }
  }

  contextValue = "dependency";
}

// This needs to become the data provider.... and render the tree etc...

export class View implements vscode.TreeDataProvider<any> {
  private eventbuses: any;

  constructor() {
    // super();
  }

  registerCommands(): void {
    console.log("register commands for eventbridge");
  }

  getTreeItem(item: any): vscode.TreeItem {
    return new Dependency(
      item,
      item.children.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );
  }

  //@ts-ignore
  async getChildren(element?: any): Thenable<[]> {
    if (element) {
      return Promise.resolve(element.children);
    } else {
      return Promise.resolve([
        {
          label: "Coming soon...",
          children: [],
        },
      ]) as any;
    }
  }
}
