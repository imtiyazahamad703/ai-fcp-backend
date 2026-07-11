import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users/profile
   * Get the current user's profile and progress stats
   */
  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        completedQuestions: user.completedQuestions || [],
      }
    };
  }
}
