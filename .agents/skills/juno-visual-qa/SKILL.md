---
name: juno-visual-qa
description: Review rendered Juno screens or character assets for visual regressions, accessibility and export fidelity. Use when collecting or assessing visual evidence for design review.
---

# Review Juno visual evidence

Identify the candidate revision, surface and expected behavior. Keep an approved reference, a candidate capture and a human decision separately identifiable. Record findings with the smallest reproduction, observed result and impact.

## Application screens

Verify the running candidate using the [exact-head review guide](../../../docs/testing/juno-review-runtime.md). Use synthetic fixtures. Compare the actual route and interactions to the [V2 implementation guide](../../../docs/design/design-system-v2-implementation.md). Keep credentials and invitation links out of captures.

Use the guide's viewport matrix for shell changes. Test either side of a changed breakpoint, keyboard-only focus order and return, 200% zoom, reduced motion and reflow. Include both themes, locales and the longest realistic content for affected controls. Inspect effective foreground/background contrast and accessible names, particularly in pending, error and disabled states. For scoped views, exercise a permitted account and an out-of-scope fixture. Record the browser, viewport, route, role and test state alongside each finding. Use the [existing browser suite](../../../tests/browser) for regression coverage. Report manual, automated and untested observations separately.

## Character artwork

Use the [brand identity](../../../docs/design/brand-identity.md) and the selected character sheet if one exists. Compare poses at a common registration point. Inspect silhouette, proportions and expression at the intended smallest display size, both in monochrome and on light and dark surfaces. Inspect transparent edges at native scale for halos, cropping and stray pixels.

For source-editability claims, open a copy in the authoring application, change one named facial or limb component, save, reopen and compare the rendered result with the baseline. Record which parts changed, export dimensions, alpha and profile. Confirm placement preserves task controls and equivalent text when the artwork communicates meaning. Identify unresolved aesthetic decisions for the maintainer.
