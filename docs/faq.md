# FAQ

## Are these lexicons published?

They are available here as source files. The imported source records no AT Protocol publication; this is not a
live check of DNS or the publishing account. See [Publication and compatibility](publication.md) for the
difference and the compatibility commitments that begin with third-party adoption.

## Do I need permission to read someone's page?

No. Profile, page and card records are public records in the person's repository. Any app can read them.

## Can I make a page private?

No. A page's `visibility` asks apps to limit who they show it to, and well-behaved apps follow it, but the
records stay public on the network. An app should never describe a page as private.

## Why are the profile and the page separate records?

They change for different reasons. The profile is who the account is, and every place that names the account
reads it. The page is what one page shows, and only that page reads it. Keeping them apart also leaves room for
more than one page per account later, without changing the profile.

## Why is a card a separate record from the page?

So a card can be edited, added or removed on its own, so a page can hold many cards without one large record,
and so one card can appear on more than one page. The page keeps only the order.

## Why does the page list its cards?

The list is what makes a card part of the page. It gives one place to reorder cards, hide a card without
deleting it, and ignore cards the account did not choose to show.

## Can an account have more than one page?

The page's record key allows it, but readers show only the main page, `self`, today. Other pages wait until
there is an agreed place to show them.

## Why are blocks separate lexicons?

A block describes content and nothing about the card around it. Keeping blocks in their own group,
`sh.unset.block.*`, means the same block can be used by another record later, and a new block can be added
without changing the card.

## Can I add my own block type?

Yes. A card's `content` is an open union, so an app may store a type from its own namespace there. Readers that
do not know the type hide the card, so the page still works everywhere. Define the type in a lexicon under a
domain you control, never under `sh.unset`.

## What happens when I meet a value I do not know?

Follow the field's description. Each field with known values says what an absent or unknown value means, for
example "absent or unknown means full". An unfamiliar value alone is not an error; the field must still meet
its type and length constraints.

## How do the lexicons change?

The [evolution rules](https://atproto.com/specs/lexicon#lexicon-evolution) preserve compatibility for both old
and new readers. Optional fields, known string values and members of open unions may be added. Existing types,
required fields and limits stay compatible; breaking changes require a new name. Publication through DNS is not
the only trigger: public adoption by another app also establishes this obligation.

## Is there an SDK or npm package?

There is no published SDK or npm package. This repository provides schemas, examples and documentation.
Generate types for your language with the standard tools, for
example [`@atproto/lex`](https://www.npmjs.com/package/@atproto/lex) for TypeScript, pointed at the `lexicons/`
folder.

## Where do pictures live?

In the person's own repository, as blobs. A record refers to a blob by its content address. Readers fetch the
blob from the person's PDS, check it and re-encode it before showing it.

## Who maintains this?

[unset.sh](https://unset.sh). Open an issue in this repository for questions or proposals.

[Maintenance](maintenance.md) explains where the imported schemas come from and how documentation is checked.
