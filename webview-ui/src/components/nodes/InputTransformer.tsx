import { Rule, Target } from "@aws-sdk/client-eventbridge";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { CustomTarget } from "../../pages/visualize-rule";

import ServiceIcons from "../../icons";
import { CloudIcon } from "@heroicons/react/24/outline";
import NodeHeader from "./NodeHeader";
import { useExtension } from "../../hooks/ExtensionProvider";

import { Prism as PrismSyntaxHighlighter } from "react-syntax-highlighter";
import codeStyle from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";

export default ({ data }: { data: CustomTarget }) => {
  // @ts-ignore
  const Icon = ServiceIcons["inputTransform"];
  const { postMessage } = useExtension();

  function openResourceInAWSConsole(arn?: string): void {
    postMessage("vscode:open-aws-console-from-arn", {
      Arn: arn,
    });
  }

  const menuOptions = [
    {
      icon: CloudIcon,
      label: "Open in AWS Console",
      onClick: () => openResourceInAWSConsole(data.Arn),
    },
  ];

  return (
    <div className="flex " style={{ width: "400px" }}>
      <div className="flex items-center bg-blue-600  w-10 shadow-lg  rounded-l-lg">
        <span className="block transform -rotate-90 -mb-14 uppercase text-white w-full font-bold tracking-widest text-xs">
          Input Transformer
        </span>
      </div>
      <div className="border border-gray-400 bg-white w-full rounded-r-lg shadow-lg">
        <NodeHeader header={"Input Transformer"} Icon={Icon} menuOptions={menuOptions} />

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 pr-4">
              <span className="font-bold text-md">Transforming event</span>
              <span className="block text-xs text-gray-400">
                This Input transform will take the event and transform it before reaching the
                downstream target. The input template and path are used to construct the new
                payload.
              </span>
            </div>
          </div>
        </dl>

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 pr-4">
              <span className="font-bold text-md">Input Path</span>
              <span className="block text-xs text-gray-400">
                Event is customized before reaching the target. 
              </span>
              <dd className="mt-1 text-sm leading-6 text-gray-800 sm:mt-2 bg-gray-100 text-xs px-2 ">
              {JSON.stringify(data.InputTransformer?.InputPathsMap, null, 4)}
              </dd>
            </div>
          </div>
        </dl>

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 pr-4">
              <span className="font-bold text-md">Input Template</span>
              <span className="block text-xs text-gray-400">
                This Input Template will pass this information to the target.
              </span>
              <dd className="mt-1 text-sm leading-6 text-gray-800 sm:mt-2 bg-gray-100 text-xs px-2 ">
                {data.InputTransformer?.InputTemplate}
              </dd>
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
