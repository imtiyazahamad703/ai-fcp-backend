import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

// ============================
// AI Module
// ============================

@Module({
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
