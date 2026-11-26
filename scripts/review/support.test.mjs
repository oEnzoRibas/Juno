import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmdirSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { assertPublishedPorts, choosePorts, parseArguments, parseJsonLines } from './support.mjs';

describe('review arguments and isolated ports', () => {
  it('requires a numeric PR and a full optional pin', () => {
    const sha = 'a'.repeat(40);
    expect(parseArguments(['--pr', '40', '--sha', sha, '--web-port', '18614'])).toEqual({
      pr: '40', sha, webPort: 18614, apiPort: undefined,
    });
    expect(() => parseArguments(['--pr', '../40'])).toThrow();
    expect(() => parseArguments(['--pr', '40', '--sha', 'abc'])).toThrow();
    expect(() => parseArguments(['--pr', '40', '--pr', '41'])).toThrow();
    expect(() => parseArguments(['--pr', '40', '--web-port', '18614', '--api-port', '18614'])).toThrow();
  });

  it('probes free ports and rejects an occupied loopback port', async () => {
    const { webPort, apiPort } = await choosePorts();
    expect(webPort).not.toBe(apiPort);
    const listener = createServer();
    await new Promise(resolve => listener.listen({ port: 0, host: '127.0.0.1' }, resolve));
    try {
      await expect(choosePorts(listener.address().port)).rejects.toThrow('could not be reserved');
    } finally {
      await new Promise(resolve => listener.close(resolve));
    }
  });

  it('fails the persistent Docker preflight before creating any review state', () => {
    const directory = mkdtempSync(join(tmpdir(), 'juno-review-preflight-'));
    const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
    const env = { ...process.env, TMPDIR: directory, TEMP: directory, TMP: directory };
    for (const key of Object.keys(env)) {
      if (key.toLowerCase() === 'path') delete env[key];
    }
    env.PATH = directory;
    try {
      const result = spawnSync(process.execPath, [cli, 'start', '--pr', '40'], { cwd: directory, env, encoding: 'utf8' });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Identify Docker Engine failed');
      expect(readdirSync(directory)).toEqual([]);
    } finally {
      rmdirSync(directory);
    }
  });

  it('accepts Compose JSON arrays and line-delimited output', () => {
    expect(parseJsonLines('')).toEqual([]);
    expect(parseJsonLines('[{"ID":"one"},{"ID":"two"}]')).toEqual([{ ID: 'one' }, { ID: 'two' }]);
    expect(parseJsonLines('{"ID":"one"}\r\n{"ID":"two"}\r\n')).toEqual([{ ID: 'one' }, { ID: 'two' }]);
  });

  it('rejects shared resources, exposed databases and a non-loopback binding', () => {
    const state = { project: 'juno-review-pr40-example', webPort: 18614, apiPort: 18615 };
    const image = { image: `juno-runtime:${state.project}`, build: {} };
    const config = {
      networks: { database: { internal: true, name: `${state.project}_database` } },
      volumes: { database: { name: `${state.project}_database` } },
      services: {
        migrate: image, db: {},
        web: { ...image, environment: { JUNO_API_ORIGIN: 'http://api:3001' }, ports: [{ host_ip: '127.0.0.1', published: '18614' }] },
        api: { ...image, ports: [{ host_ip: '127.0.0.1', published: '18615' }] },
      },
    };
    expect(() => assertPublishedPorts(config, state)).not.toThrow();
    config.services.web.ports[0].host_ip = '0.0.0.0';
    expect(() => assertPublishedPorts(config, state)).toThrow('Unexpected host port mapping');
    config.services.web.ports[0].host_ip = '127.0.0.1';
    config.services.db.ports = [{ published: '5432' }];
    expect(() => assertPublishedPorts(config, state)).toThrow('Unexpected host port mapping');
    config.services.db.ports = [];
    config.services.web.environment.JUNO_API_ORIGIN = 'http://127.0.0.1:4302';
    expect(() => assertPublishedPorts(config, state)).toThrow('must use the API service');
    config.services.web.environment.JUNO_API_ORIGIN = 'http://api:3001';
    config.volumes.database.name = 'juno-uat_database';
    expect(() => assertPublishedPorts(config, state)).toThrow('does not support an isolated review');
  });
});
