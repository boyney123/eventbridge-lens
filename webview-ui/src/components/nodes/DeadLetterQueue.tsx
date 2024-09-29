import { Rule, Target } from "@aws-sdk/client-eventbridge";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { CustomTarget } from "../../pages/visualize-rule";

import ServiceIcons from "../../icons";
import { useExtension } from "../../hooks/ExtensionProvider";
import { CloudIcon } from "@heroicons/react/24/outline";
import NodeHeader from "./NodeHeader";

export default ({ data }: { data: CustomTarget }) => {
  // @ts-ignore
  const Icon = ServiceIcons["sqs"];

  const { postMessage } = useExtension();

  const openResourceInAWSConsole = (arn?: string) => {
    postMessage("vscode:open-aws-console-from-arn", {
      Arn: arn,
    });
  };

  // TODO: DLQ can be SNS....

  const menuOptions = [
    {
      icon: CloudIcon,
      label: "Open in AWS Console",
      onClick: () => openResourceInAWSConsole(data.Arn),
    },
  ];

  return (
    <div className="flex " style={{ width: "400px" }}>
      <div className="flex items-center border-l border-red-500 bg-red-600  w-10 shadow-lg  rounded-l-lg  ">
        <span className="block transform -rotate-90  uppercase text-white w-full font-bold tracking-widest text-xs">
          DLQ
        </span>
      </div>
      <div className="border border-gray-500 bg-white w-full shadow-lg rounded-r-lg">
        <NodeHeader
          header={"SQS"}
          subheader={data.DeadLetterConfig?.Arn}
          Icon={Icon}
          menuOptions={menuOptions}
        />

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">
              <span className="font-bold text-md">Dead-letter-queue</span>
              <span className="block pr-10 text-xs text-gray-400">
                The target has dead-letter configuration enabled. This means any failed events to this target will go to 
                this dead-letter queue.
              </span>
            </dt>
            <div className="text-gray-400 text-xs">
              <span className="text-green-700">enabled</span>
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
