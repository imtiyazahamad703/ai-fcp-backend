import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionService } from './execution.service';
import { UsersService } from '../users/users.service';
import { QuestionsService } from '../questions/questions.service';

@Controller('execution')
@UseGuards(AuthGuard('jwt'))
export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
    private readonly usersService: UsersService,
    private readonly questionsService: QuestionsService,
  ) {}

  /**
   * POST /api/execution/submit
   * Evaluates learner code against the question's test cases.
   */
  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitCode(@Req() req: any, @Body() payload: { questionId: string; files: { filename: string; content: string }[] }) {
    if (!payload.files || payload.files.length === 0) {
      return { status: 'fail', output: 'No files provided for execution.' };
    }

    // Fetch the question to get its test cases
    const question = await this.questionsService.findById(payload.questionId);
    const testCases = question.visibleTests || [];

    // If the question has test cases with input/expectedOutput, run evaluation
    const hasEvaluatableTests = testCases.some(tc => tc.input !== undefined && tc.expectedOutput !== undefined);

    if (hasEvaluatableTests) {
      const evaluation = await this.executionService.evaluateTestCases(payload.files, testCases);

      // Track progress if all tests passed
      if (evaluation.summary.failed === 0 && payload.questionId) {
        await this.usersService.markQuestionCompleted(req.user._id, payload.questionId);
      }

      return {
        message: 'Evaluation completed',
        status: evaluation.summary.failed === 0 ? 'pass' : 'fail',
        evaluation,
      };
    }

    // Fallback: legacy execution for questions without structured test cases
    const result = await this.executionService.executeCode(payload.files);
    
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
