# unset.sh lexicons

The [AT Protocol](https://atproto.com) schemas for [unset.sh](https://unset.sh) profiles, pages and cards.
Use them to read the same records in another app or build a compatible writer. The schemas and documentation
are available under the [MIT licence](LICENSE).

**Start with the [documentation](docs/_index.md), [quick start](docs/quick-start.md), or
[sample records](examples/README.md).**

## The record model

```text
profile (self)       identity and profile details
page (self)          main page, visibility and ordered card references
  card               one block, with optional width and surface
    block            text, links, showcase, buttons or images
```

| Lexicon | Purpose | Reference |
| --- | --- | --- |
| `sh.unset.actor.profile` | Account identity, at record key `self` | [Profile](docs/lexicons/profile.md) |
| `sh.unset.actor.page` | A page's card order and visibility; `self` is the main page | [Page](docs/lexicons/page.md) |
| `sh.unset.actor.card` | One block and its presentation | [Card](docs/lexicons/card.md) |
| `sh.unset.block.text` | Markdown text | [Text](docs/lexicons/block-text.md) |
| `sh.unset.block.links` | Links to accounts or other sites | [Links](docs/lexicons/block-links.md) |
| `sh.unset.block.showcase` | Titled projects, writing or other entries | [Showcase](docs/lexicons/block-showcase.md) |
| `sh.unset.block.buttons` | A heading and email or link buttons | [Buttons](docs/lexicons/block-buttons.md) |
| `sh.unset.block.images` | Pictures with alt text | [Images](docs/lexicons/block-images.md) |
| `sh.unset.block.defs` | Shared image and aspect ratio definitions | [Shared definitions](docs/lexicons/block-defs.md) |
| `sh.unset.actor.authProfile` | OAuth permissions for these three record collections | [Permissions](docs/permissions.md) |

The JSON files live in [`lexicons/`](lexicons/), using their NSID as a path: `sh.unset.actor.card` becomes
`lexicons/sh/unset/actor/card.json`. Blocks are objects inside a card, not separate repository records.

Records are public on the AT Protocol network. A page's `visibility` asks apps to restrict display; it does
not make its records confidential. Read the [reader rules](docs/reading-a-page.md) before implementing them.

## Status and source

This is the public schema repository. Its initial schemas are an exact copy of the merged application source
recorded in [`source.json`](source.json), which includes the source commit and a SHA-256 for each schema.
Documentation was adapted from the existing documentation draft and reviewed against that snapshot.

The source snapshot records no DNS/PDS publication. This is not a live network check. Serving files on GitHub
and publishing resolvable Lexicons are separate steps; see [publication](docs/publication.md). Treat compatibility
as a requirement once third parties use a schema, even before DNS publication. Pin a commit when consuming files.

Schema changes are coordinated in [Undefined6799/unset](https://github.com/Undefined6799/unset), under
`shared/lexicons/schemas/`, while the application retains its local schema copy. Synchronization is currently
manual. The proposed automatic mirror is not configured. The [maintenance guide](docs/maintenance.md) describes
how to refresh schemas and documentation together without losing changes here.

## Check the repository

Use the Bun version recorded in [`.bun-version`](.bun-version):

```sh
bun install --frozen-lockfile
bun run check
```

Checks cover Lexicon schemas, references, sample records, documentation coverage, generated tables and local links.
After changing a schema or sample, run `bun run docs` to regenerate the marked reference blocks, then review the
surrounding prose and run the checks again. No account, credentials or running PDS are needed.

There is no published SDK or npm package. The development tools validate these files; applications can generate
their own types from `lexicons/` using their preferred AT Protocol tools.

## Contributing

Questions and proposals are welcome in [issues](https://github.com/unset-sh/lexicons/issues).
Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing a schema or its documentation.
