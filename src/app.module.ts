import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { NotesModule } from './modules/notes/notes.module';
import {
  appConfig,
  databaseConfig,
  jwtConfig,
  aiConfig,
  corsConfig,
  smtpConfig,
} from './config/env.config';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, aiConfig, corsConfig, smtpConfig],
      envFilePath: '.env',
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),

    // Common Module (Global filters, interceptors)
    CommonModule,

    // Feature Modules
    AuthModule,
    QuestionsModule,
    AiModule,
    AdminModule,
    ExecutionModule,
    SubmissionsModule,
    NotesModule,
  ],
})
export class AppModule {}
