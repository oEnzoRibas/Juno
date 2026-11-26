import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Controller, Get, Header, NotFoundException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { DatabaseService } from './database/database.service';

const unavailable = {
  revision: null, tree: null, sourceState: 'unavailable', builtAt: null,
  sourceDigest: null, includedPullRequests: {},
};

function bakedMetadata(): typeof unavailable | Record<string, unknown> {
  try {
    const metadata = JSON.parse(readFileSync(resolve(__dirname, '../../../.juno-build.json'), 'utf8'));
    return {
      revision: metadata.revision,
      tree: metadata.tree,
      sourceState: metadata.sourceState,
      builtAt: metadata.builtAt,
      sourceDigest: metadata.sourceDigest,
      includedPullRequests: metadata.includedPullRequests,
    };
  } catch {
    return unavailable;
  }
}

@ApiExcludeController()
@Controller('build-info')
export class BuildInfoController {
  private readonly metadata = bakedMetadata();

  constructor(private readonly database: DatabaseService) {}

  /** Reports immutable build metadata and observed database schema on opt-in internal environments. */
  @Get()
  @Header('Cache-Control', 'no-store')
  async read(): Promise<Record<string, unknown>> {
    if (process.env.JUNO_REVIEW_BUILD_INFO !== '1') throw new NotFoundException();
    const name = process.env.JUNO_REVIEW_ENVIRONMENT ?? '';
    const environment = /^[a-z0-9][a-z0-9_-]{0,62}$/.test(name) ? name : null;
    return { ...this.metadata, environment, schemaVersion: await this.database.schemaVersion() };
  }
}
