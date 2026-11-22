# Quick start

Create a profile and a new main page with one card, then read them back. The JSON below contains record values;
the surrounding XRPC request also needs the account's DID and the collection and record key described below.

## What you need

- An AT Protocol account and its DID.
- An OAuth session that may write `sh.unset.profile`, `sh.unset.page` and `sh.unset.card`.
  [Permissions](permissions.md) gives granular scopes that do not depend on resolving a permission set.
- A copy of these schemas to validate records locally.

Use the account's PDS for repository requests. Replace the sample DID and card key with your own account's DID
and a newly generated TID. The examples do not identify a working account or uploaded pictures.

## 1. Create the profile

A profile uses the record key `self`. All its fields are optional:

```json
{
  "$type": "sh.unset.profile",
  "displayName": "Sam Rivera",
  "headline": "Product designer. Maps, type and small tools.",
  "createdAt": "2026-11-21T15:04:05.000Z"
}
```

For a new profile, call `com.atproto.repo.putRecord` with collection `sh.unset.profile`, `rkey: "self"` and
`swapRecord: null`. The null precondition refuses to replace an existing record. If a profile already exists,
keep it; to edit it, merge your changes into its current value and pass its CID as `swapRecord`.

## 2. Create a card and a new main page

A card holds one block in `content`. The block names its type in `$type`:

```json
{
  "$type": "sh.unset.card",
  "content": {
    "$type": "sh.unset.block.text",
    "text": "## About\n\nI design maps and the tools around them."
  },
  "createdAt": "2026-11-21T15:05:00.000Z"
}
```

A card shows only when a page names it. The main page is `sh.unset.page/self`. Its card addresses use the
account's DID, never its handle:

```json
{
  "$type": "sh.unset.page",
  "cards": [{ "uri": "at://did:plc:abcdefghijklmnopqrstuvwx/sh.unset.card/3lzh2a2c3d4e2" }],
  "createdAt": "2026-11-21T15:05:00.000Z"
}
```

This sample creates a public page: absent `visibility` means public. Choose the intended
[visibility](reading-a-page.md#who-sees-the-page) before writing it.

Write the card and page in one `com.atproto.repo.applyWrites` call with two `create` operations: one in
`sh.unset.card` with your new TID, and one in `sh.unset.page` with `rkey: "self"`. The PDS commits both
operations atomically. If a page already exists, use the update procedure below instead of replacing it with
this sample.

Send this request body through your authenticated OAuth client to the account's PDS at
`POST /xrpc/com.atproto.repo.applyWrites`. The session must have both collections' write permissions. Replace
the sample DID everywhere and use your new TID in both the card's `rkey` and the page's card URI:

```json
{
  "repo": "did:plc:abcdefghijklmnopqrstuvwx",
  "writes": [
    {
      "$type": "com.atproto.repo.applyWrites#create",
      "collection": "sh.unset.card",
      "rkey": "3lzh2a2c3d4e2",
      "value": {
        "$type": "sh.unset.card",
        "content": {
          "$type": "sh.unset.block.text",
          "text": "## About\n\nI design maps and the tools around them."
        },
        "createdAt": "2026-11-21T15:05:00.000Z"
      }
    },
    {
      "$type": "com.atproto.repo.applyWrites#create",
      "collection": "sh.unset.page",
      "rkey": "self",
      "value": {
        "$type": "sh.unset.page",
        "cards": [
          { "uri": "at://did:plc:abcdefghijklmnopqrstuvwx/sh.unset.card/3lzh2a2c3d4e2" }
        ],
        "createdAt": "2026-11-21T15:05:00.000Z"
      }
    }
  ]
}
```

### Editing an existing page

1. Read the repository's head CID with `com.atproto.sync.getLatestCommit` **before** fetching the current page.
2. Read and validate `sh.unset.page/self`. A failed read is not permission to create a replacement.
3. Merge the intended edit into the stored value. Preserve `visibility`, `createdAt`, existing card references
   and every unknown field or reference you are not deliberately changing. Append the new card reference once.
4. Validate the merged page and card, then send a single `applyWrites` request: `create` for the new card,
   `update` for the existing page, and `swapCommit` set to the head CID from step 1.
5. If the PDS returns `InvalidSwap`, another write landed. Fetch again and rebuild the edit; do not retry the
   stale replacement unchanged.

To reorder cards, reorder their references while keeping entries your editor does not understand. To remove a
card from this page, remove its reference deliberately; deleting the card is a separate choice.

The reference application's
[writeCardAndList](https://github.com/Undefined6799/unset/blob/9817f1e7ed51fdd5989d6bad6261a9e167d97b80/infrastructure/pds/card-records.ts)
uses this commit precondition for a card and page written together.

## 3. Add a picture

Upload the picture to the same account's PDS with `com.atproto.repo.uploadBlob`, requesting `blob:image/*`
beside the repository permissions. Use the returned `blob` object unchanged in the image field.

This is an illustrative image value. Its CID is syntactically valid but does not stand for a supplied upload:

```json
{
  "image": {
    "$type": "blob",
    "ref": { "$link": "bafkreid5bn5prlhkc4xz3h6wctdutuzbvd3gdx6iekgxccv5gottg373hm" },
    "mimeType": "image/webp",
    "size": 268114
  },
  "alt": "A desk by a window with proof sheets pinned to the wall.",
  "aspectRatio": { "width": 3, "height": 2 }
}
```

Replace the whole `image` object with the upload response. Set `alt` and `aspectRatio` for the actual picture;
an empty `alt` marks a decorative image. See the [images block](lexicons/block-images.md) for a complete card.

## 4. Read the page

1. Fetch and validate `sh.unset.profile/self`. A missing or invalid profile shows no page.
2. Fetch and validate `sh.unset.page/self`. Confirmed absence shows the profile's header with no cards.
   An invalid page or failed fetch must not be interpreted as a public page.
3. Apply the page's visibility before showing its details. Fetch only valid card references to this account's
   own repository, in list order, showing each once.
4. Validate each card, skip missing or invalid records, and hide block types you do not know.

[Reading a page](reading-a-page.md) gives the complete reader rules.

## More examples

The [nine example records](../examples/README.md) cover the profile, page and every block type. They are
illustrative payloads checked against the schemas, not pre-existing records or retrievable media.
