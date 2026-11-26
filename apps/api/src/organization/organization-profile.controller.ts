import { BadRequestException, Body, Controller, Header, Headers, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganizationProfileService } from './organization-profile.service';

class OrganizationProfileInput {
  @ApiProperty({ minLength: 1, maxLength: 120 })
  name!: string;

  @ApiProperty({ pattern: '^#[0-9A-Fa-f]{6}$', example: '#7565F5' })
  accent!: string;
}

class OrganizationProfile extends OrganizationProfileInput {
  @ApiProperty({ format: 'uuid' })
  id!: string;
}

function validateProfile(body: unknown): OrganizationProfileInput {
  if (!body || typeof body !== 'object' || Object.keys(body).length !== 2 || !('name' in body) || !('accent' in body)) {
    throw new BadRequestException('Provide a workspace name and accent.');
  }
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const accent = body.accent;
  if (!name || name.length > 120 || Array.from(name).some((character) => character < ' ' || character.codePointAt(0) === 127) ||
      typeof accent !== 'string' || !/^#[0-9a-f]{6}$/i.test(accent)) {
    throw new BadRequestException('Invalid workspace name or accent.');
  }
  return { name, accent: accent.toUpperCase() };
}

@ApiTags('organization')
@Controller('tenants/:id/profile')
export class OrganizationProfileController {
  constructor(private readonly profiles: OrganizationProfileService) {}

  @Put()
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Replace the current tenant name and decorative accent as an active administrator.' })
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  @ApiBody({ type: OrganizationProfileInput })
  @ApiOkResponse({ type: OrganizationProfile })
  @ApiResponse({ status: 400, description: 'Malformed tenant ID or profile.' })
  @ApiResponse({ status: 401, description: 'A valid bearer session is required.' })
  @ApiResponse({ status: 404, description: 'The organization profile is unavailable to this account.' })
  replace(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<OrganizationProfile> {
    return this.profiles.replace(authorization, id, validateProfile(body));
  }
}
