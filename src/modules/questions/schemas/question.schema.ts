import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  QUESTION_DIFFICULTY,
  QUESTION_TYPE,
  QUESTION_STATUS,
  type QuestionDifficulty,
  type QuestionType,
  type QuestionStatus,
} from '../../../common/constants';

// ============================
// Question Schema
// ============================

@Schema({ _id: false })
export class StarterFile {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  language: string;

  @Prop({ default: true })
  editable: boolean;
}

const StarterFileSchema = SchemaFactory.createForClass(StarterFile);

@Schema({ _id: false })
export class TestCase {
  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ['visible', 'hidden'],
    required: true,
  })
  type: string;

  // Optional assertions for fullstack questions
  @Prop({ type: Number })
  expectedStatus?: number;

  @Prop({ type: MongooseSchema.Types.Mixed })
  expectedBody?: any;

  @Prop({ type: [String] })
  expectedFields?: string[];

  @Prop({ type: String })
  endpoint?: string;
}

const TestCaseSchema = SchemaFactory.createForClass(TestCase);

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(QUESTION_DIFFICULTY),
    required: true,
  })
  difficulty: QuestionDifficulty;

  @Prop({
    type: String,
    enum: Object.values(QUESTION_TYPE),
    required: true,
  })
  type: QuestionType;

  @Prop({ required: true, trim: true })
  topic: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({
    type: String,
    enum: Object.values(QUESTION_STATUS),
    default: QUESTION_STATUS.DRAFT,
  })
  status: QuestionStatus;

  @Prop({ type: [StarterFileSchema], default: [] })
  starterCode: StarterFile[];

  @Prop({ type: [String], default: [] })
  editableFiles: string[];

  @Prop({ type: [TestCaseSchema], default: [] })
  visibleTests: TestCase[];

  @Prop({ default: 0 })
  hiddenTestCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// Indexing for search and filtering
QuestionSchema.index({ status: 1, type: 1 });
QuestionSchema.index({ tags: 1 });
