import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionService } from './execution.service';

@Controller('execution')
@UseGuards(AuthGuard('jwt'))
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  /**
   * POST /api/execution/submit
   * Submits learner code for execution in a Docker container.
   */
  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitCode(@Body() payload: { questionId: string; files: { filename: string; content: string }[] }) {
    if (!payload.files || payload.files.length === 0) {
      return { status: 'fail', output: 'No files provided for execution.' };
    }

    const result = await this.executionService.executeCode(payload.files);
    
    return {
      message: 'Execution completed',
      status: result.status,
      output: result.output,
    };
  }
}
