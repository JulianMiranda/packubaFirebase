import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MyShop } from 'src/dto/my-shop.dto';
import { Subcategory } from 'src/dto/subcategory.dto';
import { Category } from '../dto/category.dto';
import { ENTITY } from '../enums/entity.enum';
import { Order } from '../dto/order.dto';

const prepareProps = (props: string[], data: any) => {
  for (const key of Object.keys(data)) {
    if (!props.includes(key)) delete data[key];
  }

  return data;
};

const checkNullOrUndefined = (props: string[], data: any) => {
  for (const key of props) {
    if (!data.hasOwnProperty(key))
      throw new BadRequestException(`The property \\ ${key} \\ is required`);
    else if (data[key] == null)
      throw new BadRequestException(
        `The property \\ ${key} \\ cannot be null or undefined`,
      );
    else if (data[key] === '')
      throw new BadRequestException(
        `The property \\ ${key} \\ cannot be a empty string`,
      );
    else if (data[key] === [])
      throw new BadRequestException(
        `The property \\ ${key} \\ cannot be a empty array`,
      );
  }
};

const checkCategoriesProps = (data: Partial<Category>): Partial<Category> => {
  const props = ['name', 'image'];
  const dataCopy = prepareProps(props, { ...data });
  checkNullOrUndefined(props, dataCopy);
  return data;
};
const checkSubcategoriesProps = (
  data: Partial<Subcategory>,
): Partial<Subcategory> => {
  const props = ['name', 'images', 'category'];
  const dataCopy = prepareProps(props, { ...data });
  checkNullOrUndefined(props, dataCopy);
  return data;
};

const checkShopProps = (data: Partial<MyShop>): Partial<MyShop> => {
  const props = ['car'];
  const dataCopy = prepareProps(props, { ...data });
  checkNullOrUndefined(props, dataCopy);
  return data;
};

const checkOrderProps = (data: Partial<Order>): Partial<Order> => {
  const props = ['car'];
  const dataCopy = prepareProps(props, { ...data });
  checkNullOrUndefined(props, dataCopy);
  return data;
};

export const requiredProps = (route: string, data: any): any => {
  if (route === ENTITY.CATEGORY) return checkCategoriesProps(data);
  if (route === ENTITY.SUBCATEGORY) return checkSubcategoriesProps(data);
  if (route === ENTITY.MYSHOP) return checkShopProps(data);
  if (route === ENTITY.ORDER) return checkOrderProps(data);

  throw new InternalServerErrorException('Invalid Route');
};
