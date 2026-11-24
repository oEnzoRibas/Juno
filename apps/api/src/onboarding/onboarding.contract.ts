import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const workspaceSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const accentColor = /^#[A-Fa-f0-9]{6}$/;
const opaqueTokenPattern = '^[0-9a-f]{64}$';
const roles = ['administrator', 'member'] as const;

export class ProvisionWorkspaceBody {
  @ApiProperty({ minLength: 1, maxLength: 120, description: 'Display name, trimmed before storage.' })
  name!: string;

  @ApiProperty({ minLength: 1, maxLength: 63, pattern: workspaceSlug.source })
  slug!: string;

  @ApiProperty({ pattern: accentColor.source, example: '#7565F5' })
  accent!: string;
}

export class IssueInvitationBody {
  @ApiProperty({ format: 'email', maxLength: 254 })
  email!: string;

  @ApiProperty({ enum: roles, enumName: 'MembershipRole' })
  role!: (typeof roles)[number];
}

export class ActivateInvitationBody {
  @ApiProperty({ pattern: opaqueTokenPattern, description: 'One-time invitation token.' })
  token!: string;

  @ApiPropertyOptional({
    format: 'password',
    minLength: 12,
    description: 'Required for new accounts without a bearer session. Maximum 256 UTF-8 bytes.',
  })
  password?: string;
}

export class WorkspaceIdResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;
}

export class InvitationResponse {
  @ApiProperty({ pattern: opaqueTokenPattern })
  token!: string;

  @ApiProperty({ enum: [24] })
  expiresInHours!: number;
}

export class WorkspaceSummary extends WorkspaceIdResponse {
  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: roles, enumName: 'MembershipRole' })
  role!: (typeof roles)[number];
}

export class WorkspaceResponse extends WorkspaceSummary {
  @ApiProperty({ pattern: workspaceSlug.source })
  slug!: string;

  @ApiProperty({ pattern: accentColor.source })
  accent!: string;
}

export class OnboardingAuditEvent {
  @ApiProperty({ enum: ['tenant_created', 'invitation_issued', 'invitation_accepted'] })
  event!: 'tenant_created' | 'invitation_issued' | 'invitation_accepted';

  @ApiProperty({ format: 'date-time' })
  occurredAt!: string;
}

export class OnboardingAuditResponse {
  @ApiProperty({ type: [OnboardingAuditEvent], maxItems: 50 })
  events!: OnboardingAuditEvent[];
}
