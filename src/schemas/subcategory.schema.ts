import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

const SubcategorySchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'Category',
    },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    priceGalore: { type: Number, default: 0 },
    weight: { type: Number, default: 1 },
    stock: { type: Number, default: 0 },
    aviableSizes: [],
    currency: { type: String, default: 'USD' },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    status: { type: Boolean, default: true, index: true },
  },
  { ...schemaOptions },
);
SubcategorySchema.index({ name: 'text' });

export default SubcategorySchema;
