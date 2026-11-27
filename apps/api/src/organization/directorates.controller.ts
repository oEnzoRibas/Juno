import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DirectoratesService } from './directorates.service';

class DirectorateInput {
  @ApiProperty({ minLength: 1, maxLength: 120, example: 'Diretoria de Projetos' })
  name!: string;
}

class Directorate extends DirectorateInput {
  @ApiProperty({ format: 'uuid' })
  id!: string;
}

class DirectoratePage {
  @ApiProperty({ type: [Directorate], maxItems: 50 })
  items!: Directorate[];

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  nextCursor!: string | null;
}

/** Validate an untrusted request and retain the submitted case and spelling. */
export function directorateName(body: unknown): string {
  if (!body || typeof body !== 'object' || Object.keys(body).length !== 1 || !('name' in body)) {
    throw new BadRequestException('Provide a directorate name.');
  }
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || Array.from(name).length > 120 || /[\p{Cc}\p{Cs}]/u.test(name)) {
    throw new BadRequestException('Invalid directorate name.');
  }
  return name;
}

@ApiTags('organization')
@Controller('tenants/:id/directorates')
@ApiBearerAuth()
@ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
@ApiResponse({ status: 400, description: 'Malformed tenant ID, cursor, or directorate input.' })
@ApiResponse({ status: 401, description: 'A valid bearer session is required.' })
@ApiResponse({ status: 404, description: 'The directorates operation is unavailable to this account.' })
@ApiResponse({ status: 503, description: 'The database is unavailable.' })
export class DirectoratesController {
  constructor(private readonly directorates: DirectoratesService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'List directorates as an active tenant member.' })
  @ApiQuery({ name: 'after', required: false, schema: { type: 'string', format: 'uuid' } })
  @ApiOkResponse({ type: DirectoratePage })
  list(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('after', new ParseUUIDPipe({ optional: true })) after?: string,
  ): Promise<DirectoratePage> {
    return this.directorates.list(authorization, id, after);
  }

  @Post()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Create and audit a directorate as an active tenant administrator.' })
  @ApiBody({ type: DirectorateInput })
  @ApiCreatedResponse({ type: Directorate })
  @ApiResponse({ status: 409, description: 'A directorate already uses this name in the organization.' })
  create(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<Directorate> {
    return this.directorates.create(authorization, id, directorateName(body));
  }
}
