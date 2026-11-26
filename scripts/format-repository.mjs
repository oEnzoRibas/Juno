import { execFileSync } from 'node:child_process';
import { lstat, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { format, getFileInfo, resolveConfig } from 'prettier';

const write = process.argv[2] === '--write';
const decoder = new TextDecoder('utf-8', { fatal: true });
const binaryExtensions = new Set([
  '.avif', '.eot', '.gif', '.ico', '.jpeg', '.jpg', '.otf', '.pdf', '.png', '.ttf', '.webp', '.woff', '.woff2',
]);
const paths = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
}).split('\0');
const config = await resolveConfig('package.json');

async function checkFile(path) {
  const stat = await lstat(path).catch((error) => {
    if (error.code === 'ENOENT') return;
    throw error;
  });
  if (!stat?.isFile() || binaryExtensions.has(extname(path).toLowerCase())) return;

  const info = await getFileInfo(path, { ignorePath: '.prettierignore', resolveConfig: false });
  if (info.ignored) return;

  const bytes = await readFile(path);
  if (bytes.includes(0)) return;
  const original = decoder.decode(bytes);

  const text = original.replace(/\r\n?/g, '\n');
  const endOfLine = original.includes('\r\n') && !original.replaceAll('\r\n', '').includes('\n') ? '\r\n' : '\n';
  const options = { ...config, filepath: path, endOfLine: 'lf' };
  const formatted = info.inferredParser
    ? await format(text, options)
    : text.replace(/[ \t]+$/gm, '').replace(/\n*$/, text ? '\n' : '');
  const output = formatted.replaceAll('\n', endOfLine);
  if (Buffer.from(output).equals(bytes)) return;

  if (write) await writeFile(path, output);
  return path;
}

let changes = 0;
let errors = 0;
for (const path of new Set(paths.filter(Boolean))) {
  try {
    const result = await checkFile(path);
    if (result) {
      changes += 1;
      console.log(result);
    }
  } catch (error) {
    errors += 1;
    console.error(path + ': ' + error.message);
  }
}

if (errors || (!write && changes)) process.exitCode = 1;
if (!write && changes) console.error('Run pnpm format to fix the files listed above.');
if (!errors && (write || !changes))
  console.log(write ? 'Formatted ' + changes + ' files.' : 'Repository formatting passed.');
