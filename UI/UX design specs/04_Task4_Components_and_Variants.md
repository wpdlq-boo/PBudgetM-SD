# Task 4 – Reusable Components and Variants (15 Points)

Personal Budget Manager (WAIS) · Lab 5

**Objective (from the lab sheet):** Create reusable interface elements for consistency and maintainability.

**Expected output:** One component set (Primary_Action_Button) containing four variants.


## Primary_Action_Button

Build `Primary_Action_Button` first, as one component set with a State property. It is 56 px tall, fills the container width, has 18 px corner radius and 17 px extra-bold white text, with a Label text property. Place instances on Lock, Amount, Category, Review, Saved, History and Manage Categories (Add Category and Save Limits), then change the Default fill to show every instance update.

| Variant | Fill | Text | When it shows |
| --- | --- | --- | --- |
| Default | #3B63E5 | #FFFFFF | Standard primary action |
| Hover | #2F52CC | #FFFFFF | Pointer over the button |
| Active | #2543A8, moved down 1 px | #FFFFFF | Button pressed |
| Disabled | #DDE3EE | #4A5B78 | PIN, amount or category still missing |

## Supporting components

Ten more components keep the screens consistent. Every button label capitalizes each word.

| Component | Variants | Spec |
| --- | --- | --- |
| Secondary\_Action\_Button | Default, Hover, Active | White fill, 2 px #3B63E5 border, blue text, 56 px tall; used for Edit Details, Continue With Google, See Where It Went, Cancel, Keep Category |
| Danger\_Button | Default | Same size as the primary button, #C42B3F fill, white text; used for Move & Delete |
| Small\_Button | Default, Danger | 48 px tall, 14 px radius, 1.5 px border; Edit and Show More are blue, Delete is red (#C42B3F) with a trash icon |
| FAB\_Log | Default, Pressed | 64 × 56, radius 20, white + icon on #3B63E5; sits at the right end of the tab bar on Home, Summary and History |
| Category\_Tile | Default, Selected | 60 px tall, emoji plus name; Selected adds a 3 px blue border, #EEF4FF fill and a check |
| Category\_Card | Default, Over limit | Summary list item: emoji tile, name, percent, spent against limit, progress bar. Over limit uses a red border and bar |
| Limit\_Card | Default | Manage Categories list item: emoji tile, name, limit field (₱ prefix), transaction count, Delete button |
| Delete\_Dialog | With transactions, No transactions | White card, 28 px radius, trash icon in a #FDECEF tile, title, text, Move transactions to picker (with transactions only), Keep Category and Move & Delete side by side |
| Icon\_Placeholder | Default | Wireframe only: 26 px light gray rounded box with an X, in place of an emoji |
| Heatmap\_Cell | None, Green 1–3, Red 1–3 | 48 × 48 px, radius 12, day number centered; red cells carry a small dot so color is not the only signal |
