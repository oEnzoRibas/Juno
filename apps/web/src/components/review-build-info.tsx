"use client";

import { useSearchParams } from "next/navigation";
import type { ReviewBuildInfo } from "../server/review-build-info";
import { reviewBuildMessages } from "../content/review-build-messages";

export function ReviewBuildInfoPanel({ info }: { info: ReviewBuildInfo }) {
  const locale = useSearchParams().get("lang") === "pt-BR" ? "pt-BR" : "en";
  const copy = reviewBuildMessages[locale];
  const warnings = [
    info.revisionMismatch && copy.revisionMismatch,
    info.environmentMismatch && copy.environmentMismatch,
    info.comparisonUnavailable && copy.comparisonUnavailable,
    info.dirtySource && copy.dirtySource,
  ].filter((warning) => warning !== false);
  const hasWarning = warnings.length > 0 || info.connection !== "connected";
  const schema =
    info.schemaVersion === null
      ? copy.unknown
      : new Intl.NumberFormat(locale, { useGrouping: false }).format(info.schemaVersion);

  return (
    <aside className="review-build" aria-label={copy.title} lang={locale}>
      <details className="review-build__panel">
        <summary>
          {copy.title}
          {info.environment && <span className="review-build__environment"> · {info.environment}</span>}
          {hasWarning && <span className="review-build__warning"> · {copy.checkRuntime}</span>}
        </summary>
        <dl className="review-build__values">
          <dt>{copy.environment}</dt>
          <dd>{info.environment ?? copy.unknown}</dd>
          <dt>{copy.frontend}</dt>
          <dd>{info.frontendRevision ? <code>{info.frontendRevision}</code> : copy.unknown}</dd>
          <dt>{copy.backend}</dt>
          <dd>{info.backendRevision ? <code>{info.backendRevision}</code> : copy.unknown}</dd>
          <dt>{copy.schema}</dt>
          <dd>{schema}</dd>
          <dt>{copy.api}</dt>
          <dd>{copy[info.connection]}</dd>
        </dl>
        {warnings.length > 0 && (
          <ul className="review-build__warnings">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        )}
      </details>
    </aside>
  );
}
