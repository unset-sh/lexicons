# Repository instructions

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/maintenance.md](docs/maintenance.md) before changing this repository.

- Preserve the exact imported schema bytes and their source provenance. Schema contract changes are coordinated
  with the application repository before import here.
- Read the current official AT Protocol specification and the pinned tool source before relying on their behavior.
- Never put credentials or real personal data in code, fixtures, documentation or tool output.
- Use `.nvmrc`, exact dependency pins and the committed lockfile. Run `npm run docs` and `npm run check`.
- Change documentation prose when semantics change; generated tables alone are insufficient.
- Work on your own branch, open a pull request and never push to `main`. Authors do not merge their own changes.
- Do not publish Lexicons to a PDS, change DNS or configure secrets as part of a source or documentation update.
- Do not add AI attribution, co-author trailers or generated-with lines to commits, pull requests or history.
