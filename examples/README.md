# Example records

These nine JSON files are illustrative record values. They cover the profile, main page and each supported
block inside a card. They are checked against the schemas; they do not identify an existing account or provide
uploaded media.

| Example | Contents |
| --- | --- |
| [Minimal profile](sh/unset/profile/minimal.json) | Profile with an optional creation time |
| [Full profile](sh/unset/profile/full.json) | Name, headline, picture and account details |
| [Minimal page](sh/unset/page/minimal.json) | Page with an optional creation time and no cards |
| [Main page](sh/unset/page/main.json) | Ordered references to five cards |
| [Text card](sh/unset/card/text.json) | Markdown text |
| [Links card](sh/unset/card/links.json) | Links to other sites |
| [Showcase card](sh/unset/card/showcase.json) | Titled entries with pictures |
| [Buttons card](sh/unset/card/buttons.json) | Link and email buttons |
| [Images card](sh/unset/card/images.json) | Pictures with alt text and proportions |

Before writing, replace the sample DID and card keys with your account's DID and new TIDs. Replace every blob
object with the result of an upload to that account's PDS. Sample CIDs are valid syntax, not supplied uploads.

All profile and page fields are optional: `{ "$type": "sh.unset.profile" }` and
`{ "$type": "sh.unset.page" }` are valid smaller records than the timestamped examples.

Follow the [quick start](../docs/quick-start.md) to create new records. For existing records, preserve fields
and references you are not deliberately changing, including page visibility, and use optimistic concurrency.
The [reader guide](../docs/reading-a-page.md) explains which records show and how to handle malformed data.
