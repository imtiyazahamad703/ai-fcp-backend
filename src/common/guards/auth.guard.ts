import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { RESPONSE_MESSAGES } from '../constants';

// ============================
// JWT Auth Guard
// Extends Passport's AuthGuard to use our JWT strategy
// ============================

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<T>(err: any, user: T): T {
    if (err || !user) {
      throw new UnauthorizedException(RESPONSE_MESSAGES.UNAUTHORIZED);
    }
    return user;
  }
}
