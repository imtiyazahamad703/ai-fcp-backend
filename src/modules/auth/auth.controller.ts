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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
   * POST /api/auth/forgot-password
   * Request a password reset link.
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const data = await this.authService.forgotPassword(forgotPasswordDto.email);
    return {
      message: data.message,
    };
  }

  /**
   * POST /api/auth/reset-password
   * Reset the password using the token.
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const data = await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
    return {
      message: data.message,
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
