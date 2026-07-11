import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';
import { USER_ROLES } from './common/constants';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Seeder');

  logger.log('Initializing application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@aifcp.com';
  const adminPassword = 'AdminPassword123!';

  try {
    const existingAdmin = await usersService.findByEmail(adminEmail);

    if (existingAdmin) {
      logger.warn(`Admin user ${adminEmail} already exists.`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await usersService.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: USER_ROLES.ADMIN,
      });

      logger.log(`Admin user created successfully!`);
      logger.log(`Email: ${adminEmail}`);
      logger.log(`Password: ${adminPassword}`);
    }
  } catch (error) {
    logger.error('Failed to seed database:', error);
  } finally {
    await app.close();
    logger.log('Seeder finished.');
  }
}

bootstrap();
