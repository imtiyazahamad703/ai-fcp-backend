import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
@UseGuards(AuthGuard('jwt'))
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  /**
   * GET /api/submissions/:questionId
   * Returns the current user's last submission for a question.
   * Frontend uses this to pre-fill the editor on workspace load.
   */
  @Get(':questionId')
  async getMySubmission(@Req() req: any, @Param('questionId') questionId: string) {
    const submission = await this.submissionsService.findOne(req.user._id, questionId);
    return { submission };
  }
}
