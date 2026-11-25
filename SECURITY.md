# Security policy

## Private reporting

Send vulnerability reports privately to a maintainer through an existing trusted channel. If the repository later enables GitHub private vulnerability reporting, use **Security → Report a vulnerability**. Until a private channel is published, use [support](SUPPORT.md) to request a private contact without including vulnerability details.

Include the affected revision, impact, scope, and a description using synthetic or redacted data. Keep credentials, personal data, and confidential organizational details out of reports and public issues. Coordinate disclosure timing privately with maintainers.

## Triage and support

Maintain a private record of the report, triage severity and affected data, assign an owner, and coordinate remediation and disclosure. Restrict access to case details and preserve only the evidence needed. Publish a supported-version policy and a private reporting route before the first public release. During Phase 0, maintainers can review reports about the repository foundation.

See the [preliminary threat model](docs/security/threat-model.md) for planned controls and validation requirements.

## Independent installations

Deployment operators manage infrastructure, tenant access, data protection, TLS, patching, backups and availability. Bootstrap administrators belong to their installation. Upstream receives no automatic administrator access or tenant data. Use the [deployment guidance](docs/deployment/README.md) and report reproducible software vulnerabilities through the private reporting route above.
