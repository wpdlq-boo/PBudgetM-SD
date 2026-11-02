# Task 1 – Requirements Analysis and UX Workflow (15 Points)

Personal Budget Manager (WAIS) · Lab 5

**Objective (from the lab sheet):** Translate the system scenario into functional requirements and a logical user journey.

**Expected output:** Functional requirements table and UX workflow diagram.


## Primary users and functional requirements

The primary user is a young working professional (18–25) on a fixed salary who logs expenses on a phone in a few seconds. The App Administrator role from the SRS has no screens in this slice.

| ID | The system shall… | SRS source | Screen |
| --- | --- | --- | --- |
| FR-01 | let the user enter an expense amount and date | FR-001 | Amount |
| FR-02 | require a preset or custom category before an expense can be saved | Mandatory categorization | Category |
| FR-03 | let the user create a custom category with an emoji, while logging or from Manage Categories | Custom categories | Category, Manage Categories |
| FR-04 | show a summary with Edit Details and Confirm And Save before saving | FR-001 (edit) | Review |
| FR-05 | block progress and say what is missing when the amount or category is empty, then let the user correct it | Lab Task 1 | Amount, Category |
| FR-06 | protect the app with a 4-digit PIN (default 1234), with Forgot PIN?, Continue With Google and Use Without An Account, lock at once from the P avatar on Home, and lock again after 1 minute of inactivity | FR-005 | Lock screen, Home |
| FR-07 | confirm the save and add 1 to the streak only on the first fully categorized log of the day | FR-003 | Saved, Home |
| FR-08 | show a Home dashboard with streak, remaining savings, Budget Guard, quick actions, heatmap and latest activity, scrolling vertically | FR-002, FR-004 | Home |
| FR-09 | show the heatmap as a calendar that scrolls sideways month by month, with a year switch, 3 green and 3 red shades, and a day summary on tap that toggles between transactions and categories | Heatmap | Home, Day summary |
| FR-10 | show spending by category for a week, month or year, each with an emoji, its share and its limit progress | FR-002, FR-004 | Summary |
| FR-11 | list purchases with the total logged, and let the user edit or delete them | FR-001 | History |
| FR-12 | show a + button in the lower right of every tab to log a new transaction | FR-001 | Home, Summary, History |
| FR-13 | let the user set the monthly budget, add a category with an optional limit and icon, set a limit per category, and delete a category only after moving its transactions to another category | Custom categories, FR-004 | Manage Categories |

## UX workflow and screens

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
