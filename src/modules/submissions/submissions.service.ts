import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission } from './schemas/submission.schema';

// ============================
// Submissions Service
// ============================

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<Submission>,
  ) {}

  /**
   * Upsert the user's code for a question.
   * One document per (userId, questionId) — re-submits just update the existing doc.
   */
  async upsert(
    userId: string,
    questionId: string,
    files: { filename: string; content: string }[],
    status: 'pass' | 'fail',
    evaluationSummary?: { total: number; passed: number; failed: number },
  ): Promise<Submission> {
    return this.submissionModel.findOneAndUpdate(
      { userId, questionId },
      {
        $set: {
          files,
          status,
          evaluationSummary: evaluationSummary ?? null,
        },
        $inc: { attempts: 1 }
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  /**
   * Get the user's last submission for a specific question.
   * Returns null if the user has never submitted.
   */
  async findOne(userId: string, questionId: string): Promise<Submission | null> {
    return this.submissionModel.findOne({ userId, questionId }).exec();
  }

  /**
   * Get all submissions by a user (for history / profile page).
   */
  async findAllByUser(userId: string): Promise<Submission[]> {
    return this.submissionModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .exec();
  }
}
