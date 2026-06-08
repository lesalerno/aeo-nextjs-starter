#!/usr/bin/env python3
"""
AEO Boilerplate — ci/validate_schema.py
JSON-LD validation gate. Runs in CI and FAILS the build if the schema is invalid.
Reproduces the Google Rich Results Test rules (stricter than generic validators).

Usage:
    python3 ci/validate_schema.py out/         # scans the generated static HTML
    python3 ci/validate_schema.py https://yoursite.com/product

A non-zero exit breaks the pipeline (GitHub Actions, etc).
"""
import json
import re
import sys
from pathlib import Path

REQUIRED = {
    "Organization": ["name", "url", "logo"],
    "LocalBusiness": ["name", "url", "address"],
    "BreadcrumbList": ["itemListElement"],
    "ItemList": ["itemListElement"],
    "ListItem": ["name", "position"],
    "PostalAddress": ["addressCountry"],
    "FAQPage": ["mainEntity"],
    "Question": ["name", "acceptedAnswer"],
}

NON_EMPTY = {"ItemList": "itemListElement", "FAQPage": "mainEntity"}

JSONLD_RE = re.compile(
    r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)


def validate_node(node, path="$"):
    errors = []
    if not isinstance(node, dict):
        return errors
    t = node.get("@type")

    # Required per @type
    if t in REQUIRED:
        for field in REQUIRED[t]:
            if not node.get(field):
                errors.append(f"{path} [{t}] missing required field: {field}")

    # Arrays that cannot be empty
    if t in NON_EMPTY:
        arr = node.get(NON_EMPTY[t])
        if not arr:
            errors.append(f"{path} [{t}] {NON_EMPTY[t]} is empty (invalid)")

    # Product requires offers OR review OR aggregateRating
    if t == "Product":
        if not any(node.get(k) for k in ("offers", "review", "aggregateRating")):
            errors.append(f"{path} [Product] needs offers, review or aggregateRating")

    # Offer requires a numeric price
    if t == "Offer":
        price = node.get("price", node.get("priceSpecification", {}).get("price"))
        if price is None:
            errors.append(f"{path} [Offer] without price")
        elif isinstance(price, str) and not price.replace(".", "").isdigit():
            errors.append(f"{path} [Offer] price is a non-numeric string: {price!r}")

    # Recurse
    for k, v in node.items():
        if isinstance(v, dict):
            errors += validate_node(v, f"{path}.{k}")
        elif isinstance(v, list):
            for i, item in enumerate(v):
                errors += validate_node(item, f"{path}.{k}[{i}]")
    return errors


def extract_jsonld(html):
    blocks = []
    for m in JSONLD_RE.finditer(html):
        try:
            blocks.append(json.loads(m.group(1).strip()))
        except json.JSONDecodeError as e:
            blocks.append({"__parse_error__": str(e)})
    return blocks


def validate_html(html, source):
    errors = []
    for block in extract_jsonld(html):
        if "__parse_error__" in block:
            errors.append(f"{source}: invalid JSON-LD: {block['__parse_error__']}")
            continue
        nodes = block if isinstance(block, list) else [block]
        for n in nodes:
            errors += validate_node(n, source)
    return errors


def main():
    if len(sys.argv) < 2:
        print("usage: validate_schema.py <out_dir|url>")
        sys.exit(2)

    target = sys.argv[1]
    all_errors = []

    if target.startswith("http"):
        import urllib.request

        html = urllib.request.urlopen(target).read().decode("utf-8", "ignore")
        all_errors += validate_html(html, target)
    else:
        for f in Path(target).rglob("*.html"):
            all_errors += validate_html(f.read_text("utf-8", "ignore"), str(f))

    if all_errors:
        print(f"\n[X] {len(all_errors)} schema issue(s):\n")
        for e in all_errors:
            print(f"  - {e}")
        sys.exit(1)
    print("[OK] Valid JSON-LD across all pages")


if __name__ == "__main__":
    main()
