import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyShop } from 'src/dto/my-shop.dto';
import { Order } from 'src/dto/order.dto';
import { NOTIFICATION } from 'src/enums/notification.enum';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { NotificationsRepository } from '../notifications/notifications.repository';
import { SendGridService } from '../../services/sendgrid.service';
import { User } from '../../dto/user.dto';

@Injectable()
export class OrderRepository {
  readonly type = ENTITY.ORDER;

  constructor(
    @InjectModel('Order') private orderDb: Model<Order>,
    @InjectModel('MyShop') private shopDb: Model<MyShop>,
    @InjectModel('User') private userDb: Model<User>,
    private notificationsRepository: NotificationsRepository,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, order] = await Promise.all([
        this.orderDb.countDocuments(filter),
        this.orderDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: order };
    } catch (e) {
      throw new InternalServerErrorException('Filter order Database error', e);
    }
  }

  async getOne(id: string): Promise<Order> {
    try {
      const document = await this.orderDb.findOne({ _id: id }).populate([
        {
          path: 'user',
          select: { name: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find order for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException('findOrder Database error', e);
    }
  }

  async setOrder(data: Order): Promise<boolean> {
    try {
      const newOrder = new this.orderDb(data);
      const document = await newOrder.save();
      if (document) {
        const [user, deleteCar] = await Promise.all([
          this.userDb.findById(data.user, { name: true, email: true }),
          this.shopDb.findOneAndUpdate({ user: data.user }, { car: [] }),
        ]);
        await this.notificationsRepository.newOrder(
          NOTIFICATION.ORDER,
          document._id,
        );
        SendGridService.sendGrid(document, user).catch((err) =>
          console.log(err),
        );
      }
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException('findOrder Database error', e);
    }
  }

  async create(data: Order): Promise<boolean> {
    try {
      const newOrder = new this.orderDb(data);
      const document = await newOrder.save();

      return !!document;
    } catch (e) {
      throw new InternalServerErrorException('createOrder Database error', e);
    }
  }

  async update(id: string, data: Partial<Order>): Promise<boolean> {
    try {
      const document = await this.orderDb.findOneAndUpdate(
        { _id: id },
        { ...data },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find order to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('updateOrder Database error', e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.orderDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find order to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('deleteOrder Database error', e);
    }
  }
}
