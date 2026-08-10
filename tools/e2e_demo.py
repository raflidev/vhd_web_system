#!/usr/bin/env python
"""E2E untuk demo page vhd_web_system: klik 5 sample, verifikasi klasifikasi."""
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:3003/demo"
EXPECT = {"AS": "AS", "MR": "MR", "MS": "MS", "MVP": "MVP", "N": "N"}

ok = True
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(BASE)
    page.wait_for_function(
        "Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Sample AS') && !b.disabled)",
        timeout=60000,
    )
    print("MODEL READY")
    for label, want in EXPECT.items():
        page.click(f"button:has-text('Sample {label} ·')")
        page.wait_for_function(
            "document.body.textContent.includes('keyakinan')", timeout=30000
        )
        h2 = page.eval_on_selector("h2", "el => el.textContent")
        conf = page.eval_on_selector(
            "div.text-right p", "el => el.textContent"
        )
        top = h2.split("(")[-1].split(")")[0]
        verdict = "PASS" if top == want else "FAIL"
        if verdict == "FAIL":
            ok = False
        print(f"{label}: top={top} conf={conf} -> {verdict}")
        if label != "N":
            page.click("button:has-text('Analisis file lain')")
            page.wait_for_function(
                "document.querySelector('input[type=file]') !== null", timeout=10000
            )
    print("JS errors:", errors if errors else "none")
    print("E2E:", "ALL PASS" if ok and not errors else "SOME FAIL")
    browser.close()
sys.exit(0 if ok and not errors else 1)
