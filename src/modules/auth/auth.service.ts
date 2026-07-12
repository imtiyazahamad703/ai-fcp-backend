import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RESPONSE_MESSAGES } from '../../common/constants';

// ============================
// Auth Service
// ============================

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authenticate user with email and password.
   * Returns JWT token and user data.
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = this.generateToken(
      user._id.toString(),
      user.email,
      user.role,
    );

    this.logger.log(`User logged in: ${user.email}`);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Register a new learner account.
   * Admins are created through seeding only.
   */
  async register(registerDto: RegisterDto) {
    // Check if email already taken
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      SALT_ROUNDS,
    );

    // Create user (always as learner)
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    const token = this.generateToken(
      user._id.toString(),
      user.email,
      user.role,
    );

    this.logger.log(`New user registered: ${user.email}`);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Request password reset email.
   */
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If that email is registered, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    const resetLink = `${this.configService.get('cors.origin')}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      host: this.configService.get('smtp.host'),
      port: this.configService.get('smtp.port'),
      secure: true,
      auth: {
        user: this.configService.get('smtp.user'),
        pass: this.configService.get('smtp.pass'),
      },
    });

    try {
      await transporter.sendMail({
        from: `"AI-FCP Support" <${this.configService.get('smtp.user')}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h3>Password Reset</h3>
          <p>You requested a password reset. Please click the link below to set a new password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
      this.logger.log(`Password reset email sent to: ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${user.email}`, error);
      throw new BadRequestException('Failed to send email. Please try again later.');
    }

    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  /**
   * Reset password using token.
   */
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Password reset token is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    this.logger.log(`Password reset successful for user: ${user.email}`);

    return { message: 'Password has been reset successfully.' };
  }

  /**
   * Get current user profile from JWT payload.
   */
  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Generate a signed JWT token.
   */
  private generateToken(
    userId: string,
    email: string,
    role: string,
  ): string {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.sign(payload);
  }
}
