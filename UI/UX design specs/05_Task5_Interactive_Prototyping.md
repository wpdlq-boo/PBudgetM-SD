# Task 5 – Interactive Prototyping (20 Points)

Personal Budget Manager (WAIS) · Lab 5

**Objective (from the lab sheet):** Develop a clickable prototype simulating the complete process.

**Expected output:** Functional interactive prototype containing at least five connected screens.


In Figma's Prototype mode, set the Navigate rows as On click → Navigate to, with a Move in transition (200 ms). The Delete row uses Open overlay and the Keep Category row uses Close overlay. Figma cannot check a field, so draw the error cases as extra frames: Amount\_Empty with the Disabled button, which links to Amount\_Error, the same pair for Category and for a wrong PIN, and Manage Categories: Error for an empty category name.

| Trigger | Action | Result |
| --- | --- | --- |
| Click Unlock & Continue (PIN 1234) | Navigate to | Home |
| Click Unlock & Continue (wrong PIN) | Navigate to | Lock\_Error: "Incorrect PIN. Try again." |
| Click Continue With Google or Use Without An Account | Navigate to | Home |
| Click Forgot PIN? | Navigate to | Forgot PIN |
| Click + (any tab) or Log Expense | Navigate to | Amount |
| Click Next: Choose Category (Amount, filled) | Navigate to | Category |
| Click Next: Choose Category (Amount, empty) | Navigate to | Amount\_Error: "Enter an amount above ₱0 to continue." |
| Click a category tile | Change to | Category\_Tile Selected |
| Click Next: Review (Category, chosen) | Navigate to | Review |
| Click Next: Review (Category, none) | Navigate to | Category\_Error: "Choose a category to continue." |
| Click Change (Review) | Navigate to | Category |
| Click Edit Details | Navigate to | Amount |
| Click Confirm And Save | Navigate to | Saved |
| Click Back To Home | Navigate to | Home |
| Click See Where It Went, Budget Guard or Budgets | Navigate to | Summary |
| Click Manage Categories (Summary) | Navigate to | Manage Categories |
| Click Add Category (name empty) | Navigate to | Manage Categories: Error |
| Click Add Category (valid) | Navigate to | Manage Categories: Category Added |
| Click Delete (a category) | Open overlay | Manage Categories: Move Transactions First |
| Click Keep Category | Close overlay | Manage Categories |
| Click Move & Delete | Navigate to | Manage Categories, without that category |
| Click Save Limits or Cancel | Navigate to | Summary |
| Click View All or History | Navigate to | History |
| Click Manage Transactions | Navigate to | History: Manage Transactions |
| Click Done (History) | Navigate to | History |
| Click Edit (History, manage mode) | Navigate to | Amount |
| Click a heatmap day cell | Navigate to | Day summary |
| Click By Category (Day summary) | Navigate to | Day summary: By Category |
| Click Transactions (Day summary) | Navigate to | Day summary |
| Click Back (Day summary) | Navigate to | Home |
| Click Lock PIN or the P avatar (also after 1 minute idle) | Navigate to | Lock screen |
| Drag the heatmap sideways | Scroll | Previous or next month |

## Heatmap scrolling

In Prototype mode, give the heatmap strip Horizontal scrolling so it swipes month by month. The import file shows only October 2026 in the heatmap, so duplicate that month frame side by side to build the strip.
