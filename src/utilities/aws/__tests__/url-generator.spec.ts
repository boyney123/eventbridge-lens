import { getURLFromArn } from "../url-generator";

describe('url-generator', () => {
    it('takes a given cloudwatch ARN and returns the correct URL', () => {
        const arn = 'arn:aws:logs:us-west-2:1234567891234:log-group:/aws/apprunner/myapp/test/application';
        const answer = getURLFromArn(arn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:log-groups/log-group/%2Faws%2Fapprunner%2Fmyapp%2Ftest%2Fapplication');
    });
    it('takes a given EvenBridge rule on the default event bus ARN and returns the correct URL', () => {
        // Note: a rule on the default event bus does not return the event bus name in the ARN.
        const exampleRuleArnOnDefaultEventBus = 'arn:aws:events:us-west-2:1234567891234:rule/all-s3-events';
        const answer = getURLFromArn(exampleRuleArnOnDefaultEventBus);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/eventbus/default/rules/all-s3-events');
    });
    it('takes a given EvenBridge rule on a custom event bus ARN and returns the correct URL', () => {
        // Note: a rule on the default event bus does not return the event bus name in the ARN.
        const exampleRuleArnOnCustomBus = 'arn:aws:events:us-west-2:1234567891234:rule/InsuranceBus/InputTransformerRule';
        const answer = getURLFromArn(exampleRuleArnOnCustomBus);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/eventbus/InsuranceBus/rules/InputTransformerRule');
    });

    it('takes a given Lambda ARN and returns the correct URL', () => {
        // Note: a rule on the default event bus does not return the event bus name in the ARN.
        const lambdaArn = 'arn:aws:lambda:us-west-2:1234567891234:function:stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm';
        const answer = getURLFromArn(lambdaArn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions/stg-aiStoriesBackend-generateimagesforstory2010A29-dBCRYJaFIQrm');
    });

    it('takes a given Step Funtion ARN and returns the correct URL', () => {
        const sfnArn = 'arn:aws:states:us-west-2:1234567891234:stateMachine:IntrinsicExample';
        const answer = getURLFromArn(sfnArn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/states/home?region=us-west-2#/statemachines/view/arn:aws:states:us-west-2:1234567891234:stateMachine:IntrinsicExample');
    });

    it('takes a given SQS ARN and returns the correct URL', () => {
        const sqsArn = 'arn:aws:sqs:us-west-2:1234567891234:boyne-pipe-pipe-source';
        const answer = getURLFromArn(sqsArn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/sqs/v2/home?region=us-west-2#/queues/https%3A%2F%2Fsqs.us-west-2.amazonaws.com%2F1234567891234%2Fboyne-pipe-pipe-source');
    });
    it('takes a given SNS ARN and returns the correct URL', () => {
        const snsArn = 'arn:aws:sns:us-west-2:1234567891234:AiStory-story-generated';
        const answer = getURLFromArn(snsArn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/sns/v3/home?region=us-west-2#/topic/arn:aws:sns:us-west-2:1234567891234:AiStory-story-generated');
    });

    it('takes a given EventBridge EventBus ARN and returns the correct URL', () => {
        const snsArn = 'arn:aws:events:us-west-2:1234567891234:event-bus/demo-bus';
        const answer = getURLFromArn(snsArn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/eventbus/demo-bus');
    });

    it('takes a given EventBridge API Destination ARN and returns the correct url', () => {
        const apiDestinationArn = 'arn:aws:events:us-west-2:1234567891234:api-destination/Testing/fb2f3b89-a35c-4509-b0a8-7cfe833889e6';
        const answer = getURLFromArn(apiDestinationArn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/apidestinations/Testing');
    });

    it('takes a given EventBridge Archive ARN and returns the correct url', () => {
        const arn = 'arn:aws:events:us-west-2:1234567891234:archive/demo';
        const answer = getURLFromArn(arn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/archive/demo');
    });

    it('takes a given API Gateway ARN and returns the correct url', () => {
        const arn = 'arn:aws:execute-api:us-west-2:1234567891234:5b5tn08j0g/dev/POST/events';
        const answer = getURLFromArn(arn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/apigateway/home?region=us-west-2#/apis/5b5tn08j0g/stages/dev');
    });


    it('takes a given schema regitry ARN and returns the correct URL', () => {
        // The discovered schema target managed by EventBridge looks like this.
        const arn = 'arn:aws:schemas:us-west-2:::';
        const answer = getURLFromArn(arn);
        expect(answer).toEqual('https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/schemas?registry=discovered-schemas');
    });
    

});