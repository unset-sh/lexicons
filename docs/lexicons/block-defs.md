---
title: "Shared block definitions"
description: "sh.unset.block.defs: the image shape the blocks share."
weight: 9
---

`sh.unset.block.defs` holds the definitions that more than one block uses. It is not a record or a block of its
own.

## Image

`sh.unset.block.defs#image` is a image stored as a blob in the repository of the record that holds the block, with its alt text
and proportions. The [gallery](block-gallery.md) and [showcase](block-showcase.md) blocks use it.

<!-- schema:sh.unset.block.defs#image -->
| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `image` | blob | Yes | `image/*`; up to 5,000,000 bytes | The image file. Readers never hand it to a browser without checking its type and re-encoding it; the declared type may be wrong. |
| `alt` | string | Yes | 2,000 graphemes; 20,000 bytes | Alt text for people who cannot see the image. An empty string means the image is decorative. |
| `aspectRatio` | `#aspectRatio` | Yes |  | The image's proportions, so a reader can reserve its space before it loads. |
| `caption` | string | No | 300 graphemes; 3,000 bytes | Text shown under the image, where the reader shows one. |
<!-- /schema -->

## Aspect ratio

`sh.unset.block.defs#aspectRatio` is a image's width to height. It has the same shape as
`app.bsky.embed.defs#aspectRatio`, so code that handles one handles the other.

<!-- schema:sh.unset.block.defs#aspectRatio -->
| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `width` | integer | Yes | minimum 1 |  |
| `height` | integer | Yes | minimum 1 |  |
<!-- /schema -->

## Example

A image as it appears inside a block:

```json
{
  "image": {
    "$type": "blob",
    "ref": { "$link": "bafkreid5bn5prlhkc4xz3h6wctdutuzbvd3gdx6iekgxccv5gottg373hm" },
    "mimeType": "image/webp",
    "size": 268114
  },
  "alt": "A desk by a window with proof sheets pinned to the wall.",
  "aspectRatio": { "width": 3, "height": 2 },
  "caption": "Proofs for the harbour atlas"
}
```

The [gallery block](block-gallery.md) has a complete card.

## View the lexicon

[`lexicons/sh/unset/block/defs.json`](https://github.com/unset-sh/lexicons/blob/main/lexicons/sh/unset/block/defs.json)

## Writing a image

- `alt` is required. Describe the image for someone who cannot see it. An empty string means it is decorative.
- `aspectRatio` is required. It may be approximate; the image's pixel size is a good choice.
- The blob must be in the same repository as the record that uses it.

## Reading a image

- **Never hand the blob to a browser as it is.** The declared type may be wrong, and a file served directly can
  carry content a browser will run. Check the file's real type and re-encode it, then serve your own copy.
- Reserve the image's space from `aspectRatio` before it loads. Clamp extreme proportions.
- Use `alt` as the image's text alternative. An empty string marks it as decorative.
- Show `caption` under the image where your layout has room for one.

## Related

- [Gallery block](block-gallery.md)
- [Showcase block](block-showcase.md)
