# CLAUDE.md: unset-sh/lexicons

## Where this repository fits

This is `unset-sh/lexicons`: the public, MIT-licensed `sh.unset.*` AT Protocol lexicon schemas, their reference
documentation and sample records.

- **Belongs here:** the published copy of the `sh.unset.*` schemas, their docs and examples, and the checks that
  validate them.
- **Does not belong here:** the code that reads or writes these records (that is `unset-sh/backend` and
  `unset-sh/web`); DNS, the Lexicon authority account and network publication, which are operator actions;
  shared workflow implementations (that is `unset-sh/tooling`).
- **Uses:** `Undefined6799/unset`, whose `shared/lexicons/schemas/` is still the schema source, copied here by
  hand at the commit and hashes in `source.json`; `unset-sh/tooling` for the branch policy check at a full
  commit; `unset-sh/agent-kit` as the copy under `.claude/`. **Used by:** any app that reads or writes `sh.unset.*`
  records; backend and web once they exist.
- **Licence:** schemas and documentation are MIT, by the organisation's rule for lexicon schemas.

The map of every unset.sh repository is <https://github.com/unset-sh/.github/blob/main/MAP.md>. Read it before
moving work between repositories or starting work that might belong elsewhere.

**Keep the map current.** When a change here adds, removes or moves a responsibility, changes what this
repository uses or ships, or renames or archives it, open a pull request on `unset-sh/.github` that updates
`repos.json` (run `npm run map` there) and update this section to match.

## Rules

- Read [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/maintenance.md](docs/maintenance.md) before changing anything.
- `docs/` is published as the `lexicons/` section of docs.unset.sh from `main` (`.github/workflows/docs-export.yml`).
  Every page needs front matter with a title; link to files outside `docs/` by their GitHub URL on `main`.
- Preserve the exact imported schema bytes and their provenance in `source.json`. Coordinate a schema change with
  the source before importing it here, and follow the
  [Lexicon evolution rules](https://atproto.com/specs/lexicon#lexicon-evolution): a breaking change needs a new NSID.
- Read the current AT Protocol specification and the pinned tool source before relying on their behaviour.
- Never publish lexicons to a PDS, change DNS or configure secrets as part of a source or documentation change.
  Publication to the network happens only after a promotion to `main` that Alex authorised (org-0012).
- Drafts for an upcoming feature stay on a feature branch or draft pull request until they are ready to
  publish, so nothing unfinished sits on `staging` when Alex promotes it.
- Change documentation prose when semantics change; generated tables alone are not enough.

## Commands

```sh
bun install --frozen-lockfile
bun run docs    # regenerate the marked reference blocks
bun run check   # types, lint, tests, schemas, examples, links, hashes and the agent-kit copy
```
