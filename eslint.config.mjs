import tseslint from 'typescript-eslint';

export default [
  { ignores: ['**/dist/**', '**/.next/**', '**/next-env.d.ts'] },
  ...tseslint.configs.recommended,
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [{ group: ['**/api/src/**', '@juno/api', '@juno/api/*'], message: 'Use the documented HTTP interface.' }] }],
    },
  },
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [{ group: ['**/web/**', '@juno/web', '@juno/web/*'], message: 'Keep the server independent of the frontend.' }] }],
    },
  },
];
