import { notFound } from 'next/navigation';
import type { ShellLocale } from '../../../(shell)/_components/shell-data';

type QueryField = 'after' | 'emailPrefix' | 'role' | 'active';
export type DirectoryQuery = Partial<Record<QueryField, string>>;

const queryFields: readonly QueryField[] = ['after', 'emailPrefix', 'role', 'active'];

/** Normalize empty form fields and preserve literal prefix and cursor values. */
export function directoryQuery(input: Record<string, string | string[] | undefined>): DirectoryQuery {
  const params: DirectoryQuery = {};
  for (const field of queryFields) {
    const value = input[field];
    if (Array.isArray(value)) notFound();
    if (value) params[field] = value;
  }
  return params;
}

/** Link to the directory without dropping filters or the selected language. */
export function directoryHref(id: string, locale: ShellLocale, query: DirectoryQuery = {}, accountId?: string): string {
  const params = new URLSearchParams(query);
  if (locale === 'pt-BR') params.set('lang', locale);
  const suffix = params.size ? `?${params}` : '';
  return `/workspace/${id}/members${accountId ? `/${accountId}` : ''}${suffix}`;
}
