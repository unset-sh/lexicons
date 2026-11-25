---
title: "Publication and compatibility"
description: "What this repository distributes, and the compatibility commitments for the lexicons."
weight: 40
---

This GitHub repository distributes the schema source files, examples and documentation. The imported upstream
[publication ledger](https://github.com/Undefined6799/unset/blob/9817f1e7ed51fdd5989d6bad6261a9e167d97b80/shared/lexicons/published.lock.json)
is empty. That records no publication at the imported commit; it is not a live check of DNS or any PDS.

## Publication on AT Protocol

On AT Protocol, schemas are records of type `com.atproto.lexicon.schema` in a publishing account's repository.
Each record key is the schema's NSID. DNS TXT records connect each NSID authority to the publishing account's
DID. Hosting JSON on GitHub does not create those records or establish that authority.

These schemas use two groups:

| Schema group | DNS TXT name |
| --- | --- |
| `sh.unset.actor.profile`, `sh.unset.actor.page`, `sh.unset.actor.card`, `sh.unset.actor.authProfile` | `_lexicon.actor.unset.sh` |
| `sh.unset.block.*` | `_lexicon.block.unset.sh` |

Resolution does not recurse between groups, so the first TXT record cannot stand in for the second. See the
[publication and resolution specification](https://atproto.com/specs/lexicon#lexicon-publication-and-resolution).

Publishing to AT Protocol remains a separate operator action using the authority account. These docs, the
GitHub import and the repository checks do not authorize DNS changes or writes to that account. No publication
command or automated network publisher is included here.

Until a client has verified that a permission set resolves, it can request the equivalent
[granular permissions](permissions.md#status). Schema consumers can read the local JSON files directly.

## Compatibility begins with adoption too

The schemas are documented as a draft. That label does not remove compatibility obligations once another app
publicly adopts them, even if they have not been published through DNS. The
[evolution rules](https://atproto.com/specs/lexicon#lexicon-evolution) require old records to remain valid for
new readers and new records to remain valid for old readers.

New optional fields, known string values and members of open unions can extend the contract. Existing types,
required fields, record keys and limits must remain compatible. Breaking changes need a new NSID. Permission
sets have their own security implications because changes can affect existing grants at refresh;
[Permissions](permissions.md#how-the-set-changes) explains the review requirement.

The source import and its provenance are described in [Maintenance](maintenance.md).
