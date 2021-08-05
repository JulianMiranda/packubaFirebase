import { Injectable } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

@Injectable()
export class ExpoService {
  static init() {}
  static async sendExpoPushNotifications(notificationsArray: any[]) {
    const pushTokens = [];
    for (const notification of notificationsArray) {
      pushTokens.push(notification.to);
    }
    for (const pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }
    }
    const chunks = expo.chunkPushNotifications(notificationsArray);

    const tickets = [];
    (async () => {
      for (const chunk of chunks) {
        try {
          console.log(chunk);
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk),
            console.log(
              `${ticketChunk[0].status} push notifications have been sent`,
            ),
            tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    const receiptIds = [];
    for (const ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      for (const chunk of receiptIdChunks) {
        try {
          const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

          for (const receiptId in receipts) {
            const { status, details } = receipts[receiptId];
            if (status === 'ok') {
              continue;
            } else if (status === 'error') {
              console.error(`There was an error sending a notification`);
              if (details) {
                console.error(`The error code is ${details}`);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }
}
