import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpoService } from 'src/services/expo.service';
import { FirebaseService } from 'src/services/firebase.service';
import { flatten } from 'src/utils/util';
import { Order } from '../../dto/order.dto';
import { User } from '../../dto/user.dto';
import { NOTIFICATION } from '../../enums/notification.enum';
import { AWSService } from '../../services/aws.service';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectModel('Notification') private notificationDb: Model<any>,
    @InjectModel('User') private usersDb: Model<User>,
    @InjectModel('Order') private orderDb: Model<Order>,
  ) {}

  async testAWS(): Promise<any> {
    const usersJUN = await this.usersDb
      .find({ status: true }, { notificationTokens: 1 })
      .lean();

    const notificationsArray = [];

    for (const user of usersJUN) {
      notificationsArray.push({
        user: user._id,
        title: 'Producto Actualizado',
        body: `El PRoducto Tal ha sido Actualizado`,
        identifier: user._id,
        notificationTokens: user.notificationTokens,
      });
    }

    const pushNotifications = notificationsArray.map((item) => {
      const { title, body, user } = item;
      return item.notificationTokens.map((token: string) => ({
        notification: {
          title,
          body,
        },

        token,
        user,
      }));
    });

    console.log(flatten(pushNotifications));

    for (const batch of flatten(pushNotifications)) {
      console.log('batch', batch);
      AWSService.topicARN(batch.token, batch.notification);

      /* AWSService.topicARN(
        'dnWoy_m_QwO4RynUsRMTqC:APA91bEZIEVb65UhhMYk6OauBJMw_v9MDUPAdovxZ8_gYS6UdgUGaDQTvB5vuXTaDAzkpsSoO-rLwL2bYg4UY-4F-sxUnFUlGvs8k0AFf_S2-HmVpDEvzNHQ3E0r0gW1txX0Yt9tHqQT',
        {
          title: 'Titulo Not',
          body: 'Body de la not',
        },
      ); */
    }
    /* AWSService.topicARN(
      'dnWoy_m_QwO4RynUsRMTqC:APA91bEZIEVb65UhhMYk6OauBJMw_v9MDUPAdovxZ8_gYS6UdgUGaDQTvB5vuXTaDAzkpsSoO-rLwL2bYg4UY-4F-sxUnFUlGvs8k0AFf_S2-HmVpDEvzNHQ3E0r0gW1txX0Yt9tHqQT',
      {
        title: 'Titulo Not',
        body: 'Body de la not',
      },
    ); */
  }

  async newOrder(type: NOTIFICATION, order: string): Promise<any> {
    try {
      console.log('Haciendo');

      const orderDB = await this.orderDb
        .findOne({ _id: order }, { cost: 1 })
        .lean();

      const usersJUN = await this.usersDb
        .find({ role: 'JUN' }, { notificationTokens: 1 })
        .lean();

      if (usersJUN.length === 0) return;

      const notificationsArray = [];

      for (const user of usersJUN) {
        notificationsArray.push({
          user: user._id,
          title: 'Nueva Orden',
          body: `Nueva orden para el 🧑 Wata ${orderDB.cost} $`,
          type,
          identifier: orderDB._id,
          notificationTokens: user.notificationTokens,
        });
      }

      //await this.notificationDb.insertMany(notificationsArray);

      /*  const pushNotifications = notificationsArray.map((item) => {
        const { title, body } = item;
        return item.notificationTokens.map((token: string) => ({
          title,
          body,
          data: {
            source: 'backend',
            type,
          },
          to: token,
        }));
      }); */
      const pushNotifications = notificationsArray.map((item) => {
        const { title, email, user, body } = item;
        return item.notificationTokens.map((token: string) => ({
          notification: {
            title,
            body,
          },

          token,
        }));
      });

      FirebaseService.sendPushNotifications(flatten(pushNotifications));
      // ExpoService.sendExpoPushNotifications(flatten(pushNotifications));
    } catch (e) {
      throw new InternalServerErrorException(
        'create notification Database error',
        e,
      );
    }
  }
}
