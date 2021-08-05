import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyShopSchema } from 'src/schemas/myShop.schema';
import { ShopController } from './shop.controller';
import { ShopRepository } from './shop.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'MyShop',
        schema: MyShopSchema,
      },
    ]),
  ],
  providers: [ShopRepository],
  controllers: [ShopController],
})
export class ShopModule {}
