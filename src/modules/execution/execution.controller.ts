import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionService } from './execution.service';
import { UsersService } from '../users/users.service';
import { QuestionsService } from '../questions/questions.service';
import { SubmissionsService } from '../submissions/submissions.service';

@Controller('execution')
@UseGuards(AuthGuard('jwt'))
export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
    private readonly usersService: UsersService,
    private readonly questionsService: QuestionsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  /**
   * POST /api/execution/submit
   * Evaluates learner code against test cases, then persists the submission to DB.
   */
  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitCode(
    @Req() req: any,
    @Body() payload: {
      questionId: string;
      files: { filename: string; content: string }[];
    },
  ) {
    if (!payload.files || payload.files.length === 0) {
      return { status: 'fail', output: 'No files provided for execution.' };
    }

    const question = await this.questionsService.findById(payload.questionId);
    const testCases = question.visibleTests || [];
    const hasEvaluatableTests = testCases.some(
      (tc) => tc.input !== undefined && tc.expectedOutput !== undefined,
    );

    let status: 'pass' | 'fail';
    let evaluationSummary: { total: number; passed: number; failed: number } | undefined;
    let responsePayload: any;

    if (hasEvaluatableTests) {
      const evaluation = await this.executionService.evaluateTestCases(
        payload.files,
        testCases,
      );
      status = evaluation.summary.failed === 0 ? 'pass' : 'fail';
      evaluationSummary = evaluation.summary;
      responsePayload = {
        message: 'Evaluation completed',
        status,
        evaluation,
      };
    } else {
      // Legacy fallback for questions without structured test cases
      const result = await this.executionService.executeCode(payload.files);
      status = result.status;
      responsePayload = {
        message: 'Execution completed',
        status: result.status,
        output: result.output,
      };
    }

    // ---- Persist submission (upsert: one doc per user per question) ----
    // Only save the editable files the user actually modified
    const editableFiles = payload.files.filter((f) => {
      const starterFile = question.starterCode.find((s) => s.filename === f.filename);
      return starterFile?.editable !== false;
    });

    await this.submissionsService.upsert(
      req.user._id,
      payload.questionId,
      editableFiles,
      status,
      evaluationSummary,
    );

    // Mark as completed if fully passed
    if (status === 'pass') {
      await this.usersService.markQuestionCompleted(req.user._id, payload.questionId);
    }

    return responsePayload;
  }

  /**
   * POST /api/execution/run-endpoint
   * Dynamically executes a specific backend route with payload (used by Sandpack live preview).
   */
  @Post('run-endpoint')
  @HttpCode(HttpStatus.OK)
  async runEndpoint(
    @Req() req: any,
    @Body() payload: {
      questionId: string;
      files: { filename: string; content: string }[];
      method: string;
      endpoint: string;
      body: any;
    },
  ) {
    if (!payload.files || payload.files.length === 0) {
      return { status: 'fail', output: 'No files provided for execution.' };
    }

    const result = await this.executionService.executeDynamicEndpoint(
      payload.files,
      payload.method,
      payload.endpoint,
      payload.body,
    );

    return {
      message: 'Dynamic execution completed',
      status: result.status,
      output: result.output,
    };
  }
}
