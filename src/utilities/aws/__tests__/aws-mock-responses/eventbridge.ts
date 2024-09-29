 import { DescribeArchiveResponse, DescribeEventBusResponse, ListArchivesResponse, ListEventBusesCommandOutput } from "@aws-sdk/client-eventbridge";

const EventBuses = {
  EventBuses: [
    {
      Name: "Test",
    },
  ],
};

const ListTargetsByRuleCommand = {
  Targets: [
    {
      Arn: "arn:aws:lambda:us-west-2:123456789:function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
      DeadLetterConfig: { Arn: "arn:aws:sqs:us-west-2:123456789:my-queue-without-pipes" },
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
};

const ListRulesCommand = {
  NextToken: null,
  Rules: [
    {
      Arn: "arn:aws:events:us-west-2:123456789:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
      CreatedBy: "123456789",
      Description: "Listen to StoryGenerated events",
      EventBusName: "ai-stories",
      EventPattern: '{"detail-type":["StoryGenerated"],"source":["ai.stories"]}',
      Name: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
      State: "ENABLED",
    },
  ],
};

const ListArchivesCommand = {
  Archives: [
    {
      ArchiveName: "MyArchive",
      
      EventCount: 0,
    },
  ],
} as ListArchivesResponse;

const DescribeArchiveCommand = {
  ArchiveArn: "archive:arn",
  ArchiveName: "My Archive",
} as DescribeArchiveResponse;

const DescribeEventBusCommand = {
  Name: 'MyBus',
  Arn: 'fake-arn'
} as DescribeEventBusResponse;

const ListEventBusesCommand = {
  EventBuses: EventBuses.EventBuses
} as ListEventBusesCommandOutput;

export default {
  EventBuses,
  ListTargetsByRuleCommand,
  ListArchivesCommand,
  ListRulesCommand,
  DescribeEventBusCommand,
  DescribeArchiveCommand,
  ListEventBusesCommand
};
