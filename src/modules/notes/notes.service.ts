import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<Note>,
  ) {}

  async findOne(userId: string, questionId: string): Promise<Note | null> {
    return this.noteModel.findOne({
      userId: new Types.ObjectId(userId),
      questionId: new Types.ObjectId(questionId),
    }).exec();
  }

  async findAllForUser(userId: string): Promise<Note[]> {
    return this.noteModel.find({
      userId: new Types.ObjectId(userId),
    }).populate('questionId', 'title userPrompt type').exec();
  }

  async saveNote(userId: string, questionId: string, content: string): Promise<Note> {
    const uId = new Types.ObjectId(userId);
    const qId = new Types.ObjectId(questionId);

    const result = await this.noteModel.findOneAndUpdate(
      { userId: uId, questionId: qId },
      { content },
      { upsert: true, returnDocument: 'after' },
    ).exec();

    return result as Note;
  }
}
