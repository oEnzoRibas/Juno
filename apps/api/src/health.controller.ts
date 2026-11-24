import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

class HealthResponse {
  @ApiProperty({ enum: ['ok'] })
  readonly status = 'ok' as const;
}

@Controller('health')
export class HealthController {
  /** Reports process liveness without including environment or tenant data. */
  @Get()
  @ApiOkResponse({ type: HealthResponse })
  read(): HealthResponse {
    return new HealthResponse();
  }
}
