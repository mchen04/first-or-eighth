# Implementation Notes

## Scope and commands

The hub is a static site at the repository root. It has no build step or
third-party JavaScript dependencies. Linked games remain separate projects.

| Command | Purpose | Tools |
|---|---|---|
| `npm run dev` | Serve the root at `http://localhost:5173` | npm, Python 3 |
| `npm run check` | Run static data, file, CSS, design and image checks | npm, Node.js |
| `npm run assets` | Regenerate WebPs from existing PNG captures | npm, Node.js, macOS `sips`, `cwebp` |

The asset command overwrites generated WebPs. It does not capture linked sites.
Use an HTTP server for local work because the browser fetches YAML at runtime.

## Architecture and loading

```text
index.html             # document, stylesheets, module preload hints, app entry
styles.css             # shared tokens and base rules
css/                   # shell, primitives, library, detail, creators, responsive
data/
  creators.yaml        # canonical builders
  games.yaml           # canonical games
src/
  lib/yaml.mjs         # YAML subset parser shared by browser and Node
  lib/data.mjs         # shared normalization, validation and screenshot contract
  lib/node.mjs         # filesystem loader for asset/check scripts
  data.mjs             # browser fetch, parse, normalize, validate and cache
  app.js               # hash router, views, modal layer and events
scripts/
  check-site.mjs       # static checks
  generate-screenshots.mjs
  image-metadata.mjs   # PNG/WebP signature and dimension checks
assets/                # 14 PNG captures and 28 responsive WebP variants
```

The YAML files are the single canonical data source. Browser and Node paths
share parsing, normalization and validation rules. There is no generated data copy.

`index.html` has `modulepreload` hints for `src/data.mjs`, `src/lib/yaml.mjs`, and
`src/lib/data.mjs`. These let browsers discover the module dependencies earlier.
`src/app.js` remains the module entry point.

The browser loader fetches both YAML files concurrently with `cache: "no-cache"`.
It checks HTTP responses, parses and validates the data, then caches the result
for that page load. Reload after editing YAML. Loading and validation failures
reach the visible error state through `boot()`.

The parser supports the YAML subset documented in `src/lib/yaml.mjs`, including
block mappings, sequences, quoted values and block text. Follow the YAML file
headers when editing values. Unsupported or malformed input produces an error.

Stylesheets load in this order: `styles.css`, `shell.css`, `primitives.css`,
`library.css`, `detail.css`, `creators.css`, then `responsive.css`. The six named
component files live in `css/`. `npm run check` verifies this exact local order.

Deploy `index.html`, `favicon.svg`, `styles.css`, all six component stylesheets,
`src/app.js`, the browser loader, the shared parser/data modules, both YAML files,
and all 42 images. The current local runtime contains 57 files. Node-only scripts,
`src/lib/node.mjs`, and documentation are not browser runtime files. Google Fonts
provides the external font stylesheet and font files.

## Views and behavior

- The library has 14 equal-weight cards and defaults to alphabetical order.
  Search covers game text, builder names, status and URLs. Genre filters and
  four sorts update results while preserving control focus.
- All current games have a play URL and a screenshot, including CodeNames and
  Pancake. Both remain WIP. The 12 Live games supply the topbar online count;
  this count is not a live service-health check.
- Pancake links to <https://pancakedynasty.vercel.app>, shows its capture, and
  offers Play, GitHub and Copy link in its detail overlay.
- `#/` shows games, `#/creators` shows four alphabetically sorted builders,
  and `#/game/<id>` opens a detail overlay. Invalid routes normalize to the library.
- A detail overlay retains its underlying hub page. Desktop uses a centered
  panel; phone portrait uses a bottom sheet; short landscape uses two columns.
  The description scrolls inside the panel. Short landscape also permits body
  scrolling so actions remain reachable.
- Escape, the scrim and the close button dismiss details. The drawer and detail
  overlay share scroll locking, an inert background, focus trapping and focus return.
- Builder cards show linked handles, created/edited counts and game links.
  An optional biography uses the `.creator-card p` style.

WIP status alone does not disable Play or remove a capture. A WIP entry may omit
its play URL and set `screenshot: false`. That combination uses the striped
placeholder and a detail action bar with Follow on GitHub and Copy link.
Live entries require both a play URL and a capture.

Compatibility and error paths remain supported: reduced motion, inert fallback,
legacy clipboard copying, copy-failure feedback, safe URL/color handling and
escaped output. Current data need not exercise every branch for it to remain useful.

## Assets and data changes

Add games and builders using the instructions in [README.md](../README.md) and
the YAML headers. Game data drives listings, filters, details, builder counts,
footer totals and online count.

Each screenshot-enabled game derives three asset names from its id:

| Asset | Dimensions | Role |
|---|---|---|
| `assets/<id>.png` | 1440 × 900 | Original capture and PNG fallback |
| `assets/<id>-card.webp` | 640 × 400 | Card-sized source |
| `assets/<id>-detail.webp` | 1200 × 750 | Detail-sized source |

Replace the PNG, run `npm run assets`, then run `npm run check`. The generator
uses `sips` for resizing and `cwebp` at quality 82 for encoding. Its temporary
workspace is removed on success or failure.

The browser selects WebP sizes through `picture`, `srcset`, and `sizes`.
Card images load lazily; detail images load eagerly with high fetch priority.
Retain all 42 files, including generated variants and PNG fallbacks.

## Verification

`npm run check` is the project's only automated check command. It checks YAML
and schema rules, required files, stylesheet order, design constraints, image
existence/signatures/dimensions, and legacy screenshot names. Screenshot
existence is checked once per asset with the game name and variant in its error.
The script checks image metadata; browser decoding provides separate evidence.

The project has no separate unit-test framework or coverage-report command.
Static checks do not establish browser behavior or linked-game availability.
Verify served files in a browser at these sizes:

| View | Width × height |
|---|---|
| Desktop | 1440 × 900 |
| Small phone portrait | 320 × 568 |
| Phone portrait | 390 × 844 |
| Phone landscape | 844 × 390 |
| Large phone landscape | 932 × 430 |

Check all 14 cards and loaded images, search and empty results, genre filters,
all four sorts, builder links, cold detail links and invalid routes. Exercise
drawer and detail opening, Escape, focus trapping and focus return. Confirm
visible actions, usable scrolling, no horizontal overflow, and no browser errors.
Check WIP links/captures and the PNG fallback path as well.

Store browser captures, benchmark receipts, fault probes and evaluation scripts
outside the repository. A Chromium viewport check does not establish Safari,
physical mobile-device behavior or production performance.
