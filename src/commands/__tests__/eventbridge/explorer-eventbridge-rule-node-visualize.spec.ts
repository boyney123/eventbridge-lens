import command from "../../eventbridge/explorer-eventbridge-rule-node-visualize";
import * as vscode from "vscode";

import * as EventBridgeMockResponses from "../../../utilities/aws/__tests__/aws-mock-responses/eventbridge";

const getTargetsForRuleMock = jest.fn(
  () => EventBridgeMockResponses.default.ListTargetsByRuleCommand.Targets
);
const renderMock = jest.fn();

jest.mock("../../../utilities/aws/eventbridge", () => ({
  // @ts-ignore
  getTargetsForRule: (...args: any) => getTargetsForRuleMock(...args),
}));

jest.mock("../../../panels/WebAppPanel", () => ({
  WebAppPanel: {
    render: (...args: any) => renderMock(...args),
  },
}));

describe("vscode command explorer-eventbridge-rule-node-visualize", () => {
  it("when no eventBusName is given to the command, an error message is shown", async () => {
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;

    command({ context: {}, view: null } as any);

    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({});

    expect(registerCommandMock.mock.calls[0][0]).toEqual(
      "explorer:eventbridge:rule-node:visualize"
    );
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      "Failed to get targets for Rules, missing Event Bus information"
    );
  });

  it("when calling the command with an eventbus, loader is shown and requests are made to get rules and targets and the view is loaded", async () => {
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;

    command({ context: {}, view: null } as any);
    const rule = { EventBusName: "TestBus", Name: "MyRule" };

    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ rule });

    expect(registerCommandMock.mock.calls[0][0]).toEqual(
      "explorer:eventbridge:rule-node:visualize"
    );
    expect(getTargetsForRuleMock).toHaveBeenCalledWith(rule, "TestBus");

    expect(renderMock).toHaveBeenCalled();
    expect(renderMock.mock.calls[0][1]).toEqual({
      route: "/view-rule",
      pageData: {
        Targets: [
          {
            Arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
            DeadLetterConfig: {
              Arn: "arn:aws:sqs:us-west-2:123456789:my-queue-without-pipes",
            },
            Id: "Target0",
            Resource: "function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
            Service: "lambda",
          },
          {
            Arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
            DeadLetterConfig: {
              Arn: "arn:aws:sqs:us-west-2:123456789:ddb-to-eventbridge-PipeDLQueue-7XoAB7OT9aCQ",
            },
            Id: "Target1",
            Resource: "function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
            Service: "lambda",
          },
        ],
        Rule: {
          EventBusName: "TestBus",
          Name: "MyRule",
        },
      },
    });
    expect(renderMock.mock.calls[0][2]).toEqual("MyRule - Visualization");
  });
});
