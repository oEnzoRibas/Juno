import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseService } from './database/database.service';
import { HealthController } from './health.controller';
import { ReadyController } from './ready.controller';

@Module({ controllers: [HealthController, ReadyController, AuthController], providers: [DatabaseService, AuthService] })
export class AppModule {}
