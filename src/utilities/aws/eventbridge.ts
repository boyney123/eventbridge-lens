import {
  EventBridge,
  ListEventBusesCommand,
  ListRulesCommand,
  Rule,
  ListTargetsByRuleCommand,
  Target,
  Archive,
  ListArchivesCommand,
  EventBus,
  DescribeEventBusCommand,
  DescribeArchiveCommand,
} from "@aws-sdk/client-eventbridge";
import { getAwsCredentials, getAwsRegion } from "../../lib/getAWSCreds";
import { parse } from "@aws-sdk/util-arn-parser";

export const getListOfEventBuses = async (): Promise<EventBus[] | []> => {
  const client = new EventBridge({
    region: getAwsRegion(),
    credentials: getAwsCredentials(),
  });

  const getBuses = async (
    archives = [],
    nextToken = null as null | string
  ): Promise<EventBus[]> => {
    const response = await client.send(
      new ListEventBusesCommand({
        Limit: 50,
        // @ts-ignore
        NextToken: nextToken,
      })
    );

    if (response.NextToken) {
      return getBuses([...archives, ...(response.EventBuses as any)] as any, response.NextToken);
    } else {
      return [...archives, ...(response.EventBuses as any)];
    }
  };

  const archives = await getBuses();

  return archives;
};


export const describeArchive = async (archiveName: string): Promise<Archive> => {
  const client = new EventBridge({
    region: getAwsRegion(),
    credentials: getAwsCredentials(),
  });

  const { $metadata, ...Archive } = await client.send(
    new DescribeArchiveCommand({
      ArchiveName: archiveName,
    })
  );

  return Archive;
};

export const getTargetsForRule = async (rule: Rule, bus: string): Promise<Target[] | undefined> => {
  const client = new EventBridge({
    region: getAwsRegion(),
    credentials: getAwsCredentials(),
  });
  const { Targets = [] } = await client.send(
    new ListTargetsByRuleCommand({
      Rule: rule.Name,
      EventBusName: bus,
    })
  );

  return Targets.map((target) => {
    const { resource, service } = parse(target.Arn as any);

    return {
      ...target,
      Resource: resource,
      Service: service,
    };
  });
};

export const getArchivesForEventBus = async (busArn: string): Promise<Archive[] | []> => {
  const client = new EventBridge({
    region: getAwsRegion(),
    credentials: getAwsCredentials(),
  });

  const getArchives = async (
    arn: string,
    archives = [],
    nextToken = null as null | string
  ): Promise<Archive[]> => {
    const response = await client.send(
      new ListArchivesCommand({
        EventSourceArn: busArn,
        // @ts-ignore
        NextToken: nextToken,
      })
    );

    if (response.NextToken) {
      return getArchives(
        arn,
        [...archives, ...(response.Archives as any)] as any,
        response.NextToken
      );
    } else {
      return [...archives, ...(response.Archives as any)];
    }
  };

  const archives = await getArchives(busArn);

  return archives;
};

export const describeEventBus = async (bus: string) => {
  const client = new EventBridge({
    region: getAwsRegion(),
    credentials: getAwsCredentials(),
  });

  const eventBus = client.send(
    new DescribeEventBusCommand({
      Name: bus,
    })
  );

  return eventBus;
};

export const getRulesForEventBus = async (bus: string): Promise<Rule[] | []> => {
  const client = new EventBridge({
    region: getAwsRegion(),
    credentials: getAwsCredentials(),
  });

  const getRules = async (rules = [], nextToken = null as any): Promise<any> => {
    const response = await client.send(
      new ListRulesCommand({
        EventBusName: bus,
        // @ts-ignore
        NextToken: nextToken,
      })
    );

    // console.log(response);

    if (response.NextToken) {
      return getRules([...rules, ...(response.Rules as any)] as any, response.NextToken);
    } else {
      return [...rules, ...(response.Rules as any)];
    }
  };

  const rules = await getRules();

  return rules;
};
