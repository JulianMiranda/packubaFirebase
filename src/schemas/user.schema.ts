import * as mongoose from 'mongoose';
import { THEME } from 'src/enums/theme.enum';
import { schemaOptions } from '../utils/index';

export const UserSchema = new mongoose.Schema(
  {
    firebaseId: String,
    name: { type: String, index: true },

    email: String,
    phone: String,
    role: String,
    defaultImage: String,
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    status: { type: Boolean, default: true, index: true },
    authorized: { type: Boolean, default: false, index: true },
    preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    favoriteOwners: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Owners', index: true },
    ],
    notificationTokens: [{ type: String }],
    online: { type: Boolean, default: false, index: true },
    serviceZone: String,
    theme: {
      type: String,
      default: THEME.DEFAULT,
      enum: [THEME.DEFAULT, THEME.DARK, THEME.LIGHT],
    },
  },
  { ...schemaOptions },
);
