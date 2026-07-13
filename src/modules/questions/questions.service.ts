import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schemas/question.schema';
import { Folder } from './schemas/folder.schema';
import { RESPONSE_MESSAGES } from '../../common/constants';

// ============================
// Questions Service
// ============================

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Folder.name) private readonly folderModel: Model<Folder>,
  ) { }

  /**
   * Find all questions (can be filtered by status/type).
   */
  async findAll(filter: Record<string, any> = {}): Promise<Question[]> {
    return this.questionModel
      .find(filter)
      .select('-visibleTests.expectedBody') // Omit heavy data for list views
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Find all distinct folders.
   */
  async getFolders(): Promise<string[]> {
    const folders = await this.folderModel.find().sort({ createdAt: 1 }).exec();
    return folders.map(f => f.name);
  }

  /**
   * Create a new folder.
   */
  async createFolder(name: string): Promise<string> {
    try {
      const folder = new this.folderModel({ name });
      await folder.save();
      return folder.name;
    } catch (error: any) {
      // Ignore duplicate key error (code 11000)
      if (error.code === 11000) {
        return name;
      }
      throw error;
    }
  }

  /**
   * Delete a folder and move its questions to Practice Coding Challenges.
   */
  async deleteFolder(name: string): Promise<void> {
    await this.folderModel.deleteOne({ name }).exec();
    await this.questionModel.updateMany({ folder: name }, { folder: 'Practice Coding Challenges' }).exec();
  }

  /**
   * Find a specific question by ID.
   */
  async findById(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }
    return question;
  }

  /**
   * Create a new question document (typically from AI generation).
   */
  async create(data: Partial<Question>): Promise<Question> {
    const question = new this.questionModel(data);
    return question.save();
  }

  /**
   * Update an existing question.
   */
  async update(id: string, data: Partial<Question>): Promise<Question> {
    const question = await this.questionModel
      .findByIdAndUpdate(id, data, { returnDocument: 'after' })
      .exec();

    if (!question) {
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }
    return question;
  }

  /**
   * Delete a question.
   */
  async delete(id: string): Promise<void> {
    const result = await this.questionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }
  }
}
