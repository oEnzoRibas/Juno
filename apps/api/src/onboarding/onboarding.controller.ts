import { BadRequestException, Body, Controller, Get, Header, Headers, Ip, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  accentColor,
  ActivateInvitationBody,
  InvitationResponse,
  IssueInvitationBody,
  ProvisionWorkspaceBody,
  WorkspaceIdResponse,
  WorkspaceResponse,
  workspaceSlug,
  WorkspaceSummary,
} from './onboarding.contract';
import { OnboardingService } from './onboarding.service';

function field(body: unknown, key: string): string {
  if (typeof body !== 'object' || body === null || !Object.hasOwn(body, key)) return '';
  const value = (body as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}

@ApiTags('onboarding')
@Controller('tenants')
export class OnboardingController {
  constructor(private readonly onboarding: OnboardingService) {}

  @Post()
  @ApiOperation({ summary: 'Provision a workspace and its initial branding as a platform administrator.' })
  @ApiBearerAuth()
  @ApiBody({ type: ProvisionWorkspaceBody })
  @ApiCreatedResponse({ type: WorkspaceIdResponse })
  @ApiResponse({ status: 400, description: 'Invalid workspace details or unavailable slug.' })
  @ApiResponse({ status: 401, description: 'A valid bearer token is required.' })
  @ApiResponse({ status: 403, description: 'Platform administration is required.' })
  provision(@Headers('authorization') authorization: string | undefined, @Body() body: unknown) {
    const slug = field(body, 'slug').trim();
    const name = field(body, 'name').trim();
    const accent = field(body, 'accent');
    if (!workspaceSlug.test(slug) || slug.length > 63 || !name || name.length > 120
      || !accentColor.test(accent)) throw new BadRequestException('Invalid workspace details');
    return this.onboarding.provision(authorization, { slug, name, accent });
  }

  @Post(':id/invitations')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Issue a one-time invitation to an administrator or member.' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  @ApiBody({ type: IssueInvitationBody })
  @ApiCreatedResponse({ type: InvitationResponse })
  @ApiResponse({ status: 400, description: 'Malformed workspace ID or invitation details.' })
  @ApiResponse({ status: 401, description: 'A valid bearer token is required.' })
  @ApiResponse({ status: 403, description: 'The account cannot issue this invitation.' })
  invite(@Headers('authorization') authorization: string | undefined, @Param('id', ParseUUIDPipe) id: string, @Body() body: unknown) {
    const email = field(body, 'email').trim().toLowerCase();
    const role = field(body, 'role');
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (role !== 'administrator' && role !== 'member')) {
      throw new BadRequestException('Invalid invitation details');
    }
    return this.onboarding.invite(authorization, id, email, role);
  }

  @Post('activation')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consume an invitation and create or attach its matching account.',
    security: [{ bearer: [] }, {}],
  })
  @ApiBody({ type: ActivateInvitationBody })
  @ApiCreatedResponse({ type: WorkspaceIdResponse })
  @ApiResponse({ status: 400, description: 'The invitation could not be activated.' })
  @ApiResponse({ status: 401, description: 'The optional bearer token was invalid.' })
  @ApiResponse({ status: 429, description: 'The activation budget was exceeded.' })
  accept(@Headers('authorization') authorization: string | undefined, @Body() body: unknown, @Ip() source: string) {
    const token = field(body, 'token').trim();
    const password = field(body, 'password');
    if (!/^[0-9a-f]{64}$/.test(token) || (!authorization && (password.length < 12 || Buffer.byteLength(password) > 256))) {
      throw new BadRequestException('Invitation could not be activated');
    }
    return this.onboarding.accept(authorization, token, password, source);
  }

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'List the workspaces where the authenticated account is an active member.' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: WorkspaceSummary, isArray: true })
  @ApiResponse({ status: 401, description: 'A valid bearer token is required.' })
  list(@Headers('authorization') authorization?: string) {
    return this.onboarding.list(authorization);
  }

  @Get(':id')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Open a workspace through its authenticated tenant and membership context.' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  @ApiOkResponse({ type: WorkspaceResponse })
  @ApiResponse({ status: 400, description: 'Malformed workspace ID.' })
  @ApiResponse({ status: 401, description: 'A valid bearer token is required.' })
  @ApiResponse({ status: 404, description: 'The workspace is unavailable to this account.' })
  read(@Headers('authorization') authorization: string | undefined, @Param('id', ParseUUIDPipe) id: string) {
    return this.onboarding.read(authorization, id);
  }
}
