import { useMemo } from "react";

import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";
import { useViewData } from "../hooks/ExtensionProvider";
import { Archive, EventBus } from "@aws-sdk/client-eventbridge";

import EventBridgeRuleNode from "../components/nodes/EventBridgeRule";
import EventBridgeTargetNode from "../components/nodes/EventBridgeTarget";
import InputTransformerNode from "../components/nodes/InputTransformer";
import DLQNode from "../components/nodes/DeadLetterQueue";
import EventBridgeArchiveNode from "../components/nodes/EventBridgeArchive";

import EventBusNode from "../components/nodes/EventBus";
import {
  buildEdgeForArchive,
  buildEdgeForRule,
  buildEdgesForTargets,
  buildNodeForEventBus,
  buildNodesForArchives,
  buildNodesForRules,
  buildNodesForTargets,
} from "../utils/flow-utils";
import Key from "../components/react-flow/Key";
import Debugger from "../components/react-flow/Debugger";
import AutoLayout from "../components/react-flow/AutoLayout";
import { CustomTarget, Rule } from "../types";

interface ViewData {
  Rules: Rule[];
  EventBusName: string;
  EventBus: EventBus;
  Archives?: Archive[];
}

const buildNodes = (data: ViewData) => {
  const ruleNodes = buildNodesForRules(data.Rules);
  let archiveNodes = [];

  const targetNodes = data.Rules.reduce((acc, rule) => {
    const nodes = buildNodesForTargets(rule.Targets);
    return acc.concat(nodes as any);
  }, []);

  let nodes = [...ruleNodes, ...targetNodes];

  if (data.Archives && data.Archives.length > 0) {
    archiveNodes = buildNodesForArchives(data.EventBus, data.Archives);
    //@ts-ignore
    nodes = nodes.concat(archiveNodes);
  }

  return nodes;
};

const buildEdgeNodes = (data: ViewData) => {
  const rulesAndTargetsEdges = data.Rules.reduce((acc: any, rule: Rule) => {
    const ruleEdge = buildEdgeForRule(rule);
    const targetEdges = buildEdgesForTargets(rule, rule.Targets);
    return [...acc, ruleEdge, ...targetEdges];
  }, []);

  if (data.Archives) {
    const archiveEdges = data.Archives.map((archive) =>
      buildEdgeForArchive(data.EventBus, archive)
    );
    return [...rulesAndTargetsEdges, ...archiveEdges];
  }

  return [...rulesAndTargetsEdges];
};

function EventBridgeBusView() {
  const data = useViewData() as ViewData;

  if (!data) return null;

  const busNode = buildNodeForEventBus(data.EventBusName, {
    Rules: data.Rules,
    EventBus: data.EventBus,
    Archives: data.Archives,
  });

  // Filter out any targets or rules managed by AWS for the view.
  data.Rules = data.Rules.filter((rule) => !rule.ManagedBy?.includes("aws"));
  data.Rules = data.Rules.map((rule) => {
    return {
      ...rule,
      Targets: rule.Targets.filter((target: CustomTarget) => !target.ManagedBy?.includes("aws")),
    };
  });

  // // Nodes and edges
  const initialNodes = buildNodes(data).concat([busNode]);
  const initialEdges = buildEdgeNodes(data);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      "rule": EventBridgeRuleNode,
      "target": EventBridgeTargetNode,
      "input-transformer": InputTransformerNode,
      "dead-letter-queue": DLQNode,
      "event-bus": EventBusNode,
      "archive": EventBridgeArchiveNode,
    }),
    []
  );

  return (
    <div className="h-screen bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        maxZoom={1}
        minZoom={0.5}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Key />
        <Controls />
        <AutoLayout />
        <Debugger />
      </ReactFlow>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <EventBridgeBusView />
  </ReactFlowProvider>
);
