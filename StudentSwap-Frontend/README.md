# StudentSwap Frontend

First frontend milestone for the StudentSwap college marketplace.

## Requirements
- Node.js (LTS recommended)
- npm

## Run on Windows PowerShell
1. Extract this ZIP.
2. Open PowerShell in the `StudentSwap-Frontend` folder.
3. Run:

```powershell
npm.cmd install
npm.cmd run dev
```

4. Open the local URL printed by Vite, usually `http://localhost:5173`.

If `npm` is blocked by PowerShell execution policy, use `npm.cmd` as shown above.

## Current milestone
- React + Vite
- Bootstrap and Bootstrap Icons
- Responsive homepage
- Sample product cards, category filtering and search
- Save/favourite toggle (temporary browser state only)
- Product detail modal
- Semester End Sale promotional section

## Not connected yet
This first milestone uses sample product data. Registration, real listings, Spring Boot APIs, MySQL persistence, secure login and image upload will be added in later milestones. Do not represent sample listings as real student listings.

## Main folders
- `src/App.jsx`: page and interactive UI
- `src/styles.css`: custom visual styling
- `src/main.jsx`: app entry point and CSS imports
