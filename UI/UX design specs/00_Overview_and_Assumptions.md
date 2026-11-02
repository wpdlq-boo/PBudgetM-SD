# Personal Budget Manager: UI/UX design spec (Lab 5) – Overview

Oct 18, 2026 · @Hale

This spec turns the Mini-SRS fix (every expense must carry a category) into ten mobile screens for the WAIS app (15 Figma frames once the states are counted) you can rebuild in Figma, with the matching clickable prototype published alongside it.

## Overview and assumptions

WAIS users feel broke at month-end because the app stores one lump total with no categories. The design fixes that in three moves: a category is required before any expense can be saved, a daily streak rewards complete logging, and the Home dashboard shows where the money went through a swipeable monthly heatmap, a budget view and recent purchases.

This version follows the WAIS screenshots you sent. Where they and the SRS left gaps, I assumed the following. Tell me which to change.

- **Format and style:** phone only, 390 px wide frames, WAIS blue and white, Inter typeface, one light theme. Every button label capitalizes each word.
- **Screens:** ten in total: Lock screen, Home (the dashboard), Amount, Category, Review, Saved, Summary, Manage Categories, History and Day summary. A small Forgot PIN screen sits behind the lock screen.
- **Frames:** the import file has 15 frames in each of two rows. Five of them are states: Manage Categories: Error, Manage Categories: Category Added, Manage Categories: Move Transactions First, History: Manage Transactions, and Day summary: By Category.
- **Wireframes and high-fidelity:** the wireframe row is grayscale, with a gray box and an X wherever the high-fidelity row shows an emoji. The high-fidelity row uses the blue-and-white scheme and emojis.
- **Navigation:** three tabs (Home, Summary, History) with a + button in the lower right of the tab bar, so an expense can be logged in one tap from any tab.
- **Lock screen:** 4-digit PIN (default 1234), Forgot PIN?, Continue With Google, and Use Without An Account. The P avatar on Home locks the app at once, and it locks itself after 1 minute of inactivity.
- **Heatmap measure:** each day's day-to-day spending against a ₱500 daily allowance. Rent, utilities, subscriptions and savings are left out so one bill does not paint a day red.
- **Budget and limits:** a ₱37,000 monthly budget and a limit per category. Budget Guard flags a category that is over its limit or at 80% or more.
- **Manage Categories:** its own screen, opened from the Manage Categories button on Summary. It sets the monthly budget, adds a category (name, optional monthly limit, icon) and sets a limit per category. Each category shows its transaction count and a Delete button. Deleting a category that has transactions opens "Move transactions first": the user picks another category, then taps Move & Delete, so nothing is left uncategorized. Adding and deleting take effect at once; Save Limits saves the budget and limits, and Cancel drops unsaved edits to them.
- **Currency and date:** pesos (₱); the demo "today" is Oct 18, 2026, and all amounts are made-up demo data.
- **Figma:** I can't write into your file, and I still can't open your Figma links, so your screenshots are my only view of copy-PBM. `wais-figma-import.html` is meant for the html.to.design plugin.

## How the task files map to the lab sheet

| File | Lab task | Points |
| --- | --- | --- |
| 01_Task1_Requirements_and_UX_Workflow.md | Task 1 – Requirements Analysis and UX Workflow | 15 |
| 02_Task2_Low_Fidelity_Wireframes.md | Task 2 – Low-Fidelity Wireframing | 15 |
| 03_Task3_High_Fidelity_UI_Design.md | Task 3 – High-Fidelity UI Design | 20 |
| 04_Task4_Components_and_Variants.md | Task 4 – Reusable Components and Variants | 15 |
| 05_Task5_Interactive_Prototyping.md | Task 5 – Interactive Prototyping | 20 |
| 06_Task6_Usability_Testing.md | Task 6 – Usability Testing | 15 |
