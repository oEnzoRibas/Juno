# Visual documentation standard

Use editable Draw.io masters for significant architecture diagrams. Commit the `.drawio`, `.svg`, `.pdf`, and same-name `.md` companion together in [architecture diagrams](../architecture/diagrams/README.md). Keep the master in plain XML where practical. Use independent nodes, vector icons, labels, boundaries, and orthogonal connectors. Avoid full-sheet images. Keep proposal status and architecture decisions explicit. Use PNG only for an identified raster requirement.

Prefer short labels, landscape layouts, consistent icon sizes and spacing, dashed boundaries, and accessible contrast. Use the [diagram color roles](../design/design-tokens.md) and accompanying Markdown to explain purpose, status, components, relationships, security, limitations, task, ADR, and last update. Include alternative text where embedded. Use cleared technology icons only and record licenses where applicable. The six initial masters use vector stencils derived from the owner-supplied diagram kit.

Preserve the credit “Juno — Original project creator: Enzo Ribas.” and “Developed with AI assistance.” in every visual. Preserve contributor attribution and record any third-party notices.

## Export and verify

Draw.io Desktop is optional documentation tooling. It is outside the application runtime. Version 32.7.4 generated the first exports. The commands below show the options for one master. Repeat for each changed diagram, using the executable name or absolute path on your operating system.

```sh
drawio --export --theme light --size page --output diagram.svg diagram.drawio
drawio --export --theme light --crop --output diagram.pdf diagram.drawio
```

Open the editable master, confirm node and connector editability, then render the SVG and the one-page PDF. Check canvas dimensions, alternate text references, labels, arrows, contrast, and creator credit. Verify vector output and retain representative text. Review exports before replacing the previous pair. Keep the master and any validated outputs if one format fails, and record the missing or stale export. [Draw.io export formats](https://www.drawio.com/docs/manual/export/export-diagram/) · [Draw.io Desktop](https://github.com/jgraph/drawio-desktop)

The [export script](../../scripts/diagrams/README.md) discovers masters, validates native structure and checks or regenerates both exports. Use it before review. Consider optional containerized export for reproducibility when contributors need cross-platform automation. Keep versions, fonts and export flags reproducible. Mermaid may be used for Markdown sketches with text descriptions. Significant views use the Draw.io master. See [ADR-0008](../architecture/adr/0008-editable-diagrams.md).

## Evidence inside the PR

Embed captures and diagrams directly in the review description using a GitHub-accessible pinned URL or attachment. Label historical before captures, actual after captures, integrated evidence and concepts with their scope and revision. For interactive frontend work include representative desktop and narrow views and meaningful theme and interaction states. For backend and operations prefer a flow, model, or applicable run evidence. Use synthetic data and remove credentials, private URLs, invitation tokens and personal data. The [maintainer review standard](git-workflow.md#maintainer-review-standard) governs review readiness.
