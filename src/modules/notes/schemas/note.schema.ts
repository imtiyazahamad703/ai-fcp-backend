import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  content: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.index({ userId: 1, questionId: 1 }, { unique: true });
