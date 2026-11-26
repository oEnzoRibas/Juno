# Public reference study and component inventory

Access date 2026-11-25, America/Sao_Paulo. The browser used Chromium on desktop with 1280 × 900 and 390 × 900 CSS px viewports. The narrow viewport represents responsive web, not a native device. The audit used public content and did not enter an authenticated learning session.

| Reference | Access mode and scope |
| --- | --- |
| [Duolingo home](https://www.duolingo.com/) | Direct browser, both viewports, Portuguese landing page. Account and trial controls measured 50 px high with 12 px corner radius and bold type. The desktop sample also exposed a site-language control. The script measured computed box-shadow as none on sampled elements. |
| [Web learning route](https://www.duolingo.com/learn) | Direct browser, both viewports. Redirected to the public home page. The authenticated desktop and responsive application shelves and learning controls remain uninspected. |
| [Design index](https://design.duolingo.com/) and [Typography](https://design.duolingo.com/identity/typography) | HTTP source retrieval at no viewport. Both redirected to the design blog during this audit. An indexed prior typography result named Feather Bold and DIN Next Rounded, with weight and scale used to differentiate headings. No current font metrics inferred from it. |
| [Handbook](https://handbook.duolingo.com/) | Official indexed excerpt names the Juicy direction. The direct content retrieval exceeded its size limit. The cited description is historical context. |
| [Core tabs](https://blog.duolingo.com/core-tabs-redesign/) | Official article and published native app imagery. Screens show repeated bottom destinations, clear top-level headers and rounded cards. The source documents aligning the header, typography, surface hierarchy and spacing across tabs. Observed on published stills and recordings rather than in a running native build. |
| [Shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/) | Official historical article. Its description of the 2018 visual shift supports rounded geometry and stronger separations. It supplies no present-day numerical spec. |
| Public authentication | Direct guessed /log_in returned an error page. Attempt to open the visible account CTA in the browser timed out. No direct claims are made about the authentication fields or modal behavior. |

## Published product evidence

The follow-up sought actual product screens. Direct inspection of the signed-in web interface and its interaction states remains limited by the absence of an authorized authenticated session. The official screenshots below document authenticated product surfaces. Their publication dates, viewport sizes, and recorded state may differ from a current session.

| Official source | Product evidence | Decision for Juno |
| --- | --- | --- |
| [Account and privacy settings walkthrough](https://blog.duolingo.com/introvert-language-learning-tips/) | The desktop web instructions open Settings from More in the side rail. The mobile browser instructions use the Profile tab in the bottom navigation and the settings gear. The published images show entry points and settings grouping. | Use a persistent labeled desktop rail and a dedicated mobile account page. Keep language and theme visibly labeled. |
| [Product walkthrough](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) | The native app walkthrough shows a repeated bottom navigation, a profile settings entry, and grouped preferences. Compact labels and prominent action controls stand out in the published compositions. | Preserve stable mobile destinations and move deeper workspace administration into a contextual drawer. |
| [Core tabs design study](https://blog.duolingo.com/core-tabs-redesign/) | Published native screens show recurring header, spacing, typography, selected tabs, and rounded card treatments. | Use consistent canvas rhythm, quieter administrative surfaces, and bolder headings while retaining Juno's table density. |
| [Server-driven UI case study](https://blog.duolingo.com/server-driven-ui/) | The article documents reusable native card composition. It does not specify browser tokens or interaction states. | Define independent Juno card, button, spacing and feedback rules and exercise them in the playground. |

Authenticated web compact behavior, proportions at breakpoints, exact font metrics, tactile depth, focus, hover, pressed and disabled states could not be measured. The playground tests Juno's proposed behavior directly using its own design tokens. An authorized session or a maintainer-led demonstration would allow direct comparison of the remaining product states.


## Comparison matrix

**Direct web** means measured in the public Chrome run. **Published native** means a still or narrative from the source above. **Unverified** means no reference behavior was established. All V2 implementation guidance in the final column is an original proposal.

| Component | Duolingo observation and limit | Juno translation |
| --- | --- | --- |
| Typography, weight, hierarchy | Direct web uses a branded sans with visibly heavier CTA labels and distinct lead headings. Historic guidance names two typefaces. | Consider rounded display headings with Nunito, keep system UI for data and body. |
| Grid, widths, spacing | Direct web switches between a desktop composition and narrow stacked sections. Native article describes a shared header rhythm. Exact product breakpoints and scales unverified. | Keep 4–48 px scale, aligned form columns, dense tables and flexible content widths. |
| Radius, border, color and surfaces | Public controls measure 12 px corners. Native article shows rounded cards against a flat page and restrained section grouping. No full token extraction. | Calmer purple and ink surfaces, stronger actionable outlines, normal and dark semantic roles. |
| Iconography, motion and feedback | Published native examples use consistent icons per destination and illustrations for learning context. Current reduced-motion and transitions unverified. | Original line icons with labels, subtle press feedback with no animation required. |
| Primary, outline, secondary | Direct public CTAs separate a more emphasized path from account entry. Published native uses prominent one-step actions. | Primary fill and anchored 3 px edge for the next safe action, outlined secondary and text cancel. |
| Pressed depth, hover and focus | Public shape/depth can be visible in imagery. Measured outer defaults had no CSS box shadow. Pressed, hover and focus rules remain unverified. | Stable box dimensions, reduced depth on press, strong focus, higher-contrast hover and no required motion. |
| Icon, destructive, pending and disabled buttons | Protected/product states unverified. | Accessible names, 44–48 px targets, text in confirmation, stable loading footprint and native disabled rules. |
| Text, password, errors, help | Public authentication interaction was unavailable in this run. | Persistent labels, supported password reveal/autofill, association of help/error, and announced server errors. |
| Select, search, checks and radio | Authenticated behavior unverified. | Native selects by default, search with clear and explicit labels, fieldsets for check and radio groups. |
| Desktop sidebars and adaptive application breakpoints | Unauthenticated learning URL redirected. Product desktop rail unverified. | Original labeled rail with compact mode, keyboard usability and matched workspace hierarchy. |
| Mobile navigation and current state | Published native examples use a repeated bottom bar and visually distinguish the current destination. Responsive web app navigation unverified. | Keep three frequent labeled destinations on narrow screens; use contextual nav for admin tasks. |
| Account, profile, organization switching | Published native article covers profile presentation; account popover mechanics and org switching unverified. | Full mobile account route, scoped organization list, membership role text. |
| Breadcrumbs and contextual Back | Unverified as reusable product patterns. | Route-aware breadcrumb on desktop and direct Back on narrow pages; preserve org, language, filters and cursor. |
| Menus, dialogs, popovers and tooltips | Current positioning, keyboard and Escape semantics unverified. | Collision detection, drawer scrollbar and focus lifecycle. Icon tooltips supplement accessible names. |
| Notifications, status, empty, loading and error | Public native imagery shows progress and reaction feedback. Exact announcements and other states unverified. | Live status only when appropriate, actionable errors, labeled loading skeleton, result-aware empty state. |
| Cards, lists, tables, sections, progress and badges | Native article shows soft cards, clearer feed hierarchy and progress. Data-table behavior unverified. | Cards for overview and role. Dense semantic tables for admin data. Show progress only if real data exists. Badges use status words. |

Nunito is a rounded-terminal sans with SIL Open Font License 1.1, documented upstream. Prefer locally hosted subsets if approved and retain the upstream license and notices. Validate PT-BR coverage and compact headings against the current system stack. [Nunito project and license](https://github.com/googlefonts/nunito)

Juno — Original project creator: Enzo Ribas. Developed with AI assistance.
