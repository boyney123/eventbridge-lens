import { ExtensionContext, commands } from "vscode";

export default ({ view }: { context: ExtensionContext; view: any }) =>
  commands.registerCommand("explorer:eventbridge:refresh-view", async () => {
    view.refresh();
  });
