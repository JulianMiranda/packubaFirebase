import { Injectable, Logger } from '@nestjs/common';
import {
  AWS_API_VERSION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_ARN,
} from '../config/config';
import * as AWS from 'aws-sdk';

/* const fcmToken = 'SAMPLE_FCM_TOKEN';
const applicationArn =
  'arn:aws:sns:us-east-1:174491001014:app/GCM/NotificationFirebase';
const topicArn = 'SNS_TOPIC_ARN';

const apiVersion = '2010-03-31';
const accessKeyId = 'AKIASRIDZMC3JHH7MHGX';
const secretAccessKey = '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';
const region = 'us-east-1'; */

@Injectable()
export class AWSService {
  private static readonly logger = new Logger('AWS');

  static async registerDevice(token: string): Promise<string> {
    console.log('Registering device endpoint');
    const sns = new AWS.SNS({
      apiVersion: AWS_API_VERSION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
    });
    const endpointArn = await sns
      .createPlatformEndpoint({
        PlatformApplicationArn: AWS_ARN,
        Token: token,
      })
      .promise()
      .then((data) => {
        return data.EndpointArn;
      })
      .catch((error) => {
        return null;
      });
    return endpointArn;
  }

  // Function to subscribe to an SNS topic using an endpoint
  static async subscribeToSnsTopic(endpointArn: string): Promise<string> {
    console.log('Subscribing device endpoint to topic');
    const sns = new AWS.SNS({
      apiVersion: AWS_API_VERSION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
    });
    const subscriptionArn = await sns
      .subscribe({
        TopicArn: 'Topic_ARN',
        Endpoint: endpointArn,
        Protocol: 'application',
      })
      .promise()
      .then((data) => {
        return data.SubscriptionArn;
      })
      .catch((error) => {
        return null;
      });
    return subscriptionArn;
  }

  // Send SNS message to a topic
  static async topicARN(token: string, notification): Promise<any> {
    const { title, body } = notification;
    console.log('Not', title, body);
    const sns = new AWS.SNS({
      apiVersion: AWS_API_VERSION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
    });
    const resp = await AWSService.registerDevice(token);
    console.log(resp);
    const message = {
      GCM:
        '{"notification": { "title":"' +
        title +
        '", "body":' +
        JSON.stringify(body) +
        '} }',
    };
    /*  const message = {
      GCM:
        '{"notification": { "title": "Titlulo Not", "body": "Cuerpo de la Notificacion" } }',
    }; */

    const params = {
      TargetArn: resp,
      MessageStructure: 'json',
      Message: JSON.stringify(message),
    };
    sns
      .publish(params)
      .promise()
      .then((data) => {
        console.log('MessageID is ' + data.MessageId);
      })
      .catch((err) => {
        console.error(err, err.stack);
      });
  }
}
