import { BadRequestException, Body, Controller, Get, Header, Headers, Ip, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  provision(@Headers('authorization') authorization: string | undefined, @Body() body: unknown) {
    const slug = field(body, 'slug').trim();
    const name = field(body, 'name').trim();
    const accent = field(body, 'accent');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 63 || !name || name.length > 120
      || !/^#[A-Fa-f0-9]{6}$/.test(accent)) throw new BadRequestException('Invalid workspace details');
    return this.onboarding.provision(authorization, { slug, name, accent });
  }

  @Post(':id/invitations')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Issue a one-time invitation to an administrator or member.' })
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
  @ApiOperation({ summary: 'Consume an invitation and create or attach its matching account.' })
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
  list(@Headers('authorization') authorization?: string) {
    return this.onboarding.list(authorization);
  }

  @Get(':id')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Open a workspace through its authenticated tenant and membership context.' })
  read(@Headers('authorization') authorization: string | undefined, @Param('id', ParseUUIDPipe) id: string) {
    return this.onboarding.read(authorization, id);
  }
}
