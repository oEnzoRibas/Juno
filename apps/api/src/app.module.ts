import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { BuildInfoController } from './build-info.controller';
import { DatabaseService } from './database/database.service';
import { HealthController } from './health.controller';
import { OnboardingController } from './onboarding/onboarding.controller';
import { OnboardingService } from './onboarding/onboarding.service';
import { ReadyController } from './ready.controller';

@Module({ controllers: [HealthController, ReadyController, AuthController, OnboardingController, BuildInfoController], providers: [DatabaseService, AuthService, OnboardingService] })
export class AppModule {}
