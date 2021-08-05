import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from 'src/schemas/notification.schema';
import { OrderSchema } from 'src/schemas/order.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Notification',
        schema: NotificationSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Order',
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsRepository],
  exports: [NotificationsRepository],
})
export class NotificationsModule {}
