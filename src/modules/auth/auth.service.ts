import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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
