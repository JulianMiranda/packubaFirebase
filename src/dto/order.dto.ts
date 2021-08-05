import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Document } from 'mongoose';

export class Order extends Document {
  @IsString()
  @IsMongoId()
  user: string;

  @IsArray()
  car: any[];

  @IsNumber()
  cost: number;

  @IsString()
  currency: string;
}
