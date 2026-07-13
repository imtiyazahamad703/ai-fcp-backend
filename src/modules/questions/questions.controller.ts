import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuestionsService } from './questions.service';

@Controller('questions')
@UseGuards(AuthGuard('jwt'))
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * GET /api/questions
   * Get all published questions for learners.
   */
  @Get()
  async getPublishedQuestions() {
    const questions = await this.questionsService.findAll({ status: 'published' });
    
    // Strip hidden test cases before sending to learner
    const sanitizedQuestions = questions.map(q => {
      const qObj = q.toObject();
      if (qObj.testCases) {
        qObj.testCases = qObj.testCases.filter(tc => tc.type === 'visible');
      }
      return qObj;
    });

    return { questions: sanitizedQuestions };
  }

  /**
   * GET /api/questions/folders
   * Get all unique folders/collections.
   */
  @Get('folders')
  async getFolders() {
    const folders = await this.questionsService.getFolders();
    // Filter out null/undefined or empty strings if any exist
    return { folders: folders.filter(f => f && f.trim() !== '') };
  }

  @Post('folders')
  async createFolder(@Body('name') name: string) {
    if (!name || typeof name !== 'string') {
      throw new Error('Folder name is required and must be a string');
    }
    const createdName = await this.questionsService.createFolder(name);
    return { name: createdName };
  }

  @Delete('folders/:name')
  async deleteFolder(@Param('name') name: string) {
    await this.questionsService.deleteFolder(name);
    return { success: true };
  }

  /**
   * GET /api/questions/:id
   * Get a specific published question by ID.
   */
  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    const question = await this.questionsService.findById(id);
    
    // Security check: Only allow access to published questions
    if (question.status !== 'published') {
      throw new Error('Question not found or not published');
    }

    const qObj = question.toObject();
    if (qObj.testCases) {
      qObj.testCases = qObj.testCases.filter(tc => tc.type === 'visible');
    }

    return { question: qObj };
  }
}
