import { BadRequestException } from '@nestjs/common';

export interface DirectoryQuery {
  after?: string;
  emailPrefix?: string;
  role?: 'administrator' | 'member';
  active?: boolean;
  accountId?: string;
}

/** Parse untrusted query values before entering the tenant transaction. */
export function parseDirectoryFilters(emailPrefix: unknown, role: unknown, active: unknown): DirectoryQuery {
  if (emailPrefix !== undefined &&
      (typeof emailPrefix !== 'string' || !/^[!-~]{1,254}$/.test(emailPrefix))) {
    throw new BadRequestException('Email prefix must contain 1–254 printable ASCII characters.');
  }
  if (role !== undefined && role !== 'administrator' && role !== 'member') {
    throw new BadRequestException('Invalid membership role.');
  }
  if (active !== undefined && active !== 'true' && active !== 'false') {
    throw new BadRequestException('Invalid membership state.');
  }
  return { emailPrefix, role, active: active === undefined ? undefined : active === 'true' };
}
