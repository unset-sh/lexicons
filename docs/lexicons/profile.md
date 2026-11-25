---
title: "Profile lexicon"
description: "sh.unset.profile: who an account is, shown at the top of its pages."
weight: 1
---

`sh.unset.profile` is who an account is on unset.sh: the name, picture and description shown at the top of its pages.

## Overview

Each account has at most one profile, stored under the record key `self`. Its presence means the account uses
unset.sh. Deleting it removes the account's pages from readers.

Every field is optional. A profile with no fields is valid and shows the account's handle.

The profile holds no cards and no styling. What a page shows, and who may see it, is in [`sh.unset.page`](page.md).

## Schema

<!-- schema:sh.unset.profile#main -->
Record key: `literal:self`

| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `displayName` | string | No | 64 graphemes; 640 bytes | Name shown at the top of the page. Absent means readers show the handle. |
| `avatar` | blob | No | `image/png`, `image/jpeg`; up to 1,000,000 bytes | Profile picture. Readers never hand it to a browser without checking its type and re-encoding it; the declared type may be wrong. |
| `description` | string | No | 256 graphemes; 2,560 bytes | A few lines about the account, as plain text. Line breaks are kept; nothing else in it is formatted or turned into a link. |
| `createdAt` | string (datetime) | No |  | When the profile was first created. |
<!-- /schema -->

## Examples

A minimal profile with a creation time:

<!-- example:examples/sh/unset/profile/minimal.json -->
```json
{
  "$type": "sh.unset.profile",
  "createdAt": "2026-11-21T15:04:05.000Z"
}
```
<!-- /example -->

A complete profile:

<!-- example:examples/sh/unset/profile/full.json -->
```json
{
  "$type": "sh.unset.profile",
  "displayName": "Sam Rivera",
  "avatar": {
    "$type": "blob",
    "ref": {
      "$link": "bafkreibqgoyh5cc2beaorwif4zpknewf7hxrtcorp66hrsaw6iceciiwfm"
    },
    "mimeType": "image/jpeg",
    "size": 184223
  },
  "description": "Product designer in Lisbon.\nMaps, type and small tools.",
  "createdAt": "2026-11-21T15:04:05.000Z"
}
```
<!-- /example -->

## View the lexicon

[`lexicons/sh/unset/profile.json`](https://github.com/unset-sh/lexicons/blob/main/lexicons/sh/unset/profile.json)

## Writing a profile

- Write the profile with record key `self`. There is only ever one.
- Keep fields you do not know when you save, so you do not erase what a newer app wrote.
- Protect edits with the record's previous CID (`swapRecord` on `putRecord`) so you do not overwrite a
  concurrent edit. Use `swapRecord: null` when creating a profile that must not already exist.

## Reading a profile

- Validate the record before using it. A missing or invalid profile shows no page.
- Show the handle when `displayName` is absent.
- Check the avatar's real type and re-encode it before showing it; the declared type may be wrong.
- Show `description` as plain text with its line breaks. Do not render Markdown or HTML in it.
- Show the profile's details only to people the main page's `visibility` allows. See
  [Reading a page](../reading-a-page.md).
- An older profile may carry fields from an earlier draft, such as `cards`, `visibility`, `headline`,
  `avatarShape`, `location`, `website` or `listed`. Ignore them.

## Related

- [Page lexicon](page.md): what the account shows, and to whom.
- [Permissions](../permissions.md): what an app needs to write a profile.
