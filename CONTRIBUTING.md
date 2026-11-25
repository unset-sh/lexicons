# Contributing

Open an issue for a question or proposal, or a pull request for a concrete improvement. Include the affected
NSID and an example of the behavior you expect. Use invented records and reserved example domains.

## Where changes belong

This repository owns its reader documentation, examples and standalone checks. The application still maintains
the schema definitions under `shared/lexicons/schemas/` in
[Undefined6799/unset](https://github.com/Undefined6799/unset).

A schema with `editedHere` in `source.json` (today the `sh.unset.actor` group) is maintained here directly: change it in a
pull request to this repository and update its hash.

Propose schema changes here or in the application repository. Coordinate the application change first, then
import its merged schema bytes and update `source.json` in a pull request here. Keep documentation changes made
here when refreshing the snapshot. Synchronization is manual; no workflow currently overwrites this repository.
See [maintenance](docs/maintenance.md) for the import and verification procedure.

## Compatibility

Follow the [Lexicon evolution rules](https://atproto.com/specs/lexicon#lexicon-evolution). Compatibility matters
once third parties adopt a schema, even if it has not been published through DNS. Existing records also matter.

- Optional properties, known values and members of an open union may be added compatibly.
- Preserve existing names, field types, required fields, meanings and size or length limits.
- Breaking changes need a new NSID and an explicit migration discussion.
- Review permission-set changes separately: they affect what existing grants authorize.

A schema change needs an explanation of reader fallbacks and its impact on existing records. GitHub publication
does not authorize changes to DNS, the Lexicon authority account, or OAuth grants.

## Local checks

```sh
bun install --frozen-lockfile
bun run docs
bun run check
```

Reference tables and examples between generated markers in `docs/` come from the schema and JSON sample files.
Change those inputs, regenerate, then review the prose. Every record and block needs a sample, every object or
record definition needs a reference table, and local Markdown links must resolve.

Use a branch and open a pull request. Keep commits short and imperative. Run all checks and describe what changed,
why, and how it was checked. Target `staging`, never `main`; the author does not merge their own change. Only Alex promotes `staging` to
`main`, and only a promotion he authorised publishes lexicons to the network.

## Security

Do not include passwords, tokens, recovery keys or real personal data in issues, examples or tests. Report
vulnerabilities through the organisation's [security policy](https://github.com/unset-sh/.github/blob/main/SECURITY.md).
