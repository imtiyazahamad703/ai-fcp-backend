import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  async askQuestion(
    @Body('message') message: string,
    @Body('context') context: { title: string; description: string; currentCode: string },
  ) {
    const reply = await this.aiService.askQuestion(message, context);
    return { reply };
  }
}
