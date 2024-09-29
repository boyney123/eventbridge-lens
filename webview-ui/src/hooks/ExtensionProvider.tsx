import React, { useContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vscode } from "../utilities/vscode";

interface ApplicationState {
  route: string;
}

// const defaultConfig = {
//   route: "/view-rule",
//   pageData: {
//     Targets: [
//       {
//         Arn: "arn:aws:lambda:us-west-2:123456789012:function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
//         DeadLetterConfig: { Arn: "arn:aws:sqs:us-west-2:123456789012:my-queue-without-pipes" },
//         Id: "Target0",
//         Resource: "function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm",
//         Service: "lambda",
//       },
//       {
//         Arn: "arn:aws:lambda:us-west-2:123456789012:function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
//         DeadLetterConfig: {
//           Arn: "arn:aws:sqs:us-west-2:123456789012:ddb-to-eventbridge-PipeDLQueue-7XoAB7OT9aCQ",
//         },
//         Id: "Target1",
//         Resource: "function:stg-aiStoriesBackend-generateaudioforstory6E53D091-DFTPaE9sA6pD",
//         Service: "lambda",
//       },
//       {
//         Arn: "arn:aws:sns:us-west-2:123456789012:AiStory-story-generated",
//         DeadLetterConfig: {
//           Arn: "arn:aws:sqs:us-west-2:123456789012:sqs-to-sfn-express-SourceQueue-9JmTCoek1yiC",
//         },
//         Id: "Target2",
//         InputTransformer: {
//           InputPathsMap: { "detail-id": "$.detail.id" },
//           InputTemplate:
//             '"New Story created: https://gw4eb2mqpe.us-west-2.awsapprunner.com/story?id=<detail-id>"',
//         },
//         Resource: "AiStory-story-generated",
//         Service: "sns",
//       },
//     ],
//     Rule: {
//       $metadata: {
//         httpStatusCode: 200,
//         requestId: "f66bf75f-147d-43b4-9976-8a222bef167d",
//         attempts: 1,
//         totalRetryDelay: 0,
//       },
//       Arn: "arn:aws:events:us-west-2:123456789012:rule/ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
//       CreatedBy: "123456789012",
//       Description: "Listen to StoryGenerated events",
//       EventBusName: "ai-stories",
//       EventPattern: '{"detail-type":["StoryGenerated"],"source":["ai.stories"]}',
//       Name: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-1NL25FIAGMZT",
//       State: "ENABLED",
//     },
//   },
// };

const defaultConfig = {
  route: "/view-bus",
  pageData: {
    Rules: [
      {
        Arn: "arn:aws:events:us-west-2:123456789123:rule/stg-aiStoriesBackend-ai-stories/stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-11W9VIB71FEGR",
        Description: "Listen to StoryGenerated events",
        EventBusName: "stg-aiStoriesBackend-ai-stories",
        EventPattern: '{"detail-type":["StoryGenerated"],"source":["ai.stories"]}',
        Name: "stg-aiStoriesBackend-StoryGeneratedRuleFD0256AE-11W9VIB71FEGR",
        State: "ENABLED",
        Targets: [
          {
            Arn: "arn:aws:lambda:us-west-2:123456789123:function:stg-aiStoriesBackend-generateimagesforstory2010A29-X07TDW9tGZB5",
            Id: "Target0",
            Resource: "function:stg-aiStoriesBackend-generateimagesforstory2010A29-X07TDW9tGZB5",
            Service: "lambda",
          },
          {
            Arn: "arn:aws:lambda:us-west-2:123456789123:function:stg-aiStoriesBackend-generateaudioforstory6E53D091-ZmaWXQiJgKxp",
            Id: "Target1",
            Resource: "function:stg-aiStoriesBackend-generateaudioforstory6E53D091-ZmaWXQiJgKxp",
            Service: "lambda",
          },
          {
            Arn: "arn:aws:sns:us-west-2:123456789123:AiStory-story-generated",
            Id: "Target2",
            InputTransformer: {
              InputPathsMap: { "detail-id": "$.detail.id" },
              InputTemplate:
                '"New Story created: https://tekyjytkda.us-west-2.awsapprunner.com/story?id=<detail-id>"',
            },
            Resource: "AiStory-story-generated",
            Service: "sns",
          },
        ],
      },
    ],
    EventBusName: "stg-aiStoriesBackend-ai-stories",
    EventBus: {
      $metadata: {
        httpStatusCode: 200,
        requestId: "ea43c634-5119-45f8-94ff-9404adb8b1d1",
        attempts: 1,
        totalRetryDelay: 0,
      },
      Arn: "arn:aws:events:us-west-2:123456789123:event-bus/stg-aiStoriesBackend-ai-stories",
      Name: "stg-aiStoriesBackend-ai-stories",
    },
    Archives: [],
  },
};

export const Context = React.createContext<ApplicationState>(defaultConfig);

export function ExtentionContextProvider({ children }: { children: ReactNode }): JSX.Element {
  //@ts-ignore
  const [state, setState] = useState(window.initialData || defaultConfig);
  const navigate = useNavigate();

  useEffect(() => {
    // Load the correct route.

    navigate(state.route);

    const handleExtensionMessages = (event: any) => {
      const {
        data: { action, data },
      } = event;

      if (action === "state-changed") {
        setState(data);
      }
    };

    window.addEventListener("message", handleExtensionMessages);
  }, []);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export const useExtensionData = () => useContext<any>(Context);

export const useViewData = () => {
  const { pageData } = useExtensionData();
  return {
    ...pageData,
  } as any;
};

export const useExtension = () => {
  return {
    postMessage: (command: string, data?: any) => {
      vscode.postMessage({
        command,
        data,
      });
    },
  };
};
