import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import SubcategorySchema from '../../schemas/subcategory.schema';
import { ImageModule } from '../image/image.module';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryRepository } from './subcategory.repository';
import { AWSService } from '../../services/aws.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Subcategory',
        schema: SubcategorySchema,
      },
    ]),
    ImageModule,
    NotificationsModule,
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryRepository, AWSService],
})
export class SubcategoryModule {}
