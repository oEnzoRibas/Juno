# Repository formatting

This check implements the formatting gate in [JUNO-0022](tasks/JUNO-0022.md).

Run `pnpm format:check` to check repository files and `pnpm format` to fix formatting. The workspace CI runs the same check before ESLint. Git supplies the file list so the checks cover tracked files and new files that are eligible for commit, including dotfiles. Ignored local outputs are outside the file list.

Prettier fully formats supported source, configuration and documentation, including JavaScript, TypeScript, CSS, HTML, JSON, YAML and Markdown. Other editable text, such as Dockerfiles, Python, SQL tests and dotfiles, receives basic UTF-8, line ending, final newline and trailing whitespace checks.

The formatter preserves applied SQL and Drizzle migration metadata, the pnpm lockfile, generated runtime metadata, binary assets and fonts, Draw.io masters and SVG exports, published review evidence, and the approved Design System V2 playground. See `.prettierignore` for repository-specific paths. Use the owning generator or a focused source update when a protected file needs to change.

The check accepts a consistently CRLF Windows checkout. Git normalizes tracked text to LF on commit.
