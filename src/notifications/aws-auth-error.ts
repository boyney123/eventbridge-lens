import * as vscode from "vscode";
import * as os from 'os';

export default async () => {

  const selectedOption = await vscode.window.showInformationMessage(
    `Failed to connect to AWS either missing or invalid credentials`,
    { title: "Setup credentials" },
    { title: "Configure credentials path" }
  );

  if (selectedOption?.title === "Setup credentials") {

    const config = vscode.workspace.getConfiguration("eventbridgelens");
    const credentialsPath = (config.get("credentialsPath") as string);

    const resolvedPath = credentialsPath.replace('~', os.homedir());


    // Open the file...
    const uri = vscode.Uri.file(resolvedPath);
    const document = await vscode.workspace.openTextDocument(uri);
    vscode.window.showTextDocument(document);

  }
  if (selectedOption?.title === "Configure credentials path") {
    await vscode.commands.executeCommand('workbench.action.openSettings', 'eventbridgelens.credentialsPath');
  }
};
