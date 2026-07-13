import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import { Folder, FolderSchema } from './schemas/folder.schema';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';

// ============================
// Questions Module
// ============================

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Folder.name, schema: FolderSchema },
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
