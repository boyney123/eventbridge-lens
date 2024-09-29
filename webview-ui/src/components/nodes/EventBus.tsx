import { Archive, EventBus, Rule, RuleState, Target } from "@aws-sdk/client-eventbridge";
import { Handle, Position, useStore } from "reactflow";

import ServiceIcons from "../../icons";

import { CheckCircleIcon, CloudIcon, ArchiveBoxIcon, XCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import NodeHeader from "./NodeHeader";


import { useExtension } from "../../hooks/ExtensionProvider";
import { parse } from "@aws-sdk/util-arn-parser";

interface CustomRule extends Rule {
  Targets?: Target[];
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default ({ data }: { data: { EventBusName: string; Rules: CustomRule[], Archives: Archive[], EventBus: EventBus } }) => {
  const Icon = ServiceIcons.eventbridge;

  const { postMessage } = useExtension();
  const { accountId, region } = parse(data.EventBus.Arn || '')

  const hasSchemaDiscoveryEnabled = data.Rules.some((rule) => {
    const isRuleEnabled = rule.State === RuleState.ENABLED;
    return rule.Targets?.some((target) => {
      return isRuleEnabled && target.Id === "SchemaDiscovererTarget";
    });
  });

  const isArchiveEnabled = data.Rules.some(
    (rule) =>
      rule.ManagedBy === "prod.vhs.events.aws.internal" &&
      rule.Name?.includes("Events-Archive") &&
      rule.State === RuleState.ENABLED
  );

  function openResourceInAWSConsole(arn: string): void {
    postMessage("vscode:open-aws-console-from-arn", {
      Arn: arn
    });
  }

 

  const menuOptions = [
    { 
      icon: MagnifyingGlassIcon,
      label: 'Open Schema Discovery',
      onClick: () => openResourceInAWSConsole(`arn:aws:schemas:${region}:::`)
    },
    { 
      icon: ArchiveBoxIcon,
      label: 'Open Event Archive',
      onClick: () => openResourceInAWSConsole(`arn:aws:events:${region}:${accountId}:archive`)
    },
    { 
      icon: CloudIcon,
      label: 'Open in AWS Console',
      onClick: () => openResourceInAWSConsole(data.EventBus.Arn || '')
    },
  ]



  return (
    <div className="flex " style={{ width: "500px" }}>
      <div className="flex items-center bg-gray-600 w-10 rounded-l-lg ">
        <span className="block transform -rotate-90 mt-10  uppercase text-white w-full font-bold tracking-widest text-sm py-20">
          EventBus
        </span>
      </div>
      <div className="border border-gray-400 bg-white w-full shadow-lg rounded-r-lg">
        <NodeHeader header={data.EventBusName} Icon={Icon} menuOptions={menuOptions} />
        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">
              <span className="font-bold text-md">Rules</span>
              <span className="block pr-10 text-xs text-gray-400">
                This event bus has {data.Rules.length} rules. Use EventBridge rules to route events
                to various targets (consumers).
              </span>
            </dt>
            <span className="text-gray-500 text-lg px-2 font-bold">{data.Rules.length}</span>
          </div>
        </dl>
        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 pr-4">
              <span className="font-bold text-md">Schema Discovery</span>
              <span className="block text-xs text-gray-400">
                {hasSchemaDiscoveryEnabled && (
                  <span>
                    Schema discovery is enabled for this event bus. This means as events go through
                    your event bus their schemas will be captured and can be used to validate, raise
                    events and create code bindings.
                  </span>
                )}

                {!hasSchemaDiscoveryEnabled && (
                  <span>
                    Schema discovery is not enabled for this event bus. Schema discovery can be used
                    to automate the process of finding schemas as events go through your bus.
                  </span>
                )}
              </span>
            </div>
            <div>
              {hasSchemaDiscoveryEnabled ? (
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              ) : (
                <XCircleIcon className="h-8 w-8 text-red-500 opacity-25" />
              )}
            </div>
          </div>
        </dl>
        <dl className="space-y-6 border-t border-gray-200 py-6 font-medium text-gray-900 lg:block px-2 ">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 pr-10">
              <span className="font-bold text-md">Event Archive</span>
              <span className="block text-xs text-gray-400">
                {isArchiveEnabled && (
                  <span>
                    One or more archives are enabled on this event bus. That means events are being
                    collected into an archive which you replay at a future date.
                  </span>
                )}

                {!isArchiveEnabled && (
                  <span>
                    This event bus does not have any archives enabled. You can use archives to
                    collect events as they are published onto the event bus, and replay them at a
                    future date.
                  </span>
                )}
              </span>
            </div>
            <div>
              {isArchiveEnabled ? (
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              ) : (
                <XCircleIcon className="h-8 w-8 text-red-500 opacity-25" />
              )}
            </div>
          </div>
        </dl>

        <Handle type="target" position={Position.Left} />

        <Handle type="source" position={Position.Right} id="a" />
      </div>
    </div>
  );
};
