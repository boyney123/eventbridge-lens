import Lambda from './lambda'
import DynamoDB from './lambda'
import SNS from './sns'
import CloudWatch from './cloudwatch'
import InputTranform from './input-transform'
import SQS from './sqs'
import EventBridge from './eventbridge';
import StepFunctions from './stepfunctions';
import APIGateway from './api-gateway';
import EventBridgeRule from './eventbridge-rule';
import S3 from './s3';

export default {
    lambda: Lambda,
    dynamodb: DynamoDB,
    sns: SNS,
    sqs: SQS,
    logs: CloudWatch,
    archive: S3,
    states: StepFunctions,
    eventbridge: EventBridge,
    eventbridgeRule: EventBridgeRule,
    events: EventBridge,
    inputTransform: InputTranform,
    'execute-api': APIGateway
}