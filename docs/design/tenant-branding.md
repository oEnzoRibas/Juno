# Tenant branding requirements

**Status:** Initial organization name and workspace accent are implemented. Additional brand settings remain planned. The [approved Juno identity](brand-identity.md) supplies the default experience. Every Junior Enterprise can customize its own appearance within the same component and accessibility rules.

| Area        | Tenant settings                                                                       |
| ----------- | ------------------------------------------------------------------------------------- |
| Identity    | Organization name, logo, favicon, welcome messages and organization-specific artwork. |
| Theme       | Primary, secondary and accent colors, and light and dark theme preferences.           |
| Recognition | Virtual currency name and symbol, achievement branding and reward branding.           |

Use [semantic tokens](design-tokens.md) and scoped configuration. Validate colors as structured values, welcome messages as plain text, and media by format, byte size, dimensions and decoded contents on the server. Start with a narrow raster allowlist for tenant uploads. Disallow arbitrary CSS, HTML and executable content. Generate accessible role pairs or apply safe defaults and explain the fallback in preview. Check contrast and component states in both themes before publishing.

Authorize theme and media writes against the active tenant. Scope asset references, storage, and caches to that tenant and invalidate affected theme entries after updates. Preserve consistent layout and interactions. Use two synthetic tenants to verify that invalid and unauthorized changes are rejected and that published changes reach only the intended tenant.

The current workspace uses the tenant accent only for its decorative border. Action, text and focus colors use the Juno theme, including when an accent is close to the panel color. See the [form and workspace styling](design-system/forms.md).
