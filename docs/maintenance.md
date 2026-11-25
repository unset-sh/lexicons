---
title: "Maintenance"
description: "Where the schemas come from, how an update is imported, and how the docs stay current."
weight: 70
---

The schema source is `shared/lexicons/schemas/` in the
[unset.sh application repository](https://github.com/Undefined6799/unset). This repository contains an explicit
import of that source. Imports are manual while the proposed mirror workflow remains pending; a merge upstream
does not update this repository automatically.

## Provenance

[`source.json`](https://github.com/unset-sh/lexicons/blob/main/source.json) records:

- `repository` and `commit`: the upstream repository and full commit used for the schemas.
- `schemas`: each local schema's original `sourcePath` and SHA-256 of the copied file bytes.
- `documentationCommit`: the starting point for the imported documentation, which has been adapted here.

A schema changed here after the import carries `editedHere` with the date and reason; this repository is its
source from then on, and its `sha256` is of the file as changed here. The `sh.unset.actor` group is the first.

Use those values to compare the local schemas with that exact upstream commit. A matching hash checks the
local file against the recorded import; it does not prove network publication or approval of a future change.

## Importing a schema update

1. Review and merge the schema change upstream, including its compatibility and permission implications.
2. Copy the merged JSON files byte for byte into the matching `lexicons/` paths. Include referenced schemas
   and review additions or removals explicitly.
3. Record the new full upstream commit, source paths and copied-file hashes in `source.json`. Do not change a
   recorded hash merely to accept an unreviewed local schema edit.
4. Update the prose and examples, regenerate reference tables, then run the checks below.
5. Submit the import for review with its source commit and validation results.

Application runtime code, generated TypeScript and vendored Bluesky schemas remain upstream. This repository
does not publish an SDK or change the application's dependency wiring.

## Keeping documentation current

Use the Bun version in [`.bun-version`](https://github.com/unset-sh/lexicons/blob/main/.bun-version), then run from the repository root:

```sh
bun install --frozen-lockfile
bun run docs
bun run check
```

`bun run docs` refreshes blocks marked `<!-- schema:NSID#definition -->` and
`<!-- example:examples/path.json -->` from the schema and example files. Edit the source file for a reference
table or example, then regenerate it. Keep the surrounding explanation written for the reader.

`bun run check` validates the repository. Read the prose after regeneration too: generated tables cannot tell
whether a quick start preserves visibility or whether a publication claim is accurate. New lexicons need a
reference page, suitable examples and links from the [documentation index](_index.md).

See [Publication and compatibility](publication.md) before changing public contracts or publication status.
