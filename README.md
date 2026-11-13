# First or Eighth

First or Eighth is a responsive hub for the friend group's games and the shared
practical tools we actually use:

- 25 Words or Less: live at <https://25-words-or-less.vercel.app/> / source at <https://github.com/matthewh8/25-words-or-less>
- Better 82-0 Multiplayer: live at <https://82-0-orpin.vercel.app/> / source at <https://github.com/mchen04/better-82-0-multiplayer>
- Build a Bucket: live at <https://build-a-bucket.vercel.app/> / private source
- Ding: live at <https://ding-game.vercel.app/> / source at <https://github.com/jormyy/ding>
- Felt: live at <https://pokernow.vercel.app/> / source at <https://github.com/mchen04/felt-poker>
- Hark: live at <https://audiobook-pwa-plum.vercel.app/> / source at <https://github.com/mchen04/hark-audiobook> / companion converter at <https://github.com/mchen04/epub-listener>
- Heardle: live at <https://heardle67.vercel.app/> / source at <https://github.com/jormyy/heardle>
- LoLdle: live at <https://loldle-app.vercel.app/> / source at <https://github.com/mchen04/loldle>
- Neon Royale: live at <https://casino-topaz-gamma.vercel.app/> / source at <https://github.com/mchen04/neon-royale-casino>
- Pancake: live at <https://pancakedynasty.vercel.app/> / source at <https://github.com/jormyy/pancake>
- Poker Banker: live at <https://poker-banker.vercel.app/> / private source
- SplitWisest: live at <https://splitwisest-kappa.vercel.app/> / source at <https://github.com/mchen04/splitwisest>
- Valence: live at <https://valence1.vercel.app/> / source at <https://github.com/jormyy/valence>

The visual direction is a neon dark shelf with equal-weight cards, a mobile
drawer, searchable/filterable listings, a compact detail overlay, and builder
credits.

## Data — the single canonical source

Everything the hub shows comes from two hand-editable YAML files:

- [`data/creators.yaml`](data/creators.yaml) — the builders.
- [`data/games.yaml`](data/games.yaml) — the games and tools.

There is no build step and no generated copy of the data. The browser fetches
the YAML at runtime, and the Node checks read the very same files, so what ships
and what is verified can never drift. Both go through one small dependency-free
parser in [`src/lib/yaml.mjs`](src/lib/yaml.mjs) and one normalize/validate
layer in [`src/lib/data.mjs`](src/lib/data.mjs).

### Add a builder

Copy a block in `data/creators.yaml`, give it a new id, and fill in `name`,
`handle`, `github`, `color`, and `bio`. Reference the id from any entry's
`creator` or `editors`.

### Add a game or tool

1. Add an entry to `data/games.yaml` (copy an existing block — the fields are
   documented at the top of the file).
2. Drop a `1440x900` capture at `assets/<id>.png`, where `<id>` matches the
   entry's `id`.
3. Run `npm run assets` to generate the `640x400` card and `1200x750` detail
   WebP variants.

That's it — the listing, search, filters, sort, builder counts, footer, online
count, and the static checks all derive from that one entry. An entry with no
capture sets `screenshot: false` and uses the striped placeholder.

### Fields

- `id` — required. URL slug (`#/game/<id>`) and screenshot base name. Lowercase
  letters, numbers, and dashes.
- `name` — required. Display name.
- `kind` — optional. `game` (default) or `tool`. Tools use "Open" wherever games
  say "Play", including card and detail buttons and their aria labels.
- `status` — required. `Live` or `WIP`.
- `url` — required for every entry. A WIP entry may point at a preview or early
  build.
- `source` — required. An `https://github.com/` URL, or the literal `private`
  when the app is public but its repository is not. A private source renders a
  non-link "Private source" note instead of a GitHub button; private repository
  URLs are never written down.
- `creator` — required. A creator id from `data/creators.yaml`.
- `editors` — list of creator ids who edited it. Use `[]` for none.
- `genre` — required. One of `Party`, `Sports`, `Cards & Casino`, `Guessing`,
  `Tools`; these are the filter chips.
- `added` — required. `YYYY-MM-DD` GitHub repository creation date. Cards and
  detail show the year; "Newest" sorts on the full date.
- `captured` — optional. `YYYY-MM-DD` the thumbnail capture was taken; the tag
  reads like "Captured Nov 2026". Entries with a screenshot carry one.
- `accent` — required. Hex accent color (quoted, leading `#`).
- `tagline` — required. One short line shown on the card and detail.
- `description` — required. A paragraph; `>` folds wrapped lines into one.
- `screenshot` — optional. Set to `false` for entries with no capture.

## Development

This is a dependency-light static site.

```sh
npm run dev
```

Then open <http://localhost:5173>.

Run the static checks (data validation, file/stylesheet contracts, and image
dimension checks) with:

```sh
npm run check
```

## Credits

- Michael created Better 82-0 Multiplayer, Build a Bucket, Felt, Hark, LoLdle,
  Neon Royale, Poker Banker, and SplitWisest.
- Jeremy created Ding, Heardle, Pancake, and Valence.
- Matthew created 25 Words or Less.
- Michael edited 25 Words or Less, Ding, Pancake, and Valence.
- Matthew edited Felt and SplitWisest.
- Jeremy edited Neon Royale.

## Design Notes

Entries stay in an equal alphabetical list, each card exposes its play/open and
source links, and opening a card raises a deep-linkable detail overlay
(`#/game/<id>`) tuned so the capture, title, tagline, tags, builders, and action
bar stay in view without scrolling across mobile portrait, mobile landscape,
tablet, and desktop. Temporary review screenshots and browser artifacts belong
outside the repo, for example under `/tmp/first-eighth-critical/`.
