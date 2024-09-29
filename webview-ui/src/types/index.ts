import { Rule as EventBridgeRule, Target } from "@aws-sdk/client-eventbridge";

export interface CustomTarget extends Target {
  Service: string;
  Resource: string;
  ManagedBy?: string;
}

export interface Rule extends EventBridgeRule {
  Targets: CustomTarget[];
}
