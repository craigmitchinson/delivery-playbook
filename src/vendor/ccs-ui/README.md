# Vendored `@ccs/ui`

These files are a vendored copy of the shared **`@ccs/ui`** design-system package
(canonical CCS · IPA tokens, glass chrome, a11y utilities and self-hosted fonts).

They used to be pulled in as a `file:../ccs-ui` dependency, which only resolved on a
machine that also had the sibling `ccs-ui` folder checked out next to this repo. On any
other device `npm install` and the build failed. Vendoring the two entrypoints the deck
actually imports makes this repo self-contained and clonable anywhere.

## What's here

- `tokens.css` — design tokens plus the `.ccs-glass*` and `.ccs-skip-link` utility classes.
- `fonts.css` — `@font-face` declarations for the self-hosted typefaces.
- `fonts/` — the nine `.woff2` files `fonts.css` references (Gelasio, Carlito, JetBrains Mono).

`mark.js` and `brand-fonts.css` from the upstream package are not imported by this deck and
were intentionally left out.

## Keeping in sync

`@ccs/ui` is the canonical source. If a token changes upstream, re-copy `tokens.css` /
`fonts.css` (and any newly referenced font) from the `ccs-ui` package. Do not hand-edit
values here — that would let this deck drift from the suite.
