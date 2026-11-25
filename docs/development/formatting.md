# Repository formatting

This check implements the formatting gate in [JUNO-0022](tasks/JUNO-0022.md).

Run `pnpm format:check` to check repository files and `pnpm format` to fix formatting. The workspace CI runs the same check before ESLint. Git supplies the file list so the checks cover tracked files and new files that are eligible for commit, including dotfiles. Ignored local outputs are outside the file list.

Prettier checks supported source, configuration, and documentation formats. Other editable text files, such as Dockerfiles, Python, SQL tests and dotfiles, use the repository text conventions for UTF-8, consistent line endings, a final newline and trailing whitespace. SQL migration files, generated or original XML artwork and the package lockfile are kept in their source or tool format. Binary assets are outside text formatting.

The check accepts a consistently CRLF Windows checkout. Git normalizes tracked text to LF on commit.
