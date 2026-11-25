# Example records

These nine JSON files are illustrative record values. They cover the profile, main page and each supported
block inside a card. They are checked against the schemas; they do not identify an existing account or provide
uploaded media.

| Example | Contents |
| --- | --- |
| [Minimal profile](sh/unset/actor/profile/minimal.json) | Profile with an optional creation time |
| [Full profile](sh/unset/actor/profile/full.json) | Name, picture and description |
| [Minimal page](sh/unset/actor/page/minimal.json) | Page with an optional creation time and no cards |
| [Main page](sh/unset/actor/page/main.json) | Ordered references to five cards |
| [Text card](sh/unset/actor/card/text.json) | Markdown text |
| [Text card with looks](sh/unset/actor/card/text-looks.json) | Markdown text with table lines and alignment |
| [Links card](sh/unset/actor/card/links.json) | Links to other sites |
| [Showcase card](sh/unset/actor/card/showcase.json) | Titled entries with images |
| [Buttons card](sh/unset/actor/card/buttons.json) | Link and email buttons |
| [Gallery card](sh/unset/actor/card/gallery.json) | Images with alt text and proportions |

Before writing, replace the sample DID and card keys with your account's DID and new TIDs. Replace every blob
object with the result of an upload to that account's PDS. Sample CIDs are valid syntax, not supplied uploads.

All profile and page fields are optional: `{ "$type": "sh.unset.actor.profile" }` and
`{ "$type": "sh.unset.actor.page" }` are valid smaller records than the timestamped examples.

Follow the [quick start](../docs/quick-start.md) to create new records. For existing records, preserve fields
and references you are not deliberately changing, including page visibility, and use optimistic concurrency.
The [reader guide](../docs/reading-a-page.md) explains which records show and how to handle malformed data.
