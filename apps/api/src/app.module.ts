import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { HealthController } from './health.controller';
import { ReadyController } from './ready.controller';

@Module({ controllers: [HealthController, ReadyController], providers: [DatabaseService] })
export class AppModule {}
