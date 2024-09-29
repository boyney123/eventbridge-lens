import command from "../../eventbridge/explorer-eventbridge-bus-node-visualize";
import * as vscode from "vscode";

import * as EventBridgeMockResponses from "../../../utilities/aws/__tests__/aws-mock-responses/eventbridge";

const describeEventBusMock = jest.fn(() => ({ Arn: "test-arn" }));
const getRulesForEventBusMock = jest.fn(
  () => EventBridgeMockResponses.default.ListRulesCommand.Rules
);
const getTargetsForRuleMock = jest.fn(
  () => EventBridgeMockResponses.default.ListTargetsByRuleCommand.Targets
);
const getArchivesForEventBusMock = jest.fn(() => []);
const renderMock = jest.fn();

jest.mock("../../../utilities/aws/eventbridge", () => ({
  // @ts-ignore
  describeEventBus: (...args: any) => describeEventBusMock(...args),
  // @ts-ignore
  getRulesForEventBus: (...args: any) => getRulesForEventBusMock(...args),

  // @ts-ignore
  getTargetsForRule: (...args: any) => getTargetsForRuleMock(...args),
  // @ts-ignore
  getArchivesForEventBus: (...args: any) => getArchivesForEventBusMock(...args),
}));

jest.mock("../../../panels/WebAppPanel", () => ({
  WebAppPanel: {
    render: (...args: any) => renderMock(...args),
  },
}));

describe("vscode command explorer-eventbridge-bus-node-visualize", () => {
  it("when no eventBusName is given to the command, an error message is shown", async () => {
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;

    command({ context: {}, view: null } as any);

    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({});

    expect(registerCommandMock.mock.calls[0][0]).toEqual("explorer:eventbridge:bus-node:visualize");
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      "Missing event bus name to visualize"
    );
  });

  it("when calling the command with an eventbus, loader is shown and requests are made to get rules and targets and the view is loaded", async () => {
    const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
    const withProgressMock = vscode.window.withProgress as jest.Mock;

    command({ context: {}, view: null } as any);

    const executeCommand = registerCommandMock.mock.calls[0][1];

    // Call the command
    await executeCommand({ eventBusName: "MyBus" });

    const progressFunction = withProgressMock.mock.calls[0][1];
    await progressFunction({ report: jest.fn() });

    expect(registerCommandMock.mock.calls[0][0]).toEqual("explorer:eventbridge:bus-node:visualize");
    expect(withProgressMock.mock.calls[0][0].title).toEqual("Visualizing MyBus, fetching data...");

    expect(describeEventBusMock).toHaveBeenCalledWith("MyBus");
    expect(getRulesForEventBusMock).toHaveBeenCalledWith("MyBus");
    expect(getRulesForEventBusMock).toHaveBeenCalled();
    expect(getArchivesForEventBusMock).toHaveBeenCalledWith("test-arn");

    // Check render function and state
    expect(renderMock).toHaveBeenCalled();
    expect(renderMock.mock.calls[0][1]).toEqual({
      route: "/view-bus",
      pageData: {
        Rules: [
          {
            Arn: "arn:aws:events:us-west-2:123456789:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
            CreatedBy: "123456789",
            Description: "Listen to StoryGenerated events",
            EventBusName: "ai-stories",
            EventPattern: '{"detail-type":["StoryGenerated"],"source":["ai.stories"]}',
            Name: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
            State: "ENABLED",
            Targets: [
              {
                Arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
                DeadLetterConfig: {
                  Arn: "arn:aws:sqs:us-west-2:123456789:my-queue-without-pipes",
                },
                Id: "Target0",
                Resource:
                  "function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
                Service: "lambda",
              },
              {
                Arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
                DeadLetterConfig: {
                  Arn: "arn:aws:sqs:us-west-2:123456789:ddb-to-eventbridge-PipeDLQueue-7XoAB7OT9aCQ",
                },
                Id: "Target1",
                Resource:
                  "function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
                Service: "lambda",
              },
            ],
          },
        ],
        EventBusName: "MyBus",
        EventBus: {
          Arn: "test-arn",
        },
        Archives: [],
      },
    });
    expect(renderMock.mock.calls[0][2]).toEqual("MyBus - Visualization");
  });
});
