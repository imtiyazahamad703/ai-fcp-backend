import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionService } from './execution.service';
import { UsersService } from '../users/users.service';

@Controller('execution')
@UseGuards(AuthGuard('jwt'))
export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * POST /api/execution/submit
   * Submits learner code for execution in a Docker container.
   */
  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitCode(@Req() req: any, @Body() payload: { questionId: string; files: { filename: string; content: string }[] }) {
    if (!payload.files || payload.files.length === 0) {
      return { status: 'fail', output: 'No files provided for execution.' };
    }

    const result = await this.executionService.executeCode(payload.files);
    
    // Track progress if execution passed
    if (result.status === 'pass' && payload.questionId) {
      await this.usersService.markQuestionCompleted(req.user._id, payload.questionId);
    }
    
    return {
      message: 'Execution completed',
      status: result.status,
      output: result.output,
    };
  }

  /**
   * POST /api/execution/run-endpoint
   * Dynamically executes a specific backend route with payload.
   */
  @Post('run-endpoint')
  @HttpCode(HttpStatus.OK)
  async runEndpoint(@Req() req: any, @Body() payload: { 
    questionId: string; 
    files: { filename: string; content: string }[];
    method: string;
    endpoint: string;
    body: any;
  }) {
    if (!payload.files || payload.files.length === 0) {
      return { status: 'fail', output: 'No files provided for execution.' };
    }

    const result = await this.executionService.executeDynamicEndpoint(
      payload.files,
      payload.method,
      payload.endpoint,
      payload.body
    );
    
    return {
      message: 'Dynamic execution completed',
      status: result.status,
      output: result.output,
    };
  }
}
