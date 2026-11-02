# Task 2 – Low-Fidelity Wireframing (15 Points)

Personal Budget Manager (WAIS) · Lab 5

**Objective (from the lab sheet):** Establish the structural layout and navigation of the proposed application.

**Expected output:** Five complete low-fidelity wireframes (this design has 15 frames in the wireframe row).


## Figma file and frames

Name the file `LAB5_MINI_SRS_Section_G1G1`. The Free plan allows 3 pages, so use: Wireframes + Flow, High-fidelity + Components, and Prototype. Every frame is 390 px wide with vertical Auto Layout, 16 px padding and 16 px gap. Lock, Home, Summary, Manage Categories and History are taller than 844 px: let the frame grow to fit its content and pin the tab bar to the bottom. The dialog frame (11) is 844 px tall. For a head start, import `wais-figma-import.html` with the html.to.design plugin, which gives 15 frames in each row.

## Wireframe rules

- **Wireframes and high-fidelity:** the wireframe row is grayscale, with a gray box and an X wherever the high-fidelity row shows an emoji. The high-fidelity row uses the blue-and-white scheme and emojis.
- In the wireframe row, every emoji is replaced by a 26 px light gray rounded box with an X.
- Use grayscale only: no decorative colors, shadows or complex styling.

| Component | Variants | Spec |
| --- | --- | --- |
| Icon\_Placeholder | Default | Wireframe only: 26 px light gray rounded box with an X, in place of an emoji |

## Frames to wireframe

The logging path is Lock → Home → Amount → Category → Review → Saved, with four decision points: unlock, no amount, no category, and details not correct. The drawn flowchart is on the Workflow tab of the prototype. The numbers and names below match the frames in the import file. Frames 9, 10, 11, 13 and 15 are states of the frame before them; build each as its own frame, or as a variant of the frame before it, so the prototype connections stay simple.

| # | Frame | Required UI elements | Goes to |
| --- | --- | --- | --- |
| 1 | Lock screen | Logo, WAIS title and tagline, 4 PIN dots, keypad (1–9, Clear, 0, Delete), Unlock & Continue, Forgot PIN?, Continue With Google, Use Without An Account | Unlock → Home |
| 2 | Home | Greeting and P avatar (tap it to lock the app), streak card with freeze shield, Remaining savings card, Budget Guard, quick actions (Budgets, History, Log Expense, Lock PIN), daily heatmap with month swipe, year switch and legend, latest activity, tab bar with + button; scrolls vertically | + → Amount; day cell → Day summary; Budget Guard → Summary |
| 3 | Amount | Back, step 1 of 3, amount field, date field (not after today), optional note, error text, Next: Choose Category button | Next → Category |
| 4 | Category | Back, step 2 of 3, 9 preset tiles (emoji and name) plus New Category tile, selected state, error text, Next: Review button | Next → Review |
| 5 | Review | Back, step 3 of 3, summary card (amount, category with Change link, date, note), Edit Details and Confirm And Save buttons | Confirm → Saved; Edit → Amount |
| 6 | Saved | Success mark, saved line, streak card with message, Back To Home, See Where It Went | Home; Summary |
| 7 | Summary | Back, Week / Month / Year switch, monthly budget card, total, donut chart, largest-category line, Manage Categories button, category cards (emoji, spent against limit, share, bar), tab bar with + button | Manage Categories → frame 8; tab bar |
| 8 | Manage Categories | Icon-only back button, title, total monthly budget field with the allocated line, Add a Category card (Category Name, Monthly Limit (Optional), six icons, Add Category), Set your limits list (per category: icon, name, limit field, transaction count, Delete), Save Limits, Cancel | Save Limits → Summary; Cancel → Summary; Delete → frame 11 |
| 9 | Manage Categories: Error | Frame 8 with the red message "Enter a category name." above Add Category | Fix the field and try again |
| 10 | Manage Categories: Category Added | Frame 8 with a green message such as "Computer was added." under the Add a Category card, and the new category in the list | Continue on frame 8 |
| 11 | Manage Categories: Move Transactions First | Dialog over frame 8, with the page behind it locked: trash icon, "Move transactions first", the category name and its transaction count, a Move transactions to picker (starts on Food & Dining), Keep Category and Move & Delete. A category with no transactions gets a shorter Delete confirmation | Move & Delete → frame 8 without that category; Keep Category → frame 8 |
| 12 | History | Back, total purchases logged, the "Things you bought" heading with Manage Transactions under it, purchase list (emoji, title, category, amount, date), Show More, Log New Transaction, tab bar with + button | Manage Transactions → frame 13; tab bar |
| 13 | History: Manage Transactions | Frame 12 with Manage Transactions turned into Done, and Edit and Delete on every row; Delete asks Yes, Delete or Cancel inside the row | Edit → Amount; Done → frame 12 |
| 14 | Day summary | Back, date, total against allowance, Transactions / By Category toggle, transaction list, empty state | By Category → frame 15; Back → Home |
| 15 | Day summary: By Category | Frame 14 with By Category selected and category cards in place of the transaction list | Transactions → frame 14 |
