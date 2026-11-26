import { createHash } from 'node:crypto';
import { lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

// Hash the files copied into the image before generating metadata or compiling.
const hash = createHash('sha256');
const excluded = new Set(['node_modules', '.next', 'dist', '.turbo']);
function hashSource(path) {
  const stat = lstatSync(path);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path).sort()) {
      if (!excluded.has(name)) hashSource(join(path, name));
    }
    return;
  }
  if (stat.isSymbolicLink()) {
    hash.update(JSON.stringify(['link', path, readlinkSync(path)]) + '\n');
    return;
  }
  const digest = createHash('sha256').update(readFileSync(path)).digest('hex');
  hash.update(JSON.stringify(['file', path, digest]) + '\n');
}
for (const path of readdirSync('.').sort()) {
  if (!excluded.has(path)) hashSource(path);
}

const metadata = {
  revision: null,
  tree: null,
  sourceState: 'unavailable',
  builtAt: new Date().toISOString(),
  sourceDigest: `sha256:${hash.digest('hex')}`,
  includedPullRequests: {},
};
const {
  JUNO_BUILD_REVISION: revision,
  JUNO_BUILD_TREE: tree,
  JUNO_BUILD_CREATED: builtAt,
  JUNO_BUILD_PRS: prs,
} = process.env;
if (revision || tree || builtAt) {
  if (!/^[a-f0-9]{40}$/.test(revision) || !/^[a-f0-9]{40}$/.test(tree) || !Number.isFinite(Date.parse(builtAt)))
    throw new Error('Invalid build provenance arguments');
  const includedPullRequests = JSON.parse(prs);
  if (
    !includedPullRequests ||
    Array.isArray(includedPullRequests) ||
    typeof includedPullRequests !== 'object' ||
    !Object.entries(includedPullRequests).every(
      ([number, sha]) => /^[1-9]\d{0,8}$/.test(number) && /^[a-f0-9]{40}$/.test(sha),
    )
  ) {
    throw new Error('Invalid integrated pull request provenance');
  }
  Object.assign(metadata, { revision, tree, builtAt, includedPullRequests, sourceState: 'clean' });
}
for (const target of ['.juno-build.json', 'apps/web/src/lib/generated/juno-build.json']) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(metadata) + '\n');
}
