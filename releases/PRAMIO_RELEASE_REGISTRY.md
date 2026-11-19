# PRAMIO RU — Release registry & preservation rules

Updated: 2026-11-19. This file is the release ledger; do not confuse these archive branches with production deployments. The user deploys manually on Timeweb by unpacking a single ZIP **into public_html**. No installers, no manual CSS/JS links.

## Authoritative source hierarchy
1. Current production `public_html` snapshot: authoritative for existing portfolio entries, pages and assets.
2. Complete backups of working production, labeled with deploy dates.
3. Prior ZIP release packages and their manifests, compared rather than blindly applied.
4. GitHub branches (some GitHub source branches are out of date: `main` was 2026-10-14).
Never overwrite `portfolio/index.html` or root `index.html` with an older file unless all intervening changes are merged and proven preserved.

## Known release ZIPs
- R23 (2026-11-16) — `PRAMIO-R23-CHUDOTVORTSY-PORTFOLIO.zip` in user Library `/PRAMIO RU/`. Includes portfolio index + "Татар-Ча" and "Чудотворцы", **NOT FLORA**. This is **not** a valid complete baseline for current production.
- R46 — branch `r46-full-photos-20261118`, `releases/PRAMIO-R46-FULL-BATUMI-LOCAL-PHOTOS.zip` — Batumi teaser original, 4 JPEGs.
- R47 — branch `r47-full-20261118`, `releases/PRAMIO-R47-UNZIP-ONLY-NEXT-BATUMI-FULL.zip` — replaced portfolio index based on older R23; potential portfolio regression.
- R47 repacked — branch `release/pramio-r47-repacked-20261118`, `releases/PRAMIO-R47-REPACK-PUBLIC_HTML-ROOT-20261118.zip`.
- R48 — branch `release/pramio-r48-landscape-seo-20261118`, `releases/PRAMIO-R48-FULL-UNZIP-LANDSCAPE-NAV-SEO.zip` — scene navigation and chip links; portfolio still inherited R23/R47.
- R49 — branch `release/pramio-r49-flora-batumi-links-20261118`, `releases/PRAMIO-R49-FULL-HOME-LINKS-BATUMI-FLORA.zip` — recreated **new, non-original** FLORA demo at `/portfolio/flora/`. Do not claim original FLORA restoration. Its actual source has not been recovered.

## R50 — authentic FLORA recovered (2026-11-19)

- User supplied full Timeweb backup `public_html(1).zip` on 2026-11-19, SHA-256 `c5b368e69ce9480082c9f1019f54a3d7c5cc3c0bbbfaf81ddd576910ad463cff`. This file contains server configuration `config.local.php` and MUST NOT be uploaded to public GitHub.
- ORIGINAL project was found under `portfolio/seasonal/` as FLORA FIVE SEASONS (21 actual files, five landing pages), with five campaign slugs `valentine`, `march8`, `tulips`, `mothers-day`, `september` and preserved photos, styles, scripts.
- R49 added an incorrect substitute at `/portfolio/flora/`; R50 corrects the portfolio card and schema.org ItemList to `/portfolio/seasonal/`, and redirects the erroneous `/portfolio/flora/` path to the authentic collection.
- Package: `releases/PRAMIO-R50-RESTORE-ORIGINAL-FLORA-FIVE-SEASONS.zip`, 981274 bytes, SHA-256 `26d2238142ac4c3eb7087eb5609399ca4c5375c2f092e8b125472b597b17d257`, 29 files. Direct unzip into Timeweb `public_html`, no installer or nested directory.
- Source of portfolio index: R49. Only the erroneous FLORA card URL is replaced; all other catalog links remain unchanged. Home page `index.html` and NEXT Batumi files are intentionally not in this patch. Every original seasonal file matches the user's archive byte-for-byte.
- R50 ZIP is also preserved in the Project Library as `/PRAMIO RU/PRAMIO-R50-RESTORE-ORIGINAL-FLORA-FIVE-SEASONS.zip`.

## Original FLORA incident history
The portfolio R23 snapshot does not contain FLORA, yet a later production version had it. A full working Timeweb `public_html` backup from BEFORE R47 overwrite is required to recover the exact original. Restore original path, assets, behavior, preview, and correct portfolio card by diff/merge with current state. Do not substitute new R49 demo.

## Release gate
1. Obtain **current production** ZIP (or verified equivalent) before editing; inventory every `portfolio/` entry, root hero and linked demos.
2. Compare before/after file paths and portfolio card titles/targets, OG images, form endpoints, JS/CSS, GIF/video assets. Any unintended missing content = fail.
3. Extend, don't replace, existing work; use additive patches when possible.
4. Build ZIP with exact root layout (no nested release folder), with **all locally used media**. Verify archive entries and CRC, links, phone landscape/portrait and actual click behavior. Do not confuse local passes with LIVE PASS.
5. Save ZIP to a permanent GitHub release/archive branch, update this registry with branch, SHA, filenames, size, dependency baseline and diff; check deployed Timeweb `public_html` separately.
6. User deploys ZIP; run LIVE QA before marking fixed.
