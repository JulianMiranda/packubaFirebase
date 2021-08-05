import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyShopSchema } from 'src/schemas/myShop.schema';
import { OrderSchema } from 'src/schemas/order.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Order',
        schema: OrderSchema,
      },
      {
        name: 'MyShop',
        schema: MyShopSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    NotificationsModule,
  ],
  providers: [OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
