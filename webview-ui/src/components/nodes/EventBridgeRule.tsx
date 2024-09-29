import { Rule, RuleState, Target } from "@aws-sdk/client-eventbridge";
import { Handle, Position } from "reactflow";

import { Prism as PrismSyntaxHighlighter } from "react-syntax-highlighter";
import codeStyle from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";
import {
  CloudIcon,
} from "@heroicons/react/20/solid";
import { useExtension } from "../../hooks/ExtensionProvider";

import NodeHeader from "./NodeHeader";
import ServiceIcons from "../../icons";

interface CustomRule extends Rule {
  Targets: Target[];
}

export default ({ data }: { data: CustomRule }) => {
  const Icon = ServiceIcons.eventbridgeRule;

  const { postMessage } = useExtension();

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

  data.Targets = data.Targets || [];

  return (
    <div className="flex " style={{ width: "400px" }}>
      <div className="flex items-center bg-pink-500 w-10 shadow-lg  rounded-l-lg ">
        <span className="block transform -rotate-90  uppercase text-white w-full font-bold tracking-widest text-sm">
          RULE
        </span>
      </div>
      <div className="border border-gray-400 bg-white w-full shadow-lg rounded-r-lg">
        <NodeHeader header={data.Name || ""} Icon={Icon} menuOptions={menuOptions} />

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">
              <span className="font-bold text-md">Number of consumers</span>
              <span className="block pr-10 text-xs text-gray-400">
                This rule has {data.Targets.length} consumers (targets).
              </span>
            </dt>
            <span className="text-gray-500 text-lg px-2 font-bold">{data.Targets.length}</span>
          </div>
        </dl>

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">
              <span className="font-bold text-md">Event Pattern</span>
              <span className="block pr-10 text-xs text-gray-400">
                Events will match this pattern to reach consumers/targets.
              </span>
            </dt>
            <div className="text-gray-400 text-xs">
              {data.State === RuleState.ENABLED ? (
                <span className="text-green-700">enabled</span>
              ) : (
                <span className="text-red-700">disabled</span>
              )}
            </div>
          </div>
          <span className="block border border-gray-300 text-xs my-2">
            <PrismSyntaxHighlighter
              style={codeStyle}
              language="json"
              wrapLines
              className="max-h-96 overflow-auto">
              {JSON.stringify(JSON.parse(data.EventPattern as any), null, 4)}
            </PrismSyntaxHighlighter>
          </span>
        </dl>

        <Handle type="target" position={Position.Left} />

        <Handle type="source" position={Position.Right} id="a" />
      </div>
    </div>
  );
};
