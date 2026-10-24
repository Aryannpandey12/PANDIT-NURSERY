"""Download species-relevant reference images for the sample catalog from Wikipedia.

The page URL is retained in public/plants/sources.json for attribution/review. Run
after installing Pillow with: python scripts/fetch-plant-images.py
Images and catalog entries remain illustrative; they do not depict nursery stock.
"""
from __future__ import annotations

import concurrent.futures
import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "src" / "data.ts"
OUT = ROOT / "public" / "plants"
USER_AGENT = "PanditJiNurseryCatalogDemo/1.0 (image attribution retained in project)"


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFD", value)
    value = "".join(char for char in value if not unicodedata.combining(char))
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", value.lower()))


def original_file_url(thumbnail: str) -> str:
    """Convert a Commons thumbnail URL to the original file URL when possible."""
    parsed = urllib.parse.urlsplit(thumbnail)
    parts = parsed.path.split("/")
    if "thumb" not in parts or len(parts) < 3:
        return thumbnail
    index = parts.index("thumb")
    original_parts = parts[:index] + parts[index + 1:-1]
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, "/".join(original_parts), parsed.query, ""))


def entries():
    text = DATA_FILE.read_text(encoding="utf-8")
    section = text.split("const seed:", 1)[1].split("\n]\n", 1)[0]
    rows = []
    for line in section.splitlines():
        line = line.strip()
        if not line.startswith("["):
            continue
        values = re.findall(r"'([^']*)'", line)
        if len(values) < 3:
            continue
        rows.append((slugify(values[1]), values[1], values[2]))
    return rows


def fetch(entry):
    slug, title, scientific = entry
    if not scientific:
        return slug, None
    for candidate in dict.fromkeys([scientific, title]):
      page_title = candidate.replace(" ", "_")
      url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(page_title, safe="_")
      request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
      try:
        summary = None
        for attempt in range(4):
          try:
            with urllib.request.urlopen(request, timeout=25) as response:
              summary = json.load(response)
            break
          except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 3:
              raise
            time.sleep(2 + attempt * 3)
        if summary is None:
          continue
        thumbnail = summary.get("thumbnail", {}).get("source")
        page = summary.get("content_urls", {}).get("desktop", {}).get("page")
        if not thumbnail or not page:
          continue
        # Prefer the original, then resize locally so product detail photos are
        # sharper than the small summary thumbnail. SVGs retain the API raster.
        image_url = original_file_url(thumbnail)
        if image_url.lower().endswith(".svg"):
            image_url = thumbnail
        image_request = urllib.request.Request(image_url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(image_request, timeout=45) as response:
                raw = response.read()
        except (urllib.error.URLError, TimeoutError, OSError):
            image_url = thumbnail
            image_request = urllib.request.Request(image_url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(image_request, timeout=35) as response:
                raw = response.read()
        tmp = OUT / f"{slug}.download"
        tmp.write_bytes(raw)
        image = Image.open(tmp).convert("RGB")
        image.thumbnail((960, 960), Image.Resampling.LANCZOS)
        image.save(OUT / f"{slug}.webp", "WEBP", quality=83, method=6)
        tmp.unlink(missing_ok=True)
        return slug, {"title": summary.get("title", title), "page": page, "image": thumbnail, "local": f"/plants/{slug}.webp"}
      except (urllib.error.URLError, TimeoutError, OSError, ValueError, KeyError) as error:
        last_error = str(error)[:180]
    return slug, {"error": locals().get("last_error", "No Wikimedia thumbnail")}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows = entries()
    previous = {}
    manifest = OUT / "sources.json"
    if manifest.exists():
        try:
            previous = json.loads(manifest.read_text(encoding="utf-8"))
        except ValueError:
            previous = {}
    results = dict(previous)
    refresh = "--refresh" in sys.argv
    pending = [entry for entry in rows if refresh or not ((OUT / f"{entry[0]}.webp").exists() and previous.get(entry[0], {}).get("local"))]
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        for slug, result in executor.map(fetch, pending):
            if result and "local" in result or slug not in results:
                results[slug] = result
            print(f"{'OK' if result and 'local' in result else 'FALLBACK'} {slug}")
            time.sleep(0.015)
    (OUT / "sources.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    success = sum(bool(item and "local" in item) for item in results.values())
    print(f"Downloaded {success} of {len(rows)} catalog images. Review fallback entries in {OUT / 'sources.json'}.")


if __name__ == "__main__":
    main()
