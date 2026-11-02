# Task 3 – High-Fidelity UI Design (20 Points)

Personal Budget Manager (WAIS) · Lab 5

**Objective (from the lab sheet):** Convert the wireframes into visually consistent mobile interfaces.

**Expected output:** Five high-fidelity mobile screens using Frames, Auto Layout, and consistent visual design (this design has 15).


## Design tokens

Save the colors below as Figma color styles and the type scale as text styles.

| Token | Value | Use |
| --- | --- | --- |
| Ink | #111827 | Headings, amounts |
| Text / Muted | #1F2937 / #586274 | Body / secondary text |
| Blue | #3B63E5 | Primary button, + button, Remaining savings card, selected border, links |
| Blue hover / pressed | #2F52CC / #2543A8 | Button states |
| Canvas | #E3EDFF fading to #F8FAFD | Screen background, top to bottom |
| Surface | #FFFFFF | Cards, inputs, tab bar |
| Card border / Field border | #E1E7F0 / #8A94A8 | Cards / form fields |
| Selected fill | #EEF4FF | Chosen tile, active tab |
| Disabled fill / text | #DDE3EE / #4A5B78 | Disabled button |
| Error | #C42B3F on #FDECEF | Inline errors, over-limit cards |
| Streak card | #FFF5E8, badge #C2410C | Streak with freeze shield |
| Budget Guard card | #243B87 | Budget Guard |
| Savings progress | #6EDBA4 on #2543A8 | Bar on the Remaining savings card |

## Typography and spacing

| Text style | Size / line height | Weight |
| --- | --- | --- |
| Brand (WAIS) | 64 / 64 | ExtraBold |
| Hero amount | 40 / 48 | ExtraBold |
| Greeting | 30 / 36 | ExtraBold |
| Title and section | 22–26 / 28–32 | ExtraBold |
| Button | 17 / 24 | ExtraBold |
| Body | 16 / 24 | Regular |
| Label | 15 / 20 | Bold |
| Eyebrow (uppercase, +12% tracking) | 13 / 18 | Bold |
| Caption | 13 / 18 | Regular |

The typeface is Inter (free on Google Fonts), as in your WAIS screenshots. Spacing steps are 4, 8, 12, 16 and 24. Corner radii: hero card 28, card 24, button 18, field 14, tile 18, + button 20, heatmap cell 12.

## Auto Layout and constraints

| Element | Auto Layout | Constraints |
| --- | --- | --- |
| Back pill (48 px tall) | Horizontal, icon plus label | Top and left |
| Content area | Vertical, padding 16, gap 16, fill container | Left and right, scrolls |
| Button group | Vertical, gap 12 | Bottom, left and right |
| Tab bar (72 px tall, 12 px side margins) | Horizontal: three tabs (56 px) and the 64 × 56 + button on the right | Bottom, left and right |
| Category grid | Horizontal wrap, 2 columns, gap 12 | Left and right |
| Heatmap strip | Horizontal, one 348 px month frame per month, clip content on | Left and right |
| Month calendar | Horizontal wrap, 7 columns, gap 2 | Left and right |

## Sizing and accessibility

Every tappable control is at least 48 × 48 px, including the heatmap day cells. The delete dialog sits on a dark overlay (#0F172A at about 55%) and has 28 px corners and 24 px padding.

## Heatmap visual rules

The heatmap lives on Home. Each month is one calendar page in a strip that scrolls sideways from Jan 2025 to the current month, with previous and next buttons and a 2025 / 2026 year switch. Each day takes one shade from its day-to-day spending against the ₱500 allowance. Food, Grocery, Transit, Shopping, Entertainment and custom categories count; Rent, Utilities, Subscriptions and Savings do not. A day with only fixed bills counts as Green 3, and a day with no entries stays gray.

| Shade | Spend up to | Fill | Day number |
| --- | --- | --- | --- |
| Green 3 (lowest spend) | ₱200 | #1F7A4D | White |
| Green 2 | ₱350 | #5DB885 | Ink |
| Green 1 | ₱500 | #BFE3CC | Ink |
| Red 1 | ₱625 | #F6C6C1 | Ink |
| Red 2 | ₱800 | #E67A72 | Ink |
| Red 3 (highest spend) | above ₱800 | #B3261E | White |
| Nothing logged | none | #E6EBF3 | Ink |

The legend under the calendar reads Less spent to More spent. Red cells get a small dot in the corner so color-blind users can still tell over-allowance days apart. Future days are shown but cannot be tapped. In the import file the Home frame shows October 2026 only; add the other months as frames beside it.

The import file shows only October 2026 in the heatmap, so duplicate that month frame side by side to build the strip.
