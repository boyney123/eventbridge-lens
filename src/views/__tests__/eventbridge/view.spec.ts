import { View } from "../../eventbridge/view";

import * as EventBridgeMockResponses from "../../../utilities/aws/__tests__/aws-mock-responses/eventbridge";

const describeEventBusMock = jest.fn(() => ({ Arn: "test-arn" }));
const getRulesForEventBusMock = jest.fn(
  () => EventBridgeMockResponses.default.ListRulesCommand.Rules
);
const getTargetsForRuleMock = jest.fn(
  () => EventBridgeMockResponses.default.ListTargetsByRuleCommand.Targets
);

const getArchivesForEventBusMock = jest.fn(
  () => EventBridgeMockResponses.default.ListArchivesCommand.Archives
);

const getListOfEventBusesMock = jest.fn(
  () => EventBridgeMockResponses.default.ListEventBusesCommand.EventBuses
);

jest.mock("../../../utilities/aws/eventbridge", () => ({
  // @ts-ignore
  describeEventBus: (...args: any) => describeEventBusMock(...args),
  // @ts-ignore
  getRulesForEventBus: (...args: any) => getRulesForEventBusMock(...args),
  // @ts-ignore
  getListOfEventBuses: (...args: any) => getListOfEventBusesMock(...args),
  // @ts-ignore
  getTargetsForRule: (...args: any) => getTargetsForRuleMock(...args),
  // @ts-ignore
  getArchivesForEventBus: (...args: any) => getArchivesForEventBusMock(...args),
}));

const viewRuleMock = jest.fn();
const visualizeEventBusMock = jest.fn();
const visualizeRuleMock = jest.fn();
const copyEventPatternToClipboardMock = jest.fn();
const refreshViewMock = jest.fn();

jest.mock("../../../commands/eventbridge", () => ({
  // @ts-ignore
  ViewRule: () => viewRuleMock,
  VisualizeEventBus: () => visualizeEventBusMock,
  VisualizeRule: () => visualizeRuleMock,
  CopyEventPatternToClipboard: () => copyEventPatternToClipboardMock,
  RefreshView: () => refreshViewMock,
}));

const extentionContextMock = {
  subscriptions: [],
};

