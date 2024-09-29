import { useMemo } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  Controls,
} from "reactflow";

import { useViewData } from "../hooks/ExtensionProvider";
import { Rule, Target } from "@aws-sdk/client-eventbridge";

import EventBridgeRuleNode from "../components/nodes/EventBridgeRule";
import EventBridgeTargetNode from "../components/nodes/EventBridgeTarget";
import InputTransformerNode from "../components/nodes/InputTransformer";
import DLQNode from "../components/nodes/DeadLetterQueue";
import { buildEdgesForTargets, buildNodesForRules, buildNodesForTargets } from "../utils/flow-utils";
import Key from "../components/react-flow/Key";
import Debugger from "../components/react-flow/Debugger";
import AutoLayout from "../components/react-flow/AutoLayout";

// // Types for the data for the page....
export interface CustomTarget extends Target {
  Service: string;
  Resource: string;
}

interface ViewData {
  Rule: Rule;
  Targets: CustomTarget[];
}

const buildNodes = (data: ViewData) => {
  return [...buildNodesForRules([data.Rule]), ...buildNodesForTargets(data.Targets)];
};

const buildEdgeNodes = (data: ViewData) => {
  return buildEdgesForTargets(data.Rule, data.Targets);
};


export default () => {

  // Nodes and edges
  const data = useViewData() as ViewData;
  const initialNodes = buildNodes(data);
  const initialEdges = buildEdgeNodes(data);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      "rule": EventBridgeRuleNode,
      "target": EventBridgeTargetNode,
      "input-transformer": InputTransformerNode,
      "dead-letter-queue": DLQNode
    }),
    []
  );

  return (
    <div className="h-screen bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Key />
        <Debugger />
        <AutoLayout />
        <Controls />
      </ReactFlow>
    </div>
  );
}

