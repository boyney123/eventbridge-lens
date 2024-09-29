import React, { useEffect } from "react";
import { useNodes, useReactFlow, useStore } from "reactflow";
import { calculateNodesForDynamicLayout } from "../../utils/node-calculator";

const AutoLayout = () => {
  const { fitView } = useReactFlow();
  const nodes = useNodes();
  const setNodes = useStore((state) => state.setNodes);

  useEffect(() => {
    if (nodes.length === 0 || !nodes[0].width) {
      return;
    }

    const nodesWithOrginalPosition = nodes.filter(
      (node) => node.position.x === 0 && node.position.y === 0
    );
    if (nodesWithOrginalPosition.length > 1) {
      const calculatedNodes = calculateNodesForDynamicLayout(nodes);
      setNodes(calculatedNodes);
      fitView();
    }
  }, [nodes]);

  return null;
};

export default AutoLayout;
