import { parse } from "@aws-sdk/util-arn-parser";

export const getURLFromArn = (arn: string) => {
  const { service, resource, region, accountId } = parse(arn);

  const baseURL = `https://${region}.console.aws.amazon.com`;

  switch (service) {
    // Cloudwatch
    case "logs":
      const logGroup = resource.replace("log-group:", "");
      const encodedLogGroup = encodeURIComponent(logGroup);
      return `${baseURL}/cloudwatch/home?region=${region}#logsV2:log-groups/log-group/${encodedLogGroup}`;
    case "execute-api": 
      const parts = resource.split('/');
      const id = parts[0];
      const stage = parts[1];
      return `${baseURL}/apigateway/home?region=${region}#/apis/${id}/stages/${stage}`;
    case "schemas": 
      return `${baseURL}/events/home?region=${region}#/schemas?registry=discovered-schemas`;
    case "events":
      const isRule = resource.includes("rule/");
      const isEventBus = resource.includes("event-bus/");
      const isAPIDestination = resource.includes("api-destination/");
      const isArchive = resource.includes("archive/") || !isRule && !isEventBus && !isAPIDestination && resource.includes("archive");


      if (isRule) {
        const ruleParts = resource.split("/");

        if (ruleParts.length === 3) {
          const eventBus = ruleParts[1];
          const rule = ruleParts[2];
          return `${baseURL}/events/home?region=${region}#/eventbus/${eventBus}/rules/${rule}`;
        } else {
          //  Rules on the default event bus do not return bus in the arn
          // assume its the default event bus.
          const rule = ruleParts[1];
          return `${baseURL}/events/home?region=${region}#/eventbus/default/rules/${rule}`;
        }
      }

      if(isEventBus) {
        const busParts = resource.split("/");
        const eventBusName = busParts[1];
        return `${baseURL}/events/home?region=${region}#/eventbus/${eventBusName}`;
      }

      if(isAPIDestination) {
        const parts = resource.split("/");
        const apiDestinationName = parts[1];
        return `${baseURL}/events/home?region=${region}#/apidestinations/${apiDestinationName}`;
      }

      if(isArchive){
        const parts = resource.split("/");
        const archiveName = parts[1];
        return `${baseURL}/events/home?region=${region}#/archive/${archiveName}`;
      }

      return null;

    case "lambda":
      const functionName = resource.replace("function:", "");
      return `${baseURL}/lambda/home?region=${region}#/functions/${functionName}`;

    case "states":
      return `${baseURL}/states/home?region=${region}#/statemachines/view/${arn}`;
    case "sqs":
      const encodeRoute = encodeURIComponent(
        `https://sqs.${region}.amazonaws.com/${accountId}/${resource}`
      );
      return `${baseURL}/sqs/v2/home?region=${region}#/queues/${encodeRoute}`;
    case "sns":
      return `${baseURL}/sns/v3/home?region=${region}#/topic/${arn}`;
    default:
      return null;
  }
};

// console.log(getURLFromArn('arn:aws:events:us-west-2:670852811695:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT'));
