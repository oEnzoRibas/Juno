import frontendBuild from '../lib/generated/juno-build.json';
import { apiRequest } from './juno-api';

type ApiConnection = 'connected' | 'unavailable' | 'disconnected';

interface ApiBuildInfo {
  revision: string | null;
  schemaVersion: number | null;
  environment: string | null;
}

export interface ReviewBuildInfo {
  environment: string | null;
  frontendRevision: string | null;
  backendRevision: string | null;
  schemaVersion: number | null;
  connection: ApiConnection;
  revisionMismatch: boolean;
  environmentMismatch: boolean;
  comparisonUnavailable: boolean;
  dirtySource: boolean;
}

function revision(value: unknown): string | null {
  return typeof value === 'string' && /^[a-f0-9]{40}$/.test(value) ? value : null;
}

function environment(value: unknown): string | null {
  return typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}$/.test(value) ? value : null;
}

function parseApiBuildInfo(value: unknown): ApiBuildInfo | null {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('revision' in value) ||
    !('schemaVersion' in value) ||
    !('environment' in value)
  ) {
    return null;
  }
  const schema = value.schemaVersion;
  return {
    revision: revision(value.revision),
    schemaVersion: typeof schema === 'number' && Number.isSafeInteger(schema) && schema >= 0 ? schema : null,
    environment: environment(value.environment),
  };
}

async function probeBackend(): Promise<{ connection: ApiConnection; build?: ApiBuildInfo }> {
  let response: Response;
  try {
    response = await apiRequest('build-info', {
      redirect: 'error',
      signal: AbortSignal.timeout(2_000),
    });
  } catch {
    return { connection: 'disconnected' };
  }
  if (!response.ok) return { connection: 'unavailable' };

  try {
    const build = parseApiBuildInfo(await response.json());
    return build ? { connection: 'connected', build } : { connection: 'unavailable' };
  } catch {
    return { connection: 'unavailable' };
  }
}

/** Read request-time environment and backend identity without exposing connection details. */
export async function loadReviewBuildInfo(
  env: Readonly<Record<string, string | undefined>> = process.env,
  baked: { revision: unknown; sourceState: unknown } = frontendBuild,
): Promise<ReviewBuildInfo | null> {
  if (env.JUNO_REVIEW_BUILD_INFO !== '1') return null;

  const liveSource = env.JUNO_REVIEW_LIVE_SOURCE === '1';
  const frontendRevision = liveSource ? null : revision(baked.revision);
  const webEnvironment = environment(env.JUNO_REVIEW_ENVIRONMENT);
  const configuredExpectedRevision = env.JUNO_REVIEW_EXPECTED_API_REVISION;
  const expectedApiRevision = configuredExpectedRevision ? revision(configuredExpectedRevision) : frontendRevision;
  const { connection, build } = await probeBackend();
  const backendRevision = build?.revision ?? null;

  return {
    environment: webEnvironment,
    frontendRevision,
    backendRevision,
    schemaVersion: build?.schemaVersion ?? null,
    connection,
    revisionMismatch: Boolean(expectedApiRevision && backendRevision && expectedApiRevision !== backendRevision),
    environmentMismatch: Boolean(webEnvironment && build?.environment && webEnvironment !== build.environment),
    comparisonUnavailable: !expectedApiRevision || !backendRevision || !webEnvironment || !build?.environment,
    dirtySource: !liveSource && baked.sourceState === 'dirty',
  };
}
