# First or Eighth

First or Eighth is a responsive hub for 14 friend-group games and four builders.
These statuses and links follow `data/games.yaml`; hub checks do not test the linked services.

- Ding: live at <https://ding-game.vercel.app/> / source at <https://github.com/jormyy/ding>
- Better 82-0 Multiplayer: live at <https://82-0-orpin.vercel.app/> / source at <https://github.com/mchen04/82-0>
- Hark: live at <https://audiobook-pwa-plum.vercel.app/> / source at <https://github.com/mchen04/audiobook_pwa> / companion converter at <https://github.com/mchen04/Epub_Listener>
- CodeNames: work in progress at <https://codenames-rho-smoky.vercel.app/> / source at <https://github.com/mchen04/CodeNames>
- Felt: live at <https://pokernow.vercel.app/> / source at <https://github.com/mchen04/pokernow>
- LoLdle: live at <https://loldle-app.vercel.app/> / source at <https://github.com/mchen04/LoLdle>
- SplitWisest: live at <https://splitwisest-kappa.vercel.app/> / source at <https://github.com/mchen04/SplitWisest>
- Valence: live at <https://valence1.vercel.app/> / source at <https://github.com/jormyy/valence>
- 25 Words or Less: live at <https://25-words-or-less.vercel.app/> / source at <https://github.com/matthewh8/25-words-or-less>
- Heardle: live at <https://heardle67.vercel.app> / source at <https://github.com/jormyy/heardle>
- King's Cup: live at <https://kings-cup-liard.vercel.app/> / source at <https://github.com/mchen04/Kings_Cup>
- Pour Decisions: live at <https://drinking-games-eosin.vercel.app/> / source at <https://github.com/mchen04/Drinking_Games>
- Neon Royale: live at <https://casino-topaz-gamma.vercel.app/> / source at <https://github.com/mchen04/Casino>
- Pancake: work in progress at <https://pancakedynasty.vercel.app> / source at <https://github.com/jormyy/pancake>

The visual direction is a neon dark game shelf with equal-weight cards, a mobile
drawer, searchable/filterable listings, a compact game detail overlay, and
builder credits.

## Data — the single canonical source

Everything the hub shows comes from two hand-editable YAML files:

- [`data/creators.yaml`](data/creators.yaml) — the builders.
- [`data/games.yaml`](data/games.yaml) — the games.

There is no build step or generated data copy. The browser fetches the YAML at
runtime, and the Node checks read the same files. Both use the parser in
[`src/lib/yaml.mjs`](src/lib/yaml.mjs) and the normalization and validation rules
in [`src/lib/data.mjs`](src/lib/data.mjs).

`index.html` preloads the data loader and its two module dependencies so browsers
can request them earlier. `src/app.js` remains the entry point. YAML fetches keep
their existing freshness checks and report loading or validation errors.

### Add a builder

Copy a block in `data/creators.yaml`, give it a new id, and fill in `name`,
`handle`, `github`, and `color`. Add an optional `bio`. Reference the id from any
game's `creator` or `editors`.

### Add a game

1. Add an entry to `data/games.yaml` (copy an existing block — the fields are
   documented at the top of the file).
2. Drop a `1440x900` capture at `assets/<id>.png`, where `<id>` matches the
   game's `id`.
3. Run `npm run assets` to generate the `640x400` card and `1200x750` detail
   WebP variants.
4. Run `npm run check`, then check the listing and detail overlay in a browser.

The listing, search, filters, sort, builder counts, footer, online count, and
static checks derive from that entry. A WIP game can omit its play URL and set
`screenshot: false` to use the striped placeholder. Live games require both.

All 14 current games have a play URL and a capture, including CodeNames and
Pancake, which retain WIP badges. The 12 Live games supply the online count.
Keep all 42 screenshot files: two WebP sizes and one PNG fallback per game.

## Development

The site has no third-party JavaScript dependencies. Commands use npm and Node.js;
the local server also needs Python 3. Asset generation needs macOS `sips` and
`cwebp` on `PATH`.

```sh
npm run dev
```

Then open <http://localhost:5173>.

Run the static checks for data, required files, stylesheet order, design
contracts, and image signatures and dimensions:

```sh
npm run check
```

`npm run assets` resizes existing PNGs and overwrites their WebP variants. It
does not capture linked sites and is not a verification command. Serve the
repository root over HTTP; opening `index.html` as a local file cannot provide
the runtime YAML requests. See [Implementation Notes](docs/implementation.md)
for browser checks and deployment files.

## Credits

- Jeremy created Ding, Valence, Heardle, and Pancake, and edited Neon Royale.
- Matthew created 25 Words or Less and edited SplitWisest.
- Michael created Better 82-0 Multiplayer, Hark, CodeNames, Felt, LoLdle, King's Cup, Pour Decisions, SplitWisest, and Neon Royale.
  He edited Ding, Valence, 25 Words or Less, and Pancake.
- Justin edited King's Cup.

## Design Notes

Games have equal card weight and default to alphabetical order. Playable cards
expose Play and GitHub links. Opening a card raises a detail overlay at
`#/game/<id>` above the current hub page. The description scrolls within the
panel; short landscape layouts also allow body scrolling to keep actions reachable.
Store review captures, benchmark receipts, and browser artifacts outside the repository.
