# UI Context

## Theme

Off-Light only. The visual language is a bright, cinematic, and modern editorial experience — creamy off-white backgrounds, soft stone surfaces, and high-contrast ink typography.

| Role | CSS Variable | Value / Concept |
| --- | --- | --- |
| Page background | `--bg-base` | `#F7F7F5` (Cinematic Off-White / Warm Pearl) |
| Surface / Lightbox | `--bg-surface` | `#EBEBE8` (Soft Stone / Light Oyster) |
| Subtle surface | `--bg-subtle` | `#DFDFDC` (Warm Muted Grey) |
| Primary text | `--text-primary` | `#111111` (Rich Charcoal / Ink Black) |
| Muted/Outline text | `--text-muted` | `#888888` (Soft Mid-Grey for inactive states/outlines) |
| Accent (Hover/Active) | `--accent-primary` | `#000000` (Deepening to pure black on hover) |

## Typography

The typography relies on a high-end "Modern Editorial" contrast, mixing two distinct font families to create a bespoke, artistic flavor.

| Role | Font Style | Usage |
| --- | --- | --- |
| Headers & Structure | Bold, tightly spaced Sans-Serif | Massive hero text, marquees, dates, and primary structural elements.

 |
| Accents & Body | Sophisticated, italicized Serif | Subtitles, event names, numbering (01, 02), and static text in the conversational form.

 |

### How this impacts the interactions:

* **Conversational Contact Form:** The input fields will now be soft mid-grey underlines (`#888888`). When focused, they will darken to pure black (`#000000`), and the user's typed text will appear in the bold Sans-Serif ink black font (`#111111`).
* **Hover Reveals:** When hovering over the horizontal service list, the inactive text will dim to the muted grey, and the active hovered text will darken to pure black, contrasting beautifully against the cinematic video reveals.