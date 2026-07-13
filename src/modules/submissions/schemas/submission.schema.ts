import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// ============================
// Submission Schema
// Stores each user's submitted code + result for a question.
// On re-submit, the existing record is UPSERTED (one per user per question).
// ============================

@Schema({ _id: false })
class SubmittedFile {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  content: string;
}

const SubmittedFileSchema = SchemaFactory.createForClass(SubmittedFile);

@Schema({ timestamps: true })
export class Submission extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Question', required: true, index: true })
  questionId: string;

  /** The editable files the user submitted */
  @Prop({ type: [SubmittedFileSchema], default: [] })
  files: SubmittedFile[];

  /** Overall pass/fail status */
  @Prop({ type: String, enum: ['pass', 'fail'], default: 'fail' })
  status: 'pass' | 'fail';

  /** Compact summary of the last evaluation result */
  @Prop({ type: MongooseSchema.Types.Mixed })
  evaluationSummary?: {
    total: number;
    passed: number;
    failed: number;
  };

  /** Number of times the user has submitted this question */
  @Prop({ type: Number, default: 0 })
  attempts: number;

  createdAt: Date;
  updatedAt: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);

// Compound unique index: only one submission document per user per question
// (upserted on every submit so user can always resume from last code)
SubmissionSchema.index({ userId: 1, questionId: 1 }, { unique: true });