describe("eventbridge view", () => {
  beforeEach(() => {
    extentionContextMock.subscriptions = [];
  });

  describe("registerCommands", () => {
    it("registers expected eventbridge commands to the view", async () => {
      const view = new View();
      const context = {
        subscriptions: {
          push: jest.fn(),
        },
      };
      
      await view.registerCommands(context as any);


      expect(context.subscriptions.push).toHaveBeenCalledWith(viewRuleMock);
      expect(context.subscriptions.push).toHaveBeenCalledWith(copyEventPatternToClipboardMock);
      expect(context.subscriptions.push).toHaveBeenCalledWith(visualizeEventBusMock);
      expect(context.subscriptions.push).toHaveBeenCalledWith(visualizeRuleMock);
      expect(context.subscriptions.push).toHaveBeenCalledWith(refreshViewMock);

      expect(context.subscriptions.push).toHaveBeenCalledTimes(7);

    });
  });

  describe("getTargetsByRule", () => {
    it("makes a request to get targets for a given rule and maps the targets into nodes for navigation", async () => {
      const view = new View();
      const result = await view.getTargetsByRule({}, "MyBus");

      expect(result).toEqual([
        {
          label:
            "lambda - function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
          icon: "lambda",
          arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
          target: {
            Arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
            DeadLetterConfig: {
              Arn: "arn:aws:sqs:us-west-2:123456789:my-queue-without-pipes",
            },
            Id: "Target0",
            Resource: "function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
            Service: "lambda",
          },
          contextValue: "eventbridge-target-lambda",
          children: [],
        },
        {
          label:
            "lambda - function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
          icon: "lambda",
          arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
          target: {
            Arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
            DeadLetterConfig: {
              Arn: "arn:aws:sqs:us-west-2:123456789:ddb-to-eventbridge-PipeDLQueue-7XoAB7OT9aCQ",
            },
            Id: "Target1",
            Resource: "function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
            Service: "lambda",
          },
          contextValue: "eventbridge-target-lambda",
          children: [],
        },
      ]);
    });

    it("When no targets are found for the given rule, and empty node is returned for the vscode navigation", async () => {
      // @ts-ignore
      getTargetsForRuleMock.mockImplementationOnce(() => undefined);

      const view = new View();
      const result = await view.getTargetsByRule({}, "MyBus");

      expect(result).toEqual([{ label: "[No targets found]", children: [] }]);
    });
  });

  describe("getArchivesForBus", () => {
    it("makes a request to get archives for a given event bus and maps the results into nodes for navigation", async () => {
      const view = new View();
      const result = await view.getArchivesForBus("my-bus-arn");

      expect(result).toEqual([
        {
          label: "MyArchive",
          description: "State: undefined, Events Count: 0",
          tooltip: "Number of events: 0",
          contextValue: "eventbridge-archive",
          archive: { ArchiveName: "MyArchive", EventCount: 0 },
          icon: "eventbridge-archive",
          arn: "arn:aws:events:undefined:123456789123:archive/MyArchive",
          children: [],
        },
      ]);
    });
    it("When no archives are found for the given bus, and empty node is returned for the vscode navigation", async () => {
      // @ts-ignore
      getArchivesForEventBusMock.mockImplementationOnce(() => []);

      const view = new View();
      const result = await view.getArchivesForBus("my-bus-arn");

      expect(result).toEqual([{ label: "[No archives found]", children: [] }]);
    });
    it("When no bus is given an empty node is returned for the vscode navigation", async () => {
      // @ts-ignore
      getArchivesForEventBusMock.mockImplementationOnce(() => []);

      const view = new View();
      const result = await view.getArchivesForBus(undefined);

      expect(result).toEqual([{ label: "Failed to get archives for unknown bus", children: [] }]);
    });
  });

  describe("getRulesByEventBusName", () => {
    it("makes a request to get rules for a given bus and maps the targets into nodes for navigation", async () => {
      const view = new View();
      const result = await view.getRulesByEventBusName("MyBus");

      expect(result).toEqual([
        {
          label: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
          description: "Listen to StoryGenerated events",
          tooltip: "Listen to StoryGenerated events",
          contextValue: "eventbridge-rule",
          rule: {
            Arn: "arn:aws:events:us-west-2:123456789:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
            CreatedBy: "123456789",
            Description: "Listen to StoryGenerated events",
            EventBusName: "ai-stories",
            EventPattern: '{"detail-type":["StoryGenerated"],"source":["ai.stories"]}',
            Name: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
            State: "ENABLED",
          },
          icon: "eventbridge-rule",
          arn: "arn:aws:events:us-west-2:123456789:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
          children: [
            {
              label: "Targets",
              asyncChildren: expect.anything(),
              icon: "target",
              children: [
                {
                  label: "Loading Targets",
                  children: [],
                },
              ],
              contextValue: {
                rule: {
                  Arn: "arn:aws:events:us-west-2:123456789:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
                  CreatedBy: "123456789",
                  Description: "Listen to StoryGenerated events",
                  EventBusName: "ai-stories",
                  EventPattern: '{"detail-type":["StoryGenerated"],"source":["ai.stories"]}',
                  Name: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
                  State: "ENABLED",
                },
                id: "eventbridge-rule",
              },
            },
          ],
          command: {
            command: "explorer:eventbridge:rule-node:visualize",
            title: "View rule",
            arguments: [
              {
                rule: {
                  Arn: "arn:aws:events:us-west-2:123456789:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
                  CreatedBy: "123456789",
                  Description: "Listen to StoryGenerated events",
                  EventBusName: "ai-stories",
                  EventPattern: '{"detail-type":["StoryGenerated"],"source":["ai.stories"]}',
                  Name: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
                  State: "ENABLED",
                },
              },
            ],
          },
        },
      ]);
    });

    it("makes a request to get rules, if no rules are found a no rules found node is returned", async () => {
      getRulesForEventBusMock.mockImplementationOnce(() => []);

      const view = new View();
      const result = await view.getRulesByEventBusName("MyBus");

      expect(result).toEqual([{ label: "[No rules found]", children: [] }]);
    });

    it("When no bus is given to the funcation and empty node is returned for the vscode navigation", async () => {
      // @ts-ignore
      getTargetsForRuleMock.mockImplementationOnce(() => undefined);

      const view = new View();
      const result = await view.getRulesByEventBusName(undefined);

      expect(result).toEqual([{ label: "[Failed to get rules for unknown bus]", children: [] }]);
    });
  });

  describe("getEventBusesForList", () => {
    it("makes a request to a list of event buses maps the targets into nodes for navigation", async () => {
      const view = new View();
      const result = await view.getEventBusesForList();

      expect(result).toEqual([
        {
          label: "Test",
          icon: "eventbridge2",
          contextValue: "eventbridge-bus",
          eventBusName: "Test",
          command: {
            command: "explorer:eventbridge:bus-node:visualize",
            arguments: [
              {
                eventBusName: "Test",
              },
            ],
          },
          children: [
            {
              label: "Rules",
              icon: "eventbridge-rule",
              asyncChildren: expect.anything(),
              children: [
                {
                  label: "Loading Rules...",
                },
              ],
              contextValue: {
                bus: {
                  Name: "Test",
                },
                id: "eventbridge-rules-list",
              },
            },
            {
              label: "Archives",
              asyncChildren: expect.anything(),
              icon: "eventbridge-archive",
              children: [
                {
                  label: "Loading Archives...",
                },
              ],
              contextValue: {
                bus: {
                  Name: "Test",
                },
                id: "eventbridge-archives-list",
              },
            },
          ],
        },
      ]);
    });

    it("makes a request to list event buses, if no buses are found an empty node is returned", async () => {
      getListOfEventBusesMock.mockImplementationOnce(() => []);

      const view = new View();
      const result = await view.getEventBusesForList();
      expect(result).toEqual([{ label: "[No event buses found]", children: [] }]);
    });
  });
});
