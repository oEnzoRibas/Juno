import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse } from '@nestjs/swagger';
import { DatabaseService } from './database/database.service';

@Controller('ready')
export class ReadyController {
  constructor(private readonly database: DatabaseService) {}

  /** Verifies runtime access to the expected database schema. */
  @Get()
  @ApiOkResponse({ description: 'The expected database migration is present and readable.' })
  @ApiServiceUnavailableResponse({ description: 'The database or schema is unavailable.' })
  async read(): Promise<{ status: 'ready' }> {
    if (!(await this.database.isReady())) throw new ServiceUnavailableException();
    return { status: 'ready' };
  }
}
