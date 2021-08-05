import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Order } from 'src/dto/order.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { OrderRepository } from './order.repository';

@Controller(ENTITY.ORDER)
@UseGuards(AuthenticationGuard)
export class OrderController {
  constructor(private orderRepository: OrderRepository) {}

  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.orderRepository.getList(query);
  }

  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Order> {
    return this.orderRepository.getOne(id);
  }

  @Post('/setOrder')
  @UsePipes(new RequiredProps(ENTITY.ORDER))
  setOrder(@Body() data: Order): Promise<boolean> {
    return this.orderRepository.setOrder(data);
  }

  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.ORDER))
  create(@Body() data: Order): Promise<boolean> {
    return this.orderRepository.create(data);
  }

  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.ORDER))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Order>,
  ): Promise<boolean> {
    return this.orderRepository.update(id, data);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  }
}
