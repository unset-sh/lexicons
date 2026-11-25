---
title: "Text block"
description: "sh.unset.block.text: formatted text, written in Markdown."
weight: 4
---

`sh.unset.block.text` is formatted text, shown like a README.

## Overview

The text is Markdown. Use it for an introduction, a longer note, or anything that reads as prose.

## Schema

<!-- schema:sh.unset.block.text#main -->
| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `text` | string | Yes | 20,000 bytes | Markdown: CommonMark, which readers may extend with common syntax such as GFM tables, task lists and strikethrough. Syntax a reader does not support is shown as plain text. Readers never render raw HTML and keep only http and https links. Each reader chooses how to show a picture in the text, for example as a link, or loaded through its own proxy so the address never learns who reads it. |
| `tableStyle` | `#tableStyle` | No |  | How the tables in the text look. Only the look: a reader that ignores it shows the tables its own way, and the text means the same. |
| `textStyle` | `#textStyle` | No |  | How blocks of the text are aligned. Only the look: a reader that ignores it shows the text its own way, and the text means the same. |
<!-- /schema -->

## Looks

Two optional fields hold looks beside the Markdown, which stays the one source of the words. They change how a
reader shows the text, never what it says: a reader that ignores them shows the text its own way.

- `tableStyle` sets lines for the tables in the text: four switches that apply to every table, and `tables` for
  single cell sides.
- `textStyle` aligns single paragraphs, headings and block quotes to the centre or the end.

Each look names its block by `lines`: one fingerprint for each source line of the block. A fingerprint is the first
8 lowercase hexadecimal characters of SHA-256 over the line as UTF-8 with every space and tab removed. A table's
delimiter row is left out. Because the look carries the block's own fingerprints, it stays with its block when text
around it changes, and it can never land on other words.

### Table style

<!-- schema:sh.unset.block.text#tableStyle -->
| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `hideHeaderLine` | boolean | No |  | Hide the line under each table's header row. |
| `hideRowLines` | boolean | No |  | Hide the lines between body rows. |
| `showColumnLines` | boolean | No |  | Show lines between columns. |
| `showOutline` | boolean | No |  | Show a line around each table. |
| `tables` | array of `#tableEdges` | No | up to 20 items | Single cell sides, one entry for each table that has them. |
<!-- /schema -->

<!-- schema:sh.unset.block.text#tableEdges -->
| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `lines` | array of `#lineFingerprint` | Yes | up to 1,000 items; at least 1 items | The block this look was made for: one fingerprint for each of its source lines, in order. A table's delimiter row is left out. |
| `edges` | array of `#edge` | Yes | up to 250 items | Two neighbouring cells share one edge, so each side is stored once. A reader ignores an edge the table has no place for; when two entries name the same edge, the later one counts. |
<!-- /schema -->

<!-- schema:sh.unset.block.text#edge -->
| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `direction` | string | Yes | 32 bytes; known values: `horizontal`, `vertical` | horizontal: a side between rows; vertical: a side between columns. |
| `line` | integer | Yes | minimum 0; maximum 999 | Which grid line, from 0 at the top edge (horizontal) or the left edge (vertical). |
| `cell` | integer | Yes | minimum 0; maximum 999 | Which cell along that line: the column for a horizontal line, the row for a vertical one. |
| `hide` | boolean | No |  | Hide this side. Left out, the side is shown. |
<!-- /schema -->

### Text style

<!-- schema:sh.unset.block.text#textStyle -->
| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `align` | array of `#blockAlign` | No | up to 200 items | One entry for each aligned block. |
<!-- /schema -->

<!-- schema:sh.unset.block.text#blockAlign -->
| Property | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `lines` | array of `#lineFingerprint` | Yes | up to 1,000 items; at least 1 items | The block this look was made for: one fingerprint for each of its source lines, in order. A table's delimiter row is left out. |
| `value` | string | Yes | 32 bytes; known values: `center`, `end` | center, or end: the right side in left-to-right text. |
<!-- /schema -->

## Example

<!-- example:examples/sh/unset/actor/card/text.json -->
```json
{
  "$type": "sh.unset.actor.card",
  "content": {
    "$type": "sh.unset.block.text",
    "text": "## About\n\nI design maps and the tools around them. Before that I set type for a small press.\n\n- Open to freelance work from March\n- Talks and workshops on request\n\nRead more on [my site](https://example.com/about)."
  },
  "width": "full",
  "surface": "plain",
  "createdAt": "2026-11-21T15:05:00.000Z"
}
```
<!-- /example -->

This card keeps the Markdown as written. It shows lines between columns, hides one side between the two body
rows in the first column, and centres the paragraph.

<!-- example:examples/sh/unset/actor/card/text-looks.json -->
```json
{
  "$type": "sh.unset.actor.card",
  "content": {
    "$type": "sh.unset.block.text",
    "text": "## Opening hours\n\nWe are open on weekdays.\n\n| Day | Hours |\n| --- | --- |\n| Mon | 9-17 |\n| Tue | 9-17 |",
    "tableStyle": {
      "showColumnLines": true,
      "tables": [
        {
          "lines": [
            "e5ba6a98",
            "a5a2bde1",
            "d1b22274"
          ],
          "edges": [
            {
              "direction": "horizontal",
              "line": 2,
              "cell": 0,
              "hide": true
            }
          ]
        }
      ]
    },
    "textStyle": {
      "align": [
        {
          "lines": [
            "a043cd3f"
          ],
          "value": "center"
        }
      ]
    }
  },
  "width": "full",
  "surface": "plain",
  "createdAt": "2026-11-23T02:00:00.000Z"
}
```
<!-- /example -->

## View the lexicon

[`lexicons/sh/unset/block/text.json`](https://github.com/unset-sh/lexicons/blob/main/lexicons/sh/unset/block/text.json)

## Writing text

- Write [CommonMark](https://commonmark.org/). Readers may also support common extensions such as GFM tables,
  task lists and strikethrough, but none is guaranteed, so the text should still read well without them.
- Looks are optional. Leave them out unless you made the look for exactly that block. A change inside a block made
  outside the editor that wrote the look can end the match, and the block then shows as plain Markdown.
- Do not rely on raw HTML. Readers never render it.
- Link only to `http` and `https` addresses. Other links are dropped.
- Do not rely on a picture in the text being shown inline. Each reader decides. For pictures that must show, use
  the [images block](block-gallery.md).

## Reading text

- Never render raw HTML from the text.
- Keep only `http` and `https` links.
- Show syntax you do not support as plain text.
- Decide how to show a picture linked from the text: as a plain link, or loaded through your own proxy so the
  picture's host never learns who is reading. Do not let the browser fetch it directly.
- Hide the block when the text is empty.
- Apply a look only to a top-level block whose source lines give exactly the look's fingerprints, in order, and which
  ends there: the next line is blank, the end of the text, or the start of another top-level block. Read blocks as
  CommonMark with the GFM table extension only. Ignore any look that does not match, and show its block as plain
  Markdown. If looks share fingerprints but their numbers differ from the matching blocks, apply none of them.
- Ignore look fields and values you do not know.

## Related

- [Card lexicon](card.md)
- [Reading a page](../reading-a-page.md)
