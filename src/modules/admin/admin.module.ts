import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AiModule } from '../ai/ai.module';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';

// ============================
// Admin Module
// ============================

@Module({
  imports: [AiModule, QuestionsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
