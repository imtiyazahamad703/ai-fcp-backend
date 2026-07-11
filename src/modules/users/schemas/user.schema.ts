import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { USER_ROLES, type UserRole } from '../../../common/constants';

// ============================
// User Schema
// ============================

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc: any, ret: Record<string, any>) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
})
export class User extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 6,
  })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.LEARNER,
  })
  role: UserRole;

  // Timestamps added by Mongoose
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for fast email lookups during login
UserSchema.index({ email: 1 });
