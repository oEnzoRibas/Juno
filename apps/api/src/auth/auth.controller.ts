import { Body, Controller, Get, Header, Headers, HttpCode, Ip, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { parseCredentials } from './credentials';

class SignInBody {
  @ApiProperty({ format: 'email', maxLength: 254 })
  email!: string;

  @ApiProperty({ format: 'password', minLength: 12, description: 'Maximum 256 UTF-8 bytes.' })
  password!: string;
}

class SignInResponse {
  @ApiProperty({ pattern: '^[0-9a-f]{64}$' })
  token!: string;

  @ApiProperty({ format: 'date-time' })
  expiresAt!: string;
}

class SessionResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  platformAdmin!: boolean;
}

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @ApiBody({ type: SignInBody })
  @ApiOkResponse({ type: SignInResponse, description: 'Opaque bearer token and its expiry. Store the token securely.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 429, description: 'Sign-in budget exceeded.' })
  signIn(@Body() body: unknown, @Ip() source: string) {
    const parsed = parseCredentials(body);
    if (!parsed) throw new UnauthorizedException();
    return this.auth.signIn(parsed.email, parsed.password, source);
  }

  @Get('session')
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SessionResponse })
  @ApiResponse({ status: 401, description: 'A valid bearer token is required.' })
  session(@Headers('authorization') authorization?: string) {
    return this.auth.identity(authorization);
  }

  @Post('sign-out')
  @HttpCode(204)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ security: [{ bearer: [] }, {}] })
  @ApiNoContentResponse({ description: 'The session was revoked or no current token was supplied.' })
  async signOut(@Headers('authorization') authorization?: string): Promise<void> {
    await this.auth.signOut(authorization);
  }
}
