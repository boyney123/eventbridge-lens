import { ExtensionContext } from "vscode";
import * as vscode from "vscode";

import { View as EventBridgeView } from "./views/eventbridge/view";

export function activate(context: ExtensionContext) {
  // EventBridge View in the SideBar
  const eventBridgeView = new EventBridgeView();
  // register service commands onto view
  eventBridgeView.registerCommands(context);

  // Register the dataprovider
  vscode.window.registerTreeDataProvider("eventbridge", eventBridgeView);

}
