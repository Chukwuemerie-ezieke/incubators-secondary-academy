#!/usr/bin/env python3
"""
Build script: rewrites pages inside ufuma/ and kaduna/ folders
- Asset references (style.css, app.js, *.png, *.jpg, etc.) → ../assetname
- Page-to-page relative links stay relative (within same campus folder)
- Canonical URLs, og:url, JSON-LD URLs → campus subdomain
- For Kaduna: replace Ufuma-specific text with placeholders on per-campus pages

Run from repo root: python3 _build_campus_pages.py
"""
import os
import re
from pathlib import Path

REPO = Path(__file__).parent
ASSETS = [
    "style.css", "app.js", "cms-config.js", "cms-loader.js",
    "school-logo.png", "logo-header.png", "logo-footer.png",
    "favicon-32x32.png", "apple-touch-icon.png",
    "hero-bg.jpg", "academics-img.jpg", "boarding-img.jpg", "discipleship-img.jpg",
]

PAGES = [
    "index.html", "about.html", "academics.html", "admissions.html",
    "alumni.html", "boarding.html", "contact.html", "discipleship.html",
    "events.html", "gallery.html", "privacy-policy.html",
]

CAMPUS_CONFIG = {
    "ufuma": {
        "name": "Ufuma Campus",
        "subdomain": "ufuma.incubatorsecondaryacademy.sch.ng",
        "location_short": "Ufuma, Anambra State",
        "is_placeholder": False,
    },
    "kaduna": {
        "name": "Kaduna Campus",
        "subdomain": "kaduna.incubatorsecondaryacademy.sch.ng",
        "location_short": "Kaduna [TO BE UPDATED]",
        "is_placeholder": True,
    },
}


def rewrite_assets(html: str) -> str:
    """Prefix asset references with ../"""
    for asset in ASSETS:
        # href="style.css" → href="../style.css"
        html = re.sub(rf'(href|src)="{re.escape(asset)}"', rf'\1="../{asset}"', html)
    return html


def rewrite_canonicals(html: str, campus_key: str) -> str:
    """Update canonical, og:url, JSON-LD URLs to point to campus subdomain."""
    cfg = CAMPUS_CONFIG[campus_key]
    sub = cfg["subdomain"]
    # Replace https://www.incubatorsecondaryacademy.sch.ng with https://<subdomain>
    html = html.replace(
        "https://www.incubatorsecondaryacademy.sch.ng",
        f"https://{sub}",
    )
    return html


def add_campus_badge(html: str, campus_key: str) -> str:
    """Add a campus name badge to the top contact bar in the header."""
    cfg = CAMPUS_CONFIG[campus_key]
    name = cfg["name"]
    # Insert a campus indicator + switch link into the top-bar after first <span>Ufuma...</span>
    # We replace the existing 'Ufuma, Anambra State' text in the top bar with the campus name + switch link.
    # Pattern: <span>Ufuma, Anambra State</span>  appears in top-bar location only first time
    # We'll prepend a "Switch campus" link before the closing </div> of the top-bar.
    # Simpler: add a small element via JS-friendly anchor. For now, add a CSS class hook by injecting
    # a campus-badge attribute on <body> so the existing CSS/JS can react if desired.
    if 'data-campus=' not in html:
        html = re.sub(r'<body([^>]*)>', rf'<body\1 data-campus="{campus_key}">', html, count=1)
    return html


def add_switch_campus_link(html: str, campus_key: str) -> str:
    """Inject a 'Switch campus' link into the header top bar."""
    other = "kaduna" if campus_key == "ufuma" else "ufuma"
    other_name = CAMPUS_CONFIG[other]["name"]
    other_url = f"https://{CAMPUS_CONFIG[other]['subdomain']}/"
    main_url = "https://www.incubatorsecondaryacademy.sch.ng/"
    # Find the topbar contact div and append a switch link.
    # The top bar uses class "header__topbar" or similar — insert before its closing div.
    # We'll append a small inline link block right after the very first <header element open
    # by injecting a marker-friendly snippet. Since structure varies, we instead add a fixed
    # banner via JS-injected element using a <script> at the top of body. But simplest:
    # Just insert a small <div class="campus-switch-bar"> as the very first element inside <body>.
    snippet = (
        f'<div class="campus-switch-bar" style="background:#0a3d62;color:#fff;'
        f'padding:6px 16px;font-size:13px;text-align:center;">'
        f'<strong>{CAMPUS_CONFIG[campus_key]["name"]}</strong> · '
        f'<a href="{other_url}" style="color:#fff;text-decoration:underline;">Switch to {other_name}</a> · '
        f'<a href="{main_url}" style="color:#fff;text-decoration:underline;">All campuses</a>'
        f'</div>'
    )
    # Insert right after <body ...>
    html = re.sub(r'(<body[^>]*>)', r'\1\n' + snippet, html, count=1)
    return html


def kaduna_placeholders(html: str) -> str:
    """For Kaduna pages, replace Ufuma-specific identifiers with placeholders.
    Conservative: only replace clear identifiers, leave shared mission/vision text alone.
    """
    replacements = [
        # Address-like phrases
        ("Ufuma, Orumba North LGA, Anambra State, Nigeria", "Kaduna [Address — to be updated], Kaduna State, Nigeria"),
        ("Ufuma, Anambra State", "Kaduna [TO BE UPDATED]"),
        ("Ufuma, Orumba North LGA, Anambra State", "Kaduna [TO BE UPDATED]"),
        # Phone (only the specific number — keep mailto neutral)
        ("+234 803 365 4802", "+234 [PHONE — to be updated]"),
        ("+2348033654802", "+234[PHONE]"),
        ("tel:+2348033654802", "tel:+234"),
        # Address fields in JSON-LD
        ('"streetAddress": "Ufuma"', '"streetAddress": "[Kaduna address — to be updated]"'),
        ('"addressRegion": "Anambra State"', '"addressRegion": "Kaduna State"'),
        ('"addressLocality": "Ufuma"', '"addressLocality": "Kaduna"'),
        # Emails — keep generic info@ but switch the gmail one if any references the campus uniquely
        # (keep info@ shared until user provides a Kaduna-specific one)
    ]
    for old, new in replacements:
        html = html.replace(old, new)
    return html


def build_for_campus(campus_key: str):
    folder = REPO / campus_key
    for page in PAGES:
        path = folder / page
        if not path.exists():
            print(f"  skip {path} (missing)")
            continue
        html = path.read_text(encoding="utf-8")
        html = rewrite_assets(html)
        html = rewrite_canonicals(html, campus_key)
        html = add_campus_badge(html, campus_key)
        html = add_switch_campus_link(html, campus_key)
        if CAMPUS_CONFIG[campus_key]["is_placeholder"]:
            html = kaduna_placeholders(html)
        path.write_text(html, encoding="utf-8")
        print(f"  built {path.relative_to(REPO)}")


if __name__ == "__main__":
    for key in CAMPUS_CONFIG:
        print(f"\nBuilding {key}...")
        build_for_campus(key)
    print("\nDone.")
