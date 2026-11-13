# Implementation Notes

## Scope

The hub is a dependency-light static site at the repository root. Global tokens
live in `styles.css`; shell, shared primitives, library/card, detail-overlay,
creator, and responsive rules are split into focused files under `css/`.

## Architecture

```
data/
  creators.yaml   # canonical builders
  games.yaml      # canonical games and tools
src/
  lib/yaml.mjs    # dependency-free YAML parser (browser + Node)
  lib/data.mjs    # normalize + validate (pure, shared)
  lib/node.mjs    # Node-side loader for the scripts
  data.mjs        # browser loader: fetch YAML -> parse -> build -> validate
  app.js          # hash router + views + modal layer
scripts/
  check-site.mjs        # static + data + image checks
  generate-screenshots.mjs
  image-metadata.mjs
```

The YAML files are the **single canonical source**. The browser fetches them at
runtime (no build step) and the Node scripts read the same files through the
same parser and data layer, so the rendered site and the checks cannot drift.

## Relevant Design Aspects Implemented

- Neon dark shelf with compact, equal-weight cards and no featured hero.
- Live entries use screenshot captures tagged with their capture month; entries
  without a capture (`screenshot: false`) use an in-CSS striped placeholder with
  no title initials or letter icons.
- WIP entries show a status badge, a disabled action, and the striped thumbnail.
- Cards and the detail overlay expose Play links for games and Open links for
  tools, plus GitHub links for public source. A `source: private` entry shows a
  non-link "Private source" note instead.
- Opening a card raises a deep-linkable detail overlay (`#/game/<id>`) rather
  than a separate scrolling page. The panel pins its action bar and lays out the
  capture, title, tagline, tags, and builders so the essentials are visible
  without scrolling; only the description scrolls when a very small viewport
  runs short. It is a modal centered panel on desktop, a bottom sheet on mobile
  portrait, and a side-by-side panel in short landscape. Esc, the scrim, and the
  close button all dismiss it; focus is trapped and the background is inert.
- The nav drawer and the detail overlay share one modal layer (scroll lock,
  inert background, focus trap, focus restore).
- Entries are listed alphabetically by default; builders are listed alphabetically
  and their handles link to GitHub profiles.
- The topbar online count is derived from Live entries.
- Responsive search, genre chips, sort control, and card grid. Search and sort
  re-render only the results region, preserving control focus.

## Game Data

Only the group's current games and tools are included. To add an entry, append
to `data/games.yaml`; everything (listing, filters, builder counts, related
views, footer, online count, static checks) derives from that data.

- `kind` is `game` (default) or `tool`; tools use "Open" instead of "Play".
- `status` is `Live` or `WIP`.
- Every entry has a working `url`; a WIP entry may point at an early build.
- `source` is an `https://github.com/` URL or the literal `private`. Private
  repository URLs are never written into the repo.
- `added` is the `YYYY-MM-DD` repository creation date; cards show the year and
  "Newest" sorts on the full date. `captured` is the optional capture date.
- Genres are exactly `Party`, `Sports`, `Cards & Casino`, `Guessing`, `Tools`.
- The screenshot triplet is derived from the entry `id`: `assets/<id>-card.webp`,
  `assets/<id>-detail.webp`, and `assets/<id>.png`.
- Run `npm run assets` after replacing a `1440x900` fallback PNG to regenerate
  the `640x400` card WebP and `1200x750` detail WebP.
- An entry with no capture sets `screenshot: false`.

## Verification Targets

Use `npm run check` for static coverage and browser verification across:

- Desktop: 1440 x 900
- Small phone portrait: 320 x 568
- iPhone portrait: 390 x 844
- Phone landscape: 844 x 390
- Large phone landscape: 932 x 430

Review screenshots and temporary browser artifacts are intentionally kept
outside the repository, normally in `/tmp/first-eighth-critical/`.
