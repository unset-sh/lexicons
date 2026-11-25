---
title: "Reading a page"
description: "The rules an app follows to show someone's page."
weight: 20
---

These are the rules an app follows to show someone's page. They combine the lexicons' field descriptions with
the reference application's handling of invalid records.

## What to fetch

1. **The profile.** Fetch `sh.unset.actor.profile`, record key `self`, from the account's repository and validate it.
   A missing or invalid profile shows no page. A valid profile may have no optional fields; that is different
   from a missing profile.
2. **The main page.** Fetch `sh.unset.actor.page`, record key `self`, and validate it before interpreting its fields.
   Confirmed absence means the valid profile's header is shown with no cards, to everyone.
3. **Only the main page, for now.** An account may hold pages under other record keys. Show none of them until
   you know where they go; skip them without treating them as broken.

An invalid main page is not an absent page. The reference application keeps an invalid or oversized main page
as owner-only with no cards, so malformed data cannot make an account public. A failed or incomplete fetch is
also not proof of absence: do not reveal details whose visibility you could not determine. The application's
[index rules](https://github.com/Undefined6799/unset/blob/9817f1e7ed51fdd5989d6bad6261a9e167d97b80/domains/profile/index-plan.ts)
record this behavior in `REFUSED_PAGE`.

## Which cards show

1. **Only listed cards show.** Walk the page's `cards` in order. A card that exists in the repository but is not
   in the list is not shown on that page.
2. **Only the account's own cards count.** Accept an entry only if its `uri` is the address of an `sh.unset.actor.card`
   record in the page's own repository, written with that account's DID:
   `at://<the account's DID>/sh.unset.actor.card/<record key>`. Compare it as text. Never resolve a handle to decide.
   Skip any other entry: a handle-form address, another account, another kind of record.
3. **Validate each card.** Skip a missing or invalid card. Validate known block types as part of the card;
   an unknown member of an open union remains valid but is hidden by readers that cannot render it.
4. **Show a repeat once.** A card named more than once is shown once, at its first place.
5. **Hide what is empty or unknown.** A block with nothing to show, such as an empty list, is hidden. A card whose
   block type you do not know is hidden too. Neither is an error.

## Who sees the page

The page's `visibility` asks apps to limit who they show the page to.

| Value | Show the page to |
| --- | --- |
| absent, or `public` | Everyone |
| `signed-in` | People signed in to your app |
| `owner-only` | Only the account itself |
| any other value | Treat as `owner-only` |

Apply the same answer to the page's cards. The main page's choice is the account's: apply it also to the profile's
details shown with the page, and wherever you show the account outside the page, such as a directory or search.

This is a request to apps, **not access control**. The records stay public on the network, and an app that
ignores the field can still read them. Do not tell a person their page is private.

## Unknown values

Fields such as `width`, `surface`, `layout`, `fit`, and `preset` name known values but accept other
strings within their schema limits. Each field's description says what an absent or unknown value means,
for example "absent or unknown means full". An unfamiliar value alone is not a validation error.

## Showing content safely

Everything in a record was written by someone else. Before showing it:

- **Links.** Keep only `http` and `https` URLs. Ignore any other scheme.
- **Text.** The text block is Markdown. Never render raw HTML from it, and keep only `http` and `https` links.
  Show syntax you do not support as plain text. Apply the optional `tableStyle` and `textStyle` looks only to the
  block whose line fingerprints they match; see the [text block](lexicons/block-text.md).
- **Pictures.** Never hand a blob to a browser as it is. Check its real type and re-encode it first; the declared
  type may be wrong. Decide how to show a picture linked from Markdown yourself, for example as a plain link, or
  loaded through your own proxy so the picture's host never learns who is reading.
- **Email buttons.** Check that the address is a single plain address before building a `mailto:` link.
- **Link icons and site names.** Take them from your own list of known sites. Never fetch the linked site to find
  them.
- **Proportions.** `aspectRatio` may be approximate. Clamp extreme values.

## Fields you do not know

A record may carry fields your copy of the lexicon does not define, because the lexicons grow. Ignore them when
reading. If you edit and save a record, keep them, so you do not erase data a newer app wrote.

## Related

- [`sh.unset.actor.profile`](lexicons/profile.md), [`sh.unset.actor.page`](lexicons/page.md) and
  [`sh.unset.actor.card`](lexicons/card.md)
- [Quick start](quick-start.md)
