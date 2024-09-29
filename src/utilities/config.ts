import * as vscode from "vscode";

export const getValueFromConfig = (value: string) => {
    const config = vscode.workspace.getConfiguration("eventbridgelens");
    return config.get(value);
};
