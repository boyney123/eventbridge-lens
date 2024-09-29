import { Archive, DescribeArchiveResponse } from "@aws-sdk/client-eventbridge";
import { Handle, Position } from "reactflow";

import { CheckCircleIcon, CloudIcon } from "@heroicons/react/20/solid";
import { useExtension } from "../../hooks/ExtensionProvider";

import { Prism as PrismSyntaxHighlighter } from "react-syntax-highlighter";
import codeStyle from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";

import NodeHeader from "./NodeHeader";
import ServiceIcons from "../../icons";

export default ({ data }: { data: DescribeArchiveResponse }) => {
  const Icon = ServiceIcons.archive;

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
      onClick: () => openResourceInAWSConsole(data.ArchiveArn),
    }
  ];

  const bytesToKB = (bytes: number): number => {
    return bytes / 1024;
  };

  return (
    <div className="flex " style={{ width: "400px" }}>
      <div className="flex items-center bg-green-500 w-10 shadow-lg  rounded-l-lg ">
        <span className="block transform -rotate-90  mt-8 uppercase text-white w-full font-bold tracking-widest text-sm">
          Archive
        </span>
      </div>
      <div className="border border-gray-400 bg-white w-full shadow-lg rounded-r-lg">
        <NodeHeader
          header="EventBridge Archive"
          subheader={`Name: ${data.ArchiveName}`}
          Icon={Icon}
          menuOptions={menuOptions}
        />

        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">
              <span className="font-bold text-md">Events</span>
              <span className="block pr-10 text-xs text-gray-400">
                The number of events in the archive
              </span>
            </dt>
            <span className="text-gray-500 text-lg px-2 font-bold">{data.EventCount}</span>
          </div>
        </dl>
        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">
              <span className="font-bold text-md">Retention period</span>
              <span className="block pr-10 text-xs text-gray-400">
                The number of days the events will be stored in the archive before they are deleted.
              </span>
            </dt>
            <span className="text-gray-500 text-lg px-2 font-bold">
              {data.RetentionDays === 0 ? (
                <span className="italic text-ms">Indefinite</span>
              ) : (
                data.RetentionDays
              )}
            </span>
          </div>
        </dl>

        {data.SizeBytes !== undefined && (
          <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">
                <span className="font-bold text-md">Size</span>
                <span className="block pr-10 text-xs text-gray-400">The size of this archive.</span>
              </dt>
              <span className="text-gray-500 text-lg px-2 font-bold">
                {bytesToKB(data.SizeBytes).toFixed(1)}kb
              </span>
            </div>
          </dl>
        )}

        {data.EventPattern && (
          <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">
                <span className="font-bold text-md">Event Pattern</span>
                <span className="block pr-10 text-xs text-gray-400">
                  Only events that match this pattern will get added to this archive.
                </span>
              </dt>
              <div className="text-gray-400 text-xs">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
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
        )}

        <Handle type="target" position={Position.Left} />

        <Handle type="source" position={Position.Right} id="a" />
      </div>
    </div>
  );
};
