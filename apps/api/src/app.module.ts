import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseService } from './database/database.service';
import { HealthController } from './health.controller';
import { OnboardingController } from './onboarding/onboarding.controller';
import { OnboardingService } from './onboarding/onboarding.service';
import { MemberDirectoryController } from './organization/member-directory.controller';
import { MemberDirectoryService } from './organization/member-directory.service';
import { ReadyController } from './ready.controller';

@Module({ controllers: [HealthController, ReadyController, AuthController, OnboardingController, MemberDirectoryController], providers: [DatabaseService, AuthService, OnboardingService, MemberDirectoryService] })
export class AppModule {}
