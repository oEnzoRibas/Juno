#!/usr/bin/env python3
# Resolves, validates, and regenerates Juno architecture diagram exports.
# Project: Juno. Original project creator: Enzo Ribas.
# Copyright (c) 2026 Enzo Ribas
# SPDX-License-Identifier: MIT
# Developed with AI assistance.

"""Export native Draw.io masters without installing application dependencies."""

import argparse
import re
import shutil
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from tempfile import TemporaryDirectory


REPOSITORY = Path(__file__).resolve().parents[2]
ROOTS = (REPOSITORY / "docs/architecture/diagrams", REPOSITORY / "docs/design/mockups")
CREDIT = "Original project creator: Enzo Ribas"


def inspect_master(path):
    """Require editable pages, connector endpoints, and local vector elements."""
    document = ET.parse(path).getroot()
    models = document.findall("./diagram/mxGraphModel")
    if document.tag != "mxfile" or len(models) != 1:
        raise ValueError("expected one readable, uncompressed Draw.io page")
    model = models[0]
    entries = model.findall("./root/mxCell")
    ids = {entry.get("id") for entry in entries}
    nodes = [entry for entry in entries if entry.get("vertex") == "1"]
    edges = [entry for entry in entries if entry.get("edge") == "1"]
    labels = " ".join(entry.get("value", "") for entry in nodes)
    if None in ids or len(ids) != len(entries) or len(nodes) < 3 or not edges:
        raise ValueError("expected distinct editable nodes and connectors")
    if CREDIT not in labels or "Developed with AI assistance" not in labels:
        raise ValueError("missing project attribution")
    for entry in entries:
        for attribute in ("parent", "source", "target"):
            if entry.get(attribute) is not None and entry.get(attribute) not in ids:
                raise ValueError(f"unknown {attribute} on cell {entry.get('id')}")
        if re.search(r"(?:^|;)image=https?://", entry.get("style", "")):
            raise ValueError("external image URLs are unsupported")
    return int(model.attrib["pageWidth"]), int(model.attrib["pageHeight"])


def inspect_exports(svg, pdf, size):
    """Check required files, vector SVG output, page bounds, and PDF structure."""
    element = ET.parse(svg).getroot()
    expected = f"0 0 {size[0]} {size[1]}"
    if element.tag != "{http://www.w3.org/2000/svg}svg" or element.get("viewBox") != expected:
        raise ValueError("SVG canvas does not match the source page")
    if CREDIT not in svg.read_text(encoding="utf-8"):
        raise ValueError("exported SVG lacks project attribution")
    if any(node.tag.endswith(("}image", "}foreignObject")) for node in element.iter()):
        raise ValueError("SVG must use portable vector shapes")
    data = pdf.read_bytes()
    if not data.startswith(b"%PDF-") or not data.rstrip().endswith(b"%%EOF"):
        raise ValueError("invalid PDF header or trailer")


def export_one(executable, path, size, timeout):
    """Write both exports only after the newly generated pair passes checks."""
    with TemporaryDirectory(prefix="juno-diagram-") as work:
        svg = Path(work) / path.with_suffix(".svg").name
        pdf = Path(work) / path.with_suffix(".pdf").name
        for target, flags in ((svg, ("--size", "page")), (pdf, ("--crop",))):
            command = [executable, "--disable-update", "--export", "--theme", "light"]
            command.extend((*flags, "--output", str(target), str(path)))
            subprocess.run(command, check=True, timeout=timeout)
        inspect_exports(svg, pdf, size)
        shutil.copyfile(svg, path.with_suffix(".svg"))
        shutil.copyfile(pdf, path.with_suffix(".pdf"))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--drawio", default="drawio", help="Draw.io Desktop command or executable path")
    parser.add_argument("--check", action="store_true", help="check existing masters and exports")
    parser.add_argument("--timeout", type=int, default=60, help="seconds allowed for each export")
    parser.add_argument("masters", nargs="*", type=Path, help="specific repository masters to process")
    options = parser.parse_args()
    if options.timeout < 1:
        parser.error("--timeout must be a positive integer")
    masters = [path.resolve() for path in options.masters] or sorted(path for root in ROOTS for path in root.rglob("*.drawio"))
    if not masters:
        parser.error("no Draw.io masters found")
    executable = None if options.check else shutil.which(options.drawio)
    if not options.check and executable is None:
        parser.error("Draw.io Desktop unavailable. Supply --drawio or run --check.")
    errors = 0
    for path in masters:
        if path.suffix != ".drawio" or not any(path.is_relative_to(root) for root in ROOTS):
            print(f"{path}: expected a repository diagram or mockup master", file=sys.stderr)
            errors += 1
            continue
        try:
            size = inspect_master(path)
            if not path.with_suffix(".md").is_file():
                raise ValueError("missing Markdown companion")
            if options.check:
                inspect_exports(path.with_suffix(".svg"), path.with_suffix(".pdf"), size)
            else:
                export_one(executable, path, size, options.timeout)
            print(f"Verified {path.relative_to(REPOSITORY)}", flush=True)
        except (OSError, ValueError, KeyError, ET.ParseError, subprocess.SubprocessError) as error:
            print(f"{path.name}: {error}", file=sys.stderr)
            errors += 1
    return int(errors != 0)


if __name__ == "__main__":
    sys.exit(main())
