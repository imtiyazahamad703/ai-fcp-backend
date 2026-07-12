import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { USER_ROLES } from '../../common/constants';
import { AiService } from '../ai/ai.service';
import { QuestionsService } from '../questions/questions.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { GenerateQuestionDto } from './dto/generate-question.dto';
import * as bcrypt from 'bcrypt';
import { Question } from '../questions/schemas/question.schema';

// ============================
// Admin Controller
// ============================

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(USER_ROLES.ADMIN)
export class AdminController {
  constructor(
    private readonly aiService: AiService,
    private readonly questionsService: QuestionsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * GET /api/admin/users
   * Lists all admins.
   */
  @Get('users')
  async getAdmins() {
    const admins = await this.usersService.findAllAdmins();
    return { admins };
  }

  /**
   * POST /api/admin/users
   * Creates a new admin.
   */
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    
    const admin = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'admin',
    });
    
    return {
      message: 'Admin created successfully',
      admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    };
  }

  /**
   * DELETE /api/admin/users/:id
   * Deletes an admin.
   */
  @Delete('users/:id')
  async deleteAdmin(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'Admin deleted successfully' };
  }

  /**
   * POST /api/admin/questions/generate
   * Generates a question JSON using Gemini API based on a userPrompt.
   * Does NOT save to database yet.
   */
  @Post('questions/generate')
  @HttpCode(HttpStatus.OK)
  async generateQuestion(@Body() dto: GenerateQuestionDto) {
    const aiData = await this.aiService.generateQuestion(dto.userPrompt, dto.type);
    
    // Inject the userPrompt and type back into the payload before returning
    return {
      message: 'Question generated successfully',
      question: {
        ...aiData,
        userPrompt: dto.userPrompt,
        type: dto.type,
      },
    };
  }

  /**
   * POST /api/admin/questions
   * Saves a reviewed/edited generated question to the database.
   */
  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  async saveQuestion(@Body() questionData: Partial<Question>) {
    const question = await this.questionsService.create(questionData);
    return {
      message: 'Question saved successfully',
      question,
    };
  }

  /**
   * GET /api/admin/questions
   * Lists all questions for the admin dashboard.
   */
  @Get('questions')
  async getQuestions() {
    // Admin gets all questions regardless of status
    const questions = await this.questionsService.findAll();
    return { questions };
  }

  /**
   * GET /api/admin/questions/:id
   * Get a specific question by ID for review/editing.
   */
  @Get('questions/:id')
  async getQuestionById(@Param('id') id: string) {
    const question = await this.questionsService.findById(id);
    return { question };
  }

  /**
   * PUT /api/admin/questions/:id
   * Update a question (e.g. editing code or changing status to PUBLISHED).
   */
  @Put('questions/:id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() questionData: Partial<Question>,
  ) {
    const question = await this.questionsService.update(id, questionData);
    return {
      message: 'Question updated successfully',
      question,
    };
  }

  /**
   * DELETE /api/admin/questions/:id
   * Delete a question.
   */
  @Delete('questions/:id')
  async deleteQuestion(@Param('id') id: string) {
    await this.questionsService.delete(id);
    return { message: 'Question deleted successfully' };
  }
}

