import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { BuildInfoController } from './build-info.controller';
import { DatabaseService } from './database/database.service';
import { HealthController } from './health.controller';
import { OnboardingController } from './onboarding/onboarding.controller';
import { OnboardingService } from './onboarding/onboarding.service';
import { MemberDirectoryController } from './organization/member-directory.controller';
import { MemberDirectoryService } from './organization/member-directory.service';
import { OrganizationProfileController } from './organization/organization-profile.controller';
import { OrganizationProfileService } from './organization/organization-profile.service';
import { ReadyController } from './ready.controller';

@Module({
  controllers: [
    HealthController,
    ReadyController,
    AuthController,
    OnboardingController,
    MemberDirectoryController,
    OrganizationProfileController,
    BuildInfoController,
  ],
  providers: [DatabaseService, AuthService, OnboardingService, MemberDirectoryService, OrganizationProfileService],
})
export class AppModule {}
