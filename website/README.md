# Project website — AI Exposure vs. Automatability (QSS 45)

A single-page React site telling the project's narrative arc
(**question → data → method → result → takeaway**) and embedding the key static
figures plus the interactive Plotly versions.

Built with **Vite + React**; deploys to **Vercel** as a static site.

## Run locally
```bash
cd website
npm install
npm run dev        # http://localhost:5173
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. On vercel.com → **New Project** → import the repo.
3. Set **Root Directory = `website`**. Vercel auto-detects Vite
   (Build Command `npm run build`, Output Directory `dist`).
4. Deploy. ⚠️ The course rule: **pushes after the deadline = zero for the website**,
   so deploy and confirm the live URL with time to spare.

## Structure
```
website/
├── index.html              # Vite entry (app shell)
├── src/
│   ├── main.jsx            # React root
│   ├── App.jsx             # the full narrative (edit copy here)
│   └── styles.css          # styling (data palette: teal/rust/ink)
├── public/figures/         # embedded figures (PNG + interactive HTML)
└── portfolio_legacy/       # your previous personal portfolio, preserved
```

## Before you ship — fill these in (`src/App.jsx`)
- `PAPER_URL` — drop the compiled `final_report.pdf` into `website/public/` and set
  `PAPER_URL = '/final_report.pdf'`.
- `REPO_URL` — your GitHub repository URL.
- `[[Your Name]]` in the footer.

## Embedded figures
Static: `fig08_mean_scores_by_year.png`, `fig08_industry_profile_exposure_vs_automation.png`,
`fig18_zeroshot_vs_keyword.png`, `fig4_ai_term_heatmap_industry.png` (+ joint-density / ECDF PNGs).
Interactive: `fig09_movement_map.html`, `fig09_joint_density.html`,
`fig09_distribution_shift_ecdf.html`, `fig09_industry_compare.html`.

To add or refresh a figure: copy it into `public/figures/` and reference it as
`/figures/<name>` in `App.jsx`. (Re-run notebooks 08/09 to regenerate the source files.)

> Note: the interactive HTMLs embed Plotly (~5 MB each). To slim the deploy, you can
> swap any `<Embed>` back to a static `<FigureImg>` PNG.
