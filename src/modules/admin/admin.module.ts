import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AiModule } from '../ai/ai.module';
import { QuestionsModule } from '../questions/questions.module';

// ============================
// Admin Module
// ============================

@Module({
  imports: [AiModule, QuestionsModule],
  controllers: [AdminController],
})
export class AdminModule {}
