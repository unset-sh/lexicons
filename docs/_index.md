---
title: "Lexicons"
description: "The sh.unset.* record types that describe a person's pages on the AT Protocol, and how apps read and write them."
type: docs
cascade:
  type: docs
menus:
  main:
    weight: 80
---

The `sh.unset.*` lexicons describe a person's pages on the AT Protocol: who they are, the cards on a page, and
what each card holds. The records live in the person's own repository on their Personal Data Server (PDS), so
the pages belong to them and any app can read them.

## What is here

| Lexicon | Kind | What it is |
| --- | --- | --- |
| [`sh.unset.profile`](lexicons/profile.md) | Record | Who the account is: name, headline, picture and details. One per account. |
| [`sh.unset.page`](lexicons/page.md) | Record | One page: the cards it shows, in order, and who it is meant for. The main page is `self`. |
| [`sh.unset.card`](lexicons/card.md) | Record | One card. It holds exactly one block. |
| [`sh.unset.block.text`](lexicons/block-text.md) | Block | Formatted text, written in Markdown. |
| [`sh.unset.block.links`](lexicons/block-links.md) | Block | A set of links, such as accounts on other sites. |
| [`sh.unset.block.showcase`](lexicons/block-showcase.md) | Block | Titled items such as projects, writing or talks. |
| [`sh.unset.block.buttons`](lexicons/block-buttons.md) | Block | A short pitch with up to five buttons. |
| [`sh.unset.block.images`](lexicons/block-images.md) | Block | One picture, or a small set shown together. |
| [`sh.unset.block.defs`](lexicons/block-defs.md) | Shared definitions | The picture shape the blocks share. |
| [`sh.unset.authFull`](permissions.md) | Permission set | What an app asks for to write a profile, its pages and their cards. |

```text
sh.unset.profile                 who the account is, shown at the top of its pages
sh.unset.page (self)             the main page
└── cards                        ordered list of at:// addresses
    └── sh.unset.card            one card
        └── content              one block
            └── sh.unset.block.* text, links, showcase, buttons or images
```

## How it fits together

**The profile is who the account is.** Name, headline, picture, location and website, shown at the top of every
page. Its presence means the account uses unset.sh. Every field is optional.

**A page is what the account shows.** It lists the cards to show, in order, and says who the page is meant for.
The page under the record key `self` is the account's main page, shown at the profile's address. The key may
hold other values later, for more pages per account, but readers show only `self` today.

**A card is a slot; a block is its content.** The card says how wide it is and how its surface is drawn. The block
says what is inside. Blocks are lexicons of their own, in their own group, so the same block can be used in other
records later, and a new kind of block never changes the card.

**The page decides what shows.** A card appears only when a page's `cards` list names it, in that order. A card
that is not listed is not shown. One card may be listed on more than one page.

## Design choices

- **Few required fields.** A profile and a page need nothing, a card needs only its content, and most block
  fields are optional. Records stay valid as the lexicons grow.
- **Open by default.** A card's content is an open union: another app may put its own type there, and a reader
  hides what it does not know. Text values such as `layout` list known values but accept others.
- **Safe to read.** Each field says what a reader must do before showing it: keep only `http` and `https` links,
  never render raw HTML, never hand a picture to a browser unchecked.
- **Room to grow.** The limits in the lexicons are ceilings. An app may apply tighter ones of its own.

## Status

The imported source records no AT Protocol publication. This repository distributes the schema files; it does
not establish their current DNS or PDS publication state. See [Publication and compatibility](publication.md).

Treat the schemas as a draft, but do not assume that missing network publication permits breaking changes:
third-party adoption also establishes compatibility obligations.

## Next steps

1. [Quick start](quick-start.md): write a profile, a page and a card, then read them back.
2. [Reading a page](reading-a-page.md): the rules a reader follows.
3. [Permissions](permissions.md): the OAuth scope to request.
4. The lexicons: [profile](lexicons/profile.md), [page](lexicons/page.md), [card](lexicons/card.md), and the
   blocks ([text](lexicons/block-text.md), [links](lexicons/block-links.md), [showcase](lexicons/block-showcase.md),
   [buttons](lexicons/block-buttons.md), [images](lexicons/block-images.md), [shared definitions](lexicons/block-defs.md)).
5. [Examples](https://github.com/unset-sh/lexicons/blob/main/examples/README.md): nine sample records.
6. [Publication and compatibility](publication.md) and [Maintenance](maintenance.md).
7. [FAQ](faq.md).
