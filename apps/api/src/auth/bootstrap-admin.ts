import { buffer } from 'node:stream/consumers';
import { createDatabasePool, databasePassword } from '../database/connection';
import { hashPassword, parseCredentials } from './credentials';

async function run(): Promise<void> {
  const input = JSON.parse((await buffer(process.stdin)).toString('utf8')) as unknown;
  const admin = parseCredentials(input);
  if (!admin) throw new Error('Invalid bootstrap credentials');

  const pool = createDatabasePool('juno_migrator', databasePassword('JUNO_MIGRATION_PASSWORD'));
  try {
    const result = await pool.query(
      'INSERT INTO juno.account (email, password_hash, platform_admin) VALUES ($1, $2, true) ON CONFLICT DO NOTHING',
      [admin.email, await hashPassword(admin.password)],
    );
    if (result.rowCount !== 1) throw new Error('Account already exists');
  } finally {
    await pool.end();
  }
}

run().then(
  () => console.info('Platform administrator created'),
  () => {
    console.error('Administrator bootstrap failed. Use valid credentials for a new account and verify migrations.');
    process.exitCode = 1;
  },
);
