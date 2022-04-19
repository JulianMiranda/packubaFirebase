import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { MONGO_CONNECTION } from './config/config';
import { GetUserMiddleware } from './middlewares/get-user.middleware';
import { FirebaseService } from './services/firebase.service';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { RoleController } from './modules/role/role.controller';
import { RoleModule } from './modules/role/role.module';
import { ImageController } from './modules/image/image.controller';
import { ImageModule } from './modules/image/image.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { CategoryController } from './modules/category/category.controller';
import { SubcategoryController } from './modules/subcategory/subcategory.controller';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { ShopModule } from './modules/shop/shop.module';
import { ShopController } from './modules/shop/shop.controller';
import { OrderModule } from './modules/order/order.module';
import { OrderController } from './modules/order/order.controller';
import { ExpoService } from './services/expo.service';
import { SendGridService } from './services/sendgrid.service';
import { AWSService } from './services/aws.service';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    ImageModule,
    CategoryModule,
    SubcategoryModule,
    ShopModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [FirebaseService, ExpoService, SendGridService, AWSService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes(
        AuthController,
        UserController,
        RoleController,
        ImageController,
        CategoryController,
        SubcategoryController,
        ShopController,
        OrderController,
      );
  }
}
