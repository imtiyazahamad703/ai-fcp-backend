import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGES } from '../constants';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message:
          (data as Record<string, unknown>)?.message?.toString() ||
          RESPONSE_MESSAGES.SUCCESS,
        data:
          (data as Record<string, unknown>)?.data !== undefined
            ? ((data as Record<string, unknown>).data as T)
            : data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
