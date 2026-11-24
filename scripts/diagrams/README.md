# Diagram export tooling

Python 3.10+ and Draw.io Desktop are optional documentation tools. Juno application images and development containers do not require them. The initial review used Draw.io Desktop 32.7.4. Use your OS-specific executable path on Windows or macOS. On a Linux host without a display, evaluate running with `xvfb-run` or an optional documentation-only container before enabling CI.

From the repository root, check native structures and existing outputs or regenerate them:

```sh
python scripts/diagrams/export-diagrams.py --check
python scripts/diagrams/export-diagrams.py --drawio /path/to/drawio
```

The default scan includes architecture diagrams and design mockups. Pass specific .drawio paths after options to regenerate selected views. The tool preserves the directory layout, validates both temporary exports before writing them, and returns a failure code if tooling, a companion or an export is missing. It checks cell references, attribution, SVG page bounds and PDF markers. A clean check reports structural evidence. After editing a master, regenerate and visually review both formats. PDF metadata may vary by tool version or export time. See the [visual standard](../../docs/development/visual-documentation.md).
