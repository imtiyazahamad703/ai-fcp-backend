import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { UsersModule } from '../users/users.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [UsersModule, QuestionsModule],
  controllers: [ExecutionController],
  providers: [ExecutionService],
})
export class ExecutionModule {}
