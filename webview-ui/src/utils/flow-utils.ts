import {
  Archive,
  DescribeArchiveResponse,
  EventBus,
  Rule,
  RuleState,
  Target,
} from "@aws-sdk/client-eventbridge";
import { Edge, Node } from "reactflow";

// Types for the data for the page....
export interface CustomTarget extends Target {
  Service: string;
  Resource: string;
}

export const buildNodeForEventBus = (eventBusName: string, options: any) => {
  return {
    id: eventBusName,
    data: { label: eventBusName, EventBusName: eventBusName, columnToRenderIn: 1, ...options },
    position: { x: 0, y: 0 },
    type: "event-bus",
  };
};

export const buildNodesForRules = (rules: Rule[]) => {
  return rules.map((rule) => ({
    id: rule.Arn,
    type: "rule",
    position: { x: 0, y: 0 },
    data: { label: rule.Name, columnToRenderIn: 2, ...rule },
  }));
};

export const buildNodesForArchives = (
  eventBus: EventBus,
  archives: DescribeArchiveResponse[]
): Node[] => {
  return archives.map((archive) => ({
    id: archive.ArchiveArn || `${eventBus.Arn}:${archive.ArchiveName}`,
    type: "archive",
    data: { label: archive.ArchiveName, columnToRenderIn:2, ...archive },
    position: { x: 0, y: 0 },
  }));
};

export const buildNodesForTargets = (targets: CustomTarget[]) => {
  const targetNodes = targets.map((target) => ({
    id: target.Arn,
    type: "target",
    data: { label: target.Service, columnToRenderIn: target.InputTransformer ? 4 : 3, ...target },
    position: { x: 0, y: 0 },
  }));

  // If any target has Input Transfomers create nodes for them
  const inputTransformerNodes = targets
    .filter((target) => target.InputTransformer)
    .map((Target) => ({
      id: `InputTransform-${Target.Arn}`,
      type: "input-transformer",
      data: { label: "Input Transformer", columnToRenderIn: 3, ...Target },
      position: { x: 0, y: 0 },
    }));

  // If any targets have DLQ configured then render nodes for them.
  const dlqNodes = targets
    .filter((target) => target.DeadLetterConfig)
    .map((Target) => ({
      id: `DeadLetterQueue-${Target.Arn}`,
      type: "dead-letter-queue",
      data: { label: "DeadLetter Queue", columnToRenderIn: 5, ...Target },
      position: { x: 0, y: 0 },
    }));

  return [...targetNodes, ...inputTransformerNodes, ...dlqNodes];
};

/**
 * Edges
 */

export const buildEdgeForRule = (rule: Rule) => {
  return {
    id: `${rule.EventBusName}:${rule.Arn}`,
    source: rule.EventBusName,
    target: rule.Arn,
    type: "smoothstep",
    style: { strokeWidth: "3px" },
    animated: true,
  };
};

export const buildEdgeForArchive = (eventBus: EventBus, archive: DescribeArchiveResponse) => {
  return {
    id: `${eventBus.Name}:${archive.ArchiveArn}`,
    source: eventBus.Name,
    target: archive.ArchiveArn || `${eventBus.Arn}:${archive.ArchiveName}`,
    type: "smoothstep",
    style: { strokeWidth: "3px" },
    animated: true,
  };
};

export const buildEdgesForTargets = (rule: Rule, targets: Target[]) => {
  const targetsWithInputTransformers = targets.filter((target) => target.InputTransformer);
  const targetsWithoutInputTransformers = targets.filter((target) => !target.InputTransformer);
  const targetsWithDLQ = targets.filter((target) => target.DeadLetterConfig);

  const targetNodes = targetsWithoutInputTransformers.map((Target) => ({
    id: `${rule.Arn}:${Target.Arn}`,
    source: rule.Arn,
    target: Target.Arn,
    type: "smoothstep",
    style: { strokeWidth: "3px" },
    animated: rule.State === RuleState.ENABLED,
  }));

  const targetNodesWithTransformers = targetsWithInputTransformers.reduce((acc, Target) => {
    // Transformer to the target node node.
    acc.push({
      id: `${rule.Arn}:${Target.Arn}`,
      source: `InputTransform-${Target.Arn}`,
      target: Target.Arn,
      type: "smoothstep",
      style: { strokeWidth: "3px" },
      animated: true,
    });

    // Rule to the transformer node
    acc.push({
      id: `${rule.Arn}:InputTransform-${Target.Arn}`,
      source: rule.Arn,
      target: `InputTransform-${Target.Arn}`,
      type: "smoothstep",
      label: "Events are transformed",
      style: { strokeWidth: "3px" },
      labelStyle: { fontSize: "15px", fontStyle: "italic" },
      animated: true,
    });

    return acc;
  }, [] as any);

  const targetDLQNodes = targetsWithDLQ.map((Target) => ({
    id: `${Target.Arn}-DeadLetterQueue-${Target.Arn}`,
    source: Target.Arn,
    target: `DeadLetterQueue-${Target.Arn}`,
    type: "smoothstep",
    labelStyle: { fontSize: "15px", fontStyle: "italic" },
    style: { stroke: "red", strokeWidth: "3px", strokeOpacity: "0.2" },
    animated: false,
  }));

  return [...targetNodes, ...targetNodesWithTransformers, ...targetDLQNodes];
};
