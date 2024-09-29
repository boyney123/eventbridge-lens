// vscode.js

const languages = {
  createDiagnosticCollection: jest.fn(),
};

const StatusBarAlignment = {};

const window = {
  createStatusBarItem: jest.fn(() => ({
    show: jest.fn(),
  })),
  showErrorMessage: jest.fn(),
  showInformationMessage: jest.fn(),
  withProgress: jest.fn(),
  showWarningMessage: jest.fn(),
  createTextEditorDecorationType: jest.fn(),
  createWebviewPanel: jest.fn(() => ({
    onDidDispose: jest.fn(),
    asWebviewUri: jest.fn(),
    _panel: {
      test: true
    }
  }))
};

const workspace = {
  getConfiguration: jest.fn(() => ({
    get: () => {}
  })),
  workspaceFolders: [],
  onDidSaveTextDocument: jest.fn(),
};

const OverviewRulerLane = {
  Left: null,
};

const Uri = {
  file: (f) => f,
  parse: jest.fn(),
};
const Range = jest.fn();
const Diagnostic = jest.fn();
const DiagnosticSeverity = { Error: 0, Warning: 1, Information: 2, Hint: 3 };

const debug = {
  onDidTerminateDebugSession: jest.fn(),
  startDebugging: jest.fn(),
};

const commands = {
  executeCommand: jest.fn(),
  registerCommand: jest.fn()
};

const env = {
  clipboard: {
    writeText: jest.fn()
  },
  openExternal: jest.fn()
};


class TreeItem {}
class EventEmitter {}

// exports.workspace = {
//   test: true
// };

const vscode = {
  languages,
  StatusBarAlignment,
  window,
  workspace,
  OverviewRulerLane,
  Uri,
  Range,
  Diagnostic,
  DiagnosticSeverity,
  debug,
  commands,
  env,
  ProgressLocation: {
    Notification: 15
  },
  ViewColumn: {
    One: 15
  },
  Uri: {
    joinPath: jest.fn()
  },
  TreeItem,
  EventEmitter
};

module.exports = vscode;
