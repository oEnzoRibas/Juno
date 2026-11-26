import { Controller, Get, Header, Headers, NotFoundException, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parseDirectoryFilters } from './directory-query';
import { MemberDirectoryService } from './member-directory.service';

class MemberDirectoryEntry {
  @ApiProperty({ format: 'uuid' })
  accountId!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ enum: ['administrator', 'member'], enumName: 'MembershipRole' })
  role!: 'administrator' | 'member';

  @ApiProperty()
  active!: boolean;

  @ApiProperty({ format: 'date-time' })
  joinedAt!: string;
}

class MemberDirectoryResponse {
  @ApiProperty({ type: [MemberDirectoryEntry], maxItems: 50 })
  items!: MemberDirectoryEntry[];

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  nextCursor!: string | null;
}

@ApiTags('organization')
@Controller('tenants/:id/members')
export class MemberDirectoryController {
  constructor(private readonly directory: MemberDirectoryService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List memberships in the current tenant as an active tenant administrator.' })
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  @ApiQuery({ name: 'after', required: false, schema: { type: 'string', format: 'uuid' } })
  @ApiQuery({ name: 'emailPrefix', required: false, schema: { type: 'string', minLength: 1, maxLength: 254 }, description: 'Case-insensitive literal email prefix.' })
  @ApiQuery({ name: 'role', required: false, enum: ['administrator', 'member'] })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiOkResponse({ type: MemberDirectoryResponse })
  @ApiResponse({ status: 400, description: 'Malformed tenant ID, cursor, or filter.' })
  @ApiResponse({ status: 401, description: 'A valid bearer session is required.' })
  @ApiResponse({ status: 404, description: 'The directory is unavailable to this account.' })
  list(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('after', new ParseUUIDPipe({ optional: true })) after?: string,
    @Query('emailPrefix') emailPrefix?: unknown,
    @Query('role') role?: unknown,
    @Query('active') active?: unknown,
  ): Promise<MemberDirectoryResponse> {
    return this.directory.list(authorization, id, { after, ...parseDirectoryFilters(emailPrefix, role, active) });
  }

  @Get(':accountId')
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Read one membership as an active tenant administrator.' })
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  @ApiParam({ name: 'accountId', schema: { type: 'string', format: 'uuid' } })
  @ApiOkResponse({ type: MemberDirectoryEntry })
  @ApiResponse({ status: 400, description: 'Malformed tenant or account ID.' })
  @ApiResponse({ status: 401, description: 'A valid bearer session is required.' })
  @ApiResponse({ status: 404, description: 'The membership is unavailable to this account.' })
  async detail(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('accountId', ParseUUIDPipe) accountId: string,
  ): Promise<MemberDirectoryEntry> {
    const { items: [entry] } = await this.directory.list(authorization, id, { accountId });
    if (!entry) throw new NotFoundException();
    return entry;
  }
}
