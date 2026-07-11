import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { RESPONSE_MESSAGES } from '../../common/constants';

// ============================
// Auth Controller
// ============================

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/login
   * Authenticate with email and password.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return {
      message: RESPONSE_MESSAGES.LOGIN_SUCCESS,
      ...data,
    };
  }

  /**
   * POST /api/auth/register
   * Create a new learner account.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return {
      message: RESPONSE_MESSAGES.REGISTER_SUCCESS,
      ...data,
    };
  }

  /**
   * GET /api/auth/me
   * Get the current authenticated user's profile.
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@CurrentUser('_id') userId: string) {
    const user = await this.authService.getProfile(userId);
    return {
      message: RESPONSE_MESSAGES.SUCCESS,
      user,
    };
  }
}
