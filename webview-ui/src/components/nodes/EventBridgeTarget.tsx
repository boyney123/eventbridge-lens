import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { CustomTarget } from "../../pages/visualize-rule";

import {
  CloudIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";

import ServiceIcons from "../../icons";
import { useExtension } from "../../hooks/ExtensionProvider";
import NodeHeader from "./NodeHeader";
import { parse } from "@aws-sdk/util-arn-parser";

export const serviceByArn = (arn: string) => {
  const { service, resource } = parse(arn);

  switch (service) {
    case "logs":
      return {
        long: "Amazon CloudWatch Logs",
        short: "CloudWatch Logs",
      };
    case "states":
      return {
        long: "AWS Step Functions",
        short: "Step Functions",
      };
    case "execute-api":
      return {
        long: "Amazon API Gateway",
        short: "API Gateway",
      };
    case "lambda":
      return {
        long: "AWS Lambda",
        short: "Lambda",
      };
    case "sqs":
      return {
        long: "Amazon SQS",
        short: "SQS",
      };
    case "sns":
      return {
        long: "Amazon SNS",
        short: "SNS",
      };
    case "events":
      return {
        long: "Amazon EventBridge",
        short: "EventBridge",
      };
    default:
      return {
        long: `${service}-${resource}`,
        short: resource,
      };
  }
};

export default ({ data }: { data: CustomTarget }) => {

  const { postMessage } = useExtension();
  const { resource } = parse(data.Arn || "");

  const openResourceInAWSConsole = (arn?: string) => {
    postMessage("vscode:open-aws-console-from-arn", {
      Arn: arn,
    });
  };

  const menuOptions = [
    {
      icon: CloudIcon,
      label: "Open in AWS Console",
      onClick: () => openResourceInAWSConsole(data.Arn),
    },
  ];

  // @ts-ignore
  const Icon = ServiceIcons[data.Service] || null;

  const title = serviceByArn(data.Arn || "");

  return (
    <div className="flex " style={{ width: "500px" }}>
      <div className="flex items-center bg-orange-500  w-10 shadow-lg  rounded-l-lg">
        <span className="block transform -rotate-90  uppercase text-white w-full font-bold tracking-widest text-sm mt-4">
          TARGET
        </span>
      </div>
      <div className="border border-gray-400 bg-white w-full shadow-lg rounded-r-lg">
        <NodeHeader
          header={title.short}
          subheader={resource}
          Icon={Icon}
          menuOptions={menuOptions}
        />

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">
              <span className="font-bold text-md">Dead-letter configuration</span>
              {data.DeadLetterConfig && (
                <span className="block pr-10 text-xs text-gray-400">
                  Dead-letter configuration has been setup on this target. Events that fail to be
                  sent to the target will be send to this DLQ configuration once retry policy is
                  complete.
                </span>
              )}
              {!data.DeadLetterConfig && (
                <span className="block pr-10 text-xs text-gray-400">
                  No dead-letter (DLQ) configuration found on the target. This means if your target
                  does not receive your events and your retry policy is complete,{" "}
                  <span className="font-bold underline">your events will be dropped.</span>
                </span>
              )}
            </dt>
            <div>
              {data.DeadLetterConfig ? (
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              ) : (
                <XCircleIcon className="h-8 w-8 text-red-500 opacity-25" />
              )}
            </div>
          </div>
        </dl>

        {data.InputTransformer && (
          <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">
                <span className="font-bold text-md">Event Transformation</span>
                <span className="block pr-10 text-xs text-gray-400">
                  Events to this target are transformed using an InputTransformer. This means the structure of the event will be different from  when it was
                  produced.
                </span>
              </dt>
              <div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </dl>
        )}

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">
              <span className="font-bold text-md">Custom retry policy</span>
              {data.RetryPolicy && (
                <span className="block pr-10 text-xs text-gray-400">
                  A custom retry policy has been configured on this target. There will be{" "}
                  {data.RetryPolicy.MaximumRetryAttempts} maximum retry attempts for this target and{" "}
                  {data.RetryPolicy.MaximumEventAgeInSeconds}. The maximum amount of time to
                  continue making retrys is {data.RetryPolicy.MaximumEventAgeInSeconds} seconds.
                </span>
              )}
              {!data.RetryPolicy && (
                <span className="block pr-10 text-xs text-gray-400">
                  No custom retry policy has been configured on this target. EventBridge defaults
                  will be applied.
                </span>
              )}
            </dt>
            <div>
              {data.RetryPolicy ? (
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              ) : (
                <XCircleIcon className="h-8 w-8 text-red-500 opacity-25" />
              )}
            </div>
          </div>
        </dl>

        <Handle type="target" position={Position.Left} />

        <Handle type="source" position={Position.Right} id="a" />
        {/* <Handle type="source" position={Position.Left} id="b" style={handleStyle} /> */}
      </div>
    </div>
  );
};
