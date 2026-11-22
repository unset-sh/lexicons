# Permissions

An app that writes a profile, its pages and their cards asks for one permission set, `sh.unset.authFull`.

## Overview

AT Protocol OAuth grants an app access to named resources in a person's account. A
[permission set](https://atproto.com/specs/permission#permission-sets) bundles the permissions for one family of
lexicons under a name, with a title and a description the person sees on the consent screen.

## Full access

`sh.unset.authFull` covers everything needed to create and edit a profile, its pages and their cards, and nothing
else in the account.

The person sees:

> **unset.sh profile page**
> Create and edit your unset.sh profile, its pages and their cards. Nothing else in your account.

### Requesting it

When the set is published and resolvable, include it in the OAuth scope:

```text
atproto include:sh.unset.authFull
```

### What it grants

<!-- schema:sh.unset.authFull#main -->
| Name | Grants |
| --- | --- |
| `sh.unset.profile` | Records: create, update, delete |
| `sh.unset.page` | Records: create, update, delete |
| `sh.unset.card` | Records: create, update, delete |
<!-- /schema -->

Blocks are not listed because a block is not a record. It is stored inside a card.

## Uploading pictures

A permission set cannot include blob uploads; an app must request them directly
([Permissions, `blob`](https://atproto.com/specs/permission#blob)). An app that uploads avatars or card pictures
adds a blob permission to its scope:

```text
atproto include:sh.unset.authFull blob:image/*
```

## Reading needs no permission

Profile, page and card records in an account's public repository can be read without an OAuth write grant.
Readers should still follow the page's [visibility request](reading-a-page.md#who-sees-the-page).

## Status

The imported source records no publication of the set. Its live resolution state has not been verified here.
Clients can request the same repository access directly, without resolving a permission set:

```text
atproto repo:sh.unset.profile repo:sh.unset.page repo:sh.unset.card
```

Add `blob:image/*` when uploading pictures. If an authorization request using `include:` fails because the set
cannot be resolved, the client must make a new request with the granular scopes; the server does not silently
substitute them. See [Publication and compatibility](publication.md).

## How the set changes

Keep the set's name stable once applications use it: another name requires a new grant. Authorization servers
may recompute a session's permissions from the current set during token refresh, so adding permissions can widen
existing grants without a new consent screen. Schema owners must review additions and consent-text changes
explicitly, and must preserve grants that running features use. This repository's maintenance checks do not
authorize a permission change or publish the set.

## Related

- [Quick start](quick-start.md)
- [`sh.unset.profile`](lexicons/profile.md), [`sh.unset.page`](lexicons/page.md) and [`sh.unset.card`](lexicons/card.md)
