import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "./juno-api";
import { loadReviewBuildInfo } from "./review-build-info";

vi.mock("./juno-api", () => ({ apiRequest: vi.fn() }));

const frontend = "1".repeat(40);
const backend = "2".repeat(40);
const reviewEnv = { JUNO_REVIEW_BUILD_INFO: "1", JUNO_REVIEW_ENVIRONMENT: "pr-104" };
const baked = { revision: frontend, sourceState: "clean" };

function builds(revision: unknown, environment: unknown = "pr-104", schemaVersion: unknown = 9) {
  vi.mocked(apiRequest).mockResolvedValue(Response.json({ revision, environment, schemaVersion }));
}

describe("review build information", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("stays disabled by default and never probes in that case", async () => {
    expect(await loadReviewBuildInfo({}, baked)).toBeNull();
    expect(await loadReviewBuildInfo({ JUNO_REVIEW_BUILD_INFO: "true" }, baked)).toBeNull();
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it("reports the baked frontend and the responding backend without mismatches", async () => {
    builds(frontend);
    expect(await loadReviewBuildInfo(reviewEnv, baked)).toEqual({
      environment: "pr-104",
      frontendRevision: frontend,
      backendRevision: frontend,
      schemaVersion: 9,
      connection: "connected",
      revisionMismatch: false,
      environmentMismatch: false,
      comparisonUnavailable: false,
      dirtySource: false,
    });
    expect(apiRequest).toHaveBeenCalledWith("build-info", {
      redirect: "error",
      signal: expect.any(AbortSignal),
    });
  });

  it("uses the compiled frontend revision when Compose leaves the optional pin empty", async () => {
    builds(backend);
    expect(
      await loadReviewBuildInfo({ ...reviewEnv, JUNO_REVIEW_EXPECTED_API_REVISION: "" }, baked),
    ).toMatchObject({ revisionMismatch: true, comparisonUnavailable: false });
  });

  it("honors a different explicitly expected backend revision in split builds", async () => {
    builds(backend);
    expect(
      await loadReviewBuildInfo({ ...reviewEnv, JUNO_REVIEW_EXPECTED_API_REVISION: backend }, baked),
    ).toMatchObject({ backendRevision: backend, revisionMismatch: false, comparisonUnavailable: false });
  });

  it("does not attribute a baked revision to mutable development source", async () => {
    builds(frontend);
    expect(
      await loadReviewBuildInfo(
        { ...reviewEnv, JUNO_REVIEW_LIVE_SOURCE: "1" },
        { ...baked, sourceState: "dirty" },
      ),
    ).toMatchObject({
      frontendRevision: null,
      backendRevision: frontend,
      comparisonUnavailable: true,
      dirtySource: false,
    });
  });

  it("flags independently detected revision and environment mismatches", async () => {
    builds(backend, "another-pr");
    expect(await loadReviewBuildInfo(reviewEnv, { ...baked, sourceState: "dirty" })).toMatchObject({
      revisionMismatch: true,
      environmentMismatch: true,
      comparisonUnavailable: false,
      dirtySource: true,
    });
  });

  it("shows unavailable historical provenance and ignores untrusted metadata", async () => {
    builds("http://private.example.invalid/token", "../../private", "9");
    expect(
      await loadReviewBuildInfo(
        { ...reviewEnv, JUNO_REVIEW_ENVIRONMENT: "C:\\private", JUNO_REVIEW_EXPECTED_API_REVISION: "unknown" },
        { revision: null, sourceState: "unavailable" },
      ),
    ).toMatchObject({
      environment: null,
      frontendRevision: null,
      backendRevision: null,
      schemaVersion: null,
      connection: "connected",
      revisionMismatch: false,
      environmentMismatch: false,
      comparisonUnavailable: true,
    });
  });

  it.each([404, 503])("distinguishes reported HTTP %s from a failed request", async (status) => {
    vi.mocked(apiRequest).mockResolvedValue(new Response(null, { status }));
    expect(await loadReviewBuildInfo(reviewEnv, baked)).toMatchObject({
      connection: "unavailable",
      comparisonUnavailable: true,
    });
    vi.mocked(apiRequest).mockRejectedValue(new Error("network error"));
    expect(await loadReviewBuildInfo(reviewEnv, baked)).toMatchObject({
      connection: "disconnected",
      comparisonUnavailable: true,
    });
  });

  it("handles malformed JSON from a responding origin", async () => {
    vi.mocked(apiRequest).mockResolvedValue(new Response("invalid"));
    expect(await loadReviewBuildInfo(reviewEnv, baked)).toMatchObject({
      connection: "unavailable",
      backendRevision: null,
    });
  });
});
