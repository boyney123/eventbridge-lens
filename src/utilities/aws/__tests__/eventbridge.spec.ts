import {
  DescribeArchiveCommand,
  DescribeEventBusCommand,
  ListArchivesCommand,
  ListEventBusesCommand,
  ListRulesCommand,
  ListTargetsByRuleCommand,
} from "@aws-sdk/client-eventbridge";
import {
  describeArchive,
  describeEventBus,
  getArchivesForEventBus,
  getListOfEventBuses,
  getRulesForEventBus,
  getTargetsForRule,
} from "../eventbridge";

// const vscode = require("../../../../__mocks__/vscode");

import eventBridgeMocks from "./aws-mock-responses/eventbridge";

const listEventBusesCommandMock = jest.fn((arg: any) => eventBridgeMocks.EventBuses);
const listTargetsByRuleCommandMock = jest.fn( (arg: any) => eventBridgeMocks.ListTargetsByRuleCommand);
const listArchivesCommandMock = jest.fn((arg: any) => eventBridgeMocks.ListArchivesCommand);
const listRulesCommandMock = jest.fn((arg: any) => eventBridgeMocks.ListRulesCommand);
const describeArchiveCommandMock = jest.fn((arg: any) => eventBridgeMocks.DescribeArchiveCommand);
const describeEventBusMock = jest.fn((arg: any) => eventBridgeMocks.DescribeEventBusCommand);

const mockSend = jest.fn((arg: any) => {
  if (arg instanceof ListEventBusesCommand) {
    return listEventBusesCommandMock(arg.input);
  }

  if (arg instanceof ListArchivesCommand) {
    return listArchivesCommandMock(arg.input);
  }

  if (arg instanceof ListTargetsByRuleCommand) {
    return listTargetsByRuleCommandMock(arg.input);
  }

  if (arg instanceof ListRulesCommand) {
    return listRulesCommandMock(arg.input);
  }

  if (arg instanceof DescribeEventBusCommand) {
    return describeEventBusMock(arg.input);
  }

  if (arg instanceof DescribeArchiveCommand) {
    return describeArchiveCommandMock(arg.input);
  }

  return null;
});

jest.mock("@aws-sdk/client-eventbridge", () => ({
  ...jest.requireActual("@aws-sdk/client-eventbridge"),
  EventBridge: jest.fn(() => ({
    send: mockSend,
  })),
}));

describe("eventbridge", () => {
  describe("getListOfEventBuses", () => {
    it("returns a list of event buses", async () => {
      const results = await getListOfEventBuses();
      expect(results).toEqual([{ Name: "Test" }]);
      expect(listEventBusesCommandMock).toHaveBeenCalled();
    });
  });

  describe("describeArchive", () => {
    it("takes an EventBridge Archive name and returns details about that archive", async () => {
      const results = await describeArchive("My-Archive");
      expect(results).toEqual({
        ArchiveArn: "archive:arn",
        ArchiveName: "My Archive",
      });
      expect(describeArchiveCommandMock).toHaveBeenCalledWith({
        ArchiveName: "My-Archive",
      });
    });
  });
  describe("describeEventBus", () => {
    it("takes an EventBridge bus name and returns information about that bus", async () => {
      const result = await describeEventBus("My-Bus");
      expect(result).toEqual({
        Name: "MyBus",
        Arn: "fake-arn",
      });
      expect(describeEventBusMock).toHaveBeenCalledWith({
        Name: "My-Bus",
      });
    });
  });

  describe("getArchivesForEventBus", () => {
    it("takes an EventBridge bus ARN and returns all the archives for that bus", async () => {
      const results = await getArchivesForEventBus("fake-bus-arn");

      expect(results).toEqual([
        {
          ArchiveName: "MyArchive",
          EventCount: 0,
        },
      ]);
      expect(listArchivesCommandMock).toHaveBeenCalledWith({
        EventSourceArn: "fake-bus-arn",
        NextToken: null,
      });
    });
  });

  describe("getTargetsForRule", () => {
    it("returns a list of EventBridge targets for a given rule", async () => {
      const results = await getTargetsForRule({ Name: "Rule" }, "MyEventBus");

      expect(results).toEqual([
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
      ]);
      //   expect(listEventBusesCommandMock).toHaveBeenCalled();
    });
  });
  describe("getRulesForEventBus", () => {
    it("returns a list of rules for a given event bus", async () => {
      const results = await getRulesForEventBus("MyEventBus");

      expect(results).toEqual([
        {
          Arn: "arn:aws:events:us-west-2:123456789:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
          CreatedBy: "123456789",
          Description: "Listen to StoryGenerated events",
          EventBusName: "ai-stories",
          EventPattern: '{"detail-type":["StoryGenerated"],"source":["ai.stories"]}',
          Name: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
          State: "ENABLED",
        },
      ]);
      //   expect(listEventBusesCommandMock).toHaveBeenCalled();
    });
  });
});
