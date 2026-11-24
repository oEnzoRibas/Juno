import { Controller, Get, Header, Headers, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOkResponse({ type: MemberDirectoryResponse })
  @ApiResponse({ status: 400, description: 'Malformed tenant ID or cursor.' })
  @ApiResponse({ status: 401, description: 'A valid bearer session is required.' })
  @ApiResponse({ status: 404, description: 'The directory is unavailable to this account.' })
  list(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('after', new ParseUUIDPipe({ optional: true })) after?: string,
  ): Promise<MemberDirectoryResponse> {
    return this.directory.list(authorization, id, after);
  }
}
