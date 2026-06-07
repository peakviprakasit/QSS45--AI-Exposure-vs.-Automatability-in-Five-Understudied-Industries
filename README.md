# QSS 45 Final Project — AI's Impact on Labor Demand Across 5 Understudied Industries

How job-description language has shifted across **five under-studied industries** as generative-AI tooling matured (April 2024 → May 2026).

**Industries:** Pharmaceutical / Chemical Manufacturing, Legal Services, Farming / Ranching / Forestry, Insurance, Patent / IP Research.

**Sources:**
- LinkedIn scrape (May 2026) via `selenium` + `undetected-chromedriver` → ~5,200 postings
- Kaggle "LinkedIn Job Postings 2024" archive (April 2024) → ~8,600 postings (after industry filter)
- Pooled corpus: **~13,870 postings × 14 columns**

**Outcome variables:**
- `ai_term_freq` (continuous) — count of distinct AI flags / word count, modelled with OLS + HC3 robust SEs
- `ai_exposure_binary` (binary) — 1 if posting matches ≥1 AI flag, modelled with logistic + LightGBM (+ TF-IDF)
- **`exposure` & `automatability`** (two independent 0–1 zero-shot scores, notebooks 05–06) — read directly from posting text by `bart-large-mnli` (BERT) and `gpt-5.4-mini` (GPT); the project's headline **two-construct** measure

---

## Repository layout

```
QSS45_Final_Project/
├── code/                              # All numbered notebooks + utils.py
│   ├── 00_import_external_dataset.ipynb
│   ├── 01_scraping.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_eda.ipynb
│   ├── 04_modeling.ipynb
│   ├── 05_bert_analysis.ipynb
│   ├── 06_gpt_vs_bert_comparison.ipynb
│   ├── 99_view_data.ipynb            # Optional: dump CSVs into a single .xlsx
│   └── utils.py                       # Shared constants + functions
├── data/
│   ├── raw/                           # postings_<industry>[_<period>].csv
│   ├── processed/                     # postings_clean.csv, bert_embeddings.npy
│   └── external/                      # Drop external datasets here for 00_import to pick up
├── output/
│   ├── figures/                       # Static PNGs (paper) + interactive fig09_*.html (website)
│   └── tables/                        # table08_*.csv result tables
├── report/                            # PNAS LaTeX paper (final_report.tex + references.bib)
├── website/                           # React + Vercel public site (deliverable 3)
├── requirements.txt
├── .env.example                       # Template; copy to .env and fill in credentials
└── README.md
```

---

## Pipeline — how to run

Notebooks are numbered to run in order. Each one auto-resolves the project root at the top, so you can launch from any directory. **Recommended order on a fresh clone:**

| # | Notebook | Inputs | What it does | Outputs |
|---|---|---|---|---|
| **00** | `00_import_external_dataset.ipynb` | Folder dropped into `data/external/` (e.g. unzipped Kaggle "LinkedIn Job Postings 2024" archive) | Filters the external dataset to the 5 target industries via industry IDs + title regex; reshapes to project schema | `data/raw/postings_<industry>_<period>.csv`, `data/raw/postings_all_<period>.csv` |
| **01** | `01_scraping.ipynb` | `.env` (LinkedIn credentials) | Scrapes LinkedIn via Selenium for the 5 industries, current snapshot. Indeed + Wayback fallbacks for historical periods. Writes one CSV per industry with atomic `os.replace()` for safe concurrent reads. | `data/raw/postings_<industry>.csv`, `scraping.log` |
| **02** | `02_preprocessing.ipynb` | Every `data/raw/postings_<industry>*.csv` (pooled) | Deduplicates, strips HTML + LinkedIn UI boilerplate, parses dates, assigns time bins, applies 14 AI-term flags, computes word counts and AI-term frequency | `data/processed/postings_clean.csv` |
| **03** | `03_eda.ipynb` | `data/processed/postings_clean.csv` | Cross-sectional EDA: summary stats, histograms, bar charts by industry/seniority/employment type, industry × AI-term heatmap, per-industry violin of `ai_term_freq`, source-platform comparison | `output/figures/fig{1,2,4,8}*.png`, `output/figures/industry_ai_violin.png` |
| **04** | `04_modeling.ipynb` | `data/processed/postings_clean.csv` | OLS + logistic (HC3 robust SEs), LightGBM regression + classification, **LightGBM + TF-IDF** (best), PR-curve threshold tuning, SHAP, confusion matrix | `output/figures/fig{9-17}*.png`, `output/figures/pr_curve_*.png`, `data/processed/model_comparison.csv` |
| **05** | `05_bert_analysis.ipynb` | `data/processed/postings_clean.csv` | **Part A — zero-shot two-construct labeling** (`facebook/bart-large-mnli`): per-posting **exposure** + **automatability** probabilities, convergent validity vs the keyword DV, Claude-drafted validation-audit check, 2024→2026 within-industry contrast. **Part B — BERTopic** topic modeling, per-topic AI exposure, topic-share deltas | `data/processed/zeroshot_scores.csv`, `data/processed/bertopic_model/`, `data/processed/topic_assignments.csv`, `output/figures/fig{18-23}*.png` |
| **06** | `06_gpt_vs_bert_comparison.ipynb` | `data/processed/gold_labels.csv`, `data/processed/sweep/<model>.csv` | Head-to-head of BERT, cloud LLM labelers, ensembles, and trained course-style supervised models on the 100-row **Claude-drafted validation audit set**, per construct. This audit set is useful for model comparison but should not be treated as independent human annotation. Loads cached audit scores by default — **no API key needed** (set `RESCORE=True` to regenerate) | GPT-vs-BERT comparison table + methods note (in-notebook) |
| **07** | `07_labeler_experiments.ipynb` | `data/processed/gold_labels.csv`, `data/processed/sweep/<model>.csv` | Threshold sweep, hypothesis-wording sensitivity, ensemble + multiclass robustness checks on the audit set | `output/figures/fig24_threshold_sensitivity.png` |
| **08** | `08_final_results_2024_2026.ipynb` | `data/processed/final_selected_model_scores_stratified_sample.csv` | **Final within-industry 2024-vs-2026 analysis** (the paper's results): means, deltas, significance, two-construct map, posting-level density | `output/figures/fig08_*.png`, `output/tables/table08_*.csv` |
| **09** | `09_interactive_figures.ipynb` | `data/processed/final_selected_model_scores_stratified_sample.csv` | Interactive Plotly twins of the Notebook-08 figures, for the website | `output/figures/fig09_*.html` |
| **99** | `99_view_data.ipynb` | `data/raw/postings_*.csv` | Utility: combines all per-industry CSVs into a formatted Excel workbook for manual inspection | `data/raw/postings_all.xlsx` |

> **Note — final scores.** Notebook 06 selects the labeler and writes the analysis-ready final scores to `data/processed/final_selected_model_scores_stratified_sample.csv` (n = 2,614), with `gpt_scores.csv` and `ai_scores_panel.csv` (BERT + GPT side by side) as companions. Notebooks 07–09 consume these. The full pipeline (00–09) is committed under `code/`.

---

## Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure LinkedIn credentials (only needed if you re-run notebook 01)
cp .env.example .env
# Then edit .env and fill in LINKEDIN_EMAIL + LINKEDIN_PASSWORD
```

Notebook 05 has its own first-run install cell for `sentence-transformers`, `bertopic`, `umap-learn`, and `hdbscan` — these are heavy and not required for notebooks 01-04, so they're not in `requirements.txt`. Notebook 06 runs from cached gold scores with **no extra dependencies**; only re-scoring (`RESCORE=True`) needs `langchain_openai` + an `OPENAI_API_KEY` (read from the environment, never committed).

---

## Headline finding

**AI-term incidence in job descriptions, by industry × period:**

| Industry | April 2024 | May 2026 | Multiplier |
|---|---:|---:|---:|
| Legal Services | 4.8% | 24.7% | **5.1×** |
| Patent / IP Research | 11.8% | 37.9% | **3.2×** |
| Pharmaceutical / Chemical Mfg | 11.1% | 31.2% | **2.8×** |
| Insurance | 10.0% | 24.5% | **2.4×** |
| Farming, Ranching, Forestry | 9.1% | 15.9% | **1.7×** |

Every industry shows substantial growth; legal services and patent/IP fastest (consistent with Harvey AI's rise and LLM-based prior-art search).

### Two-construct result — AI exposure vs automatability (zero-shot labeling)

Keyword incidence only counts AI *mentions*. To separate **whether a role involves AI** from **whether it could be automated**, the current full-corpus GPT artifact scores every posting on two independent 0–1 constructs with `gpt-5.4-mini`. Notebook 06 now audits that original labeler against BERT, other cached cloud models, ensembles, and trained supervised models on a Claude-drafted validation-audit set:

- **Exposure rose, 2024 → 2026:** mean **0.061 → 0.098** (Welch *t* = 5.6, ***p* = 2.6×10⁻⁸**), concentrated in knowledge work (Patent/IP, Legal, Pharma); Farming and Insurance dip slightly.
- **Automatability stayed flat:** **0.334 → 0.324** (*t* = −1.0, ***p* = 0.31**) — a genuine null, robust to the choice of labeler.
- **Nearly independent:** at the posting level the two constructs correlate only **r = −0.11** (n = 2,614) — a job's AI exposure barely predicts how automatable it is.
- **Reading:** roles increasingly *involve* AI without becoming measurably more *replaceable* — two constructs telling two different stories.

**Labeler audit (100 Claude-drafted validation postings).** On the hard construct — automatability — `gpt-5.4-mini` reaches **AUC 0.871 / F1 0.612** (catches 15/18 routine roles at 0.5) vs BERT's near-chance **AUC 0.605** (1/18); on exposure the cached sweep finds stronger candidates than the originally shipped GPT run. BERT is retained as a free, reproducible cross-check. *Caveat: these audit labels were drafted by Claude, not independently human-reviewed, so treat the validation numbers as face-validity evidence rather than independent human-reviewed annotation.*

## Model performance summary

| Model | AUC | AUC-PR | Best F1 |
|---|---:|---:|---:|
| OLS (HC3) regression — `ai_term_freq` | R² = 0.04 | — | — |
| Logistic (HC3) — non-text features only | 0.70 | 0.18 | 0.02 |
| LightGBM — non-text features only | 0.69 | 0.21 | 0.00 |
| **LightGBM + TF-IDF** (with AI terms masked) | **0.89** | **0.71** | **0.65** |

*(Models above predict the keyword DV `ai_exposure_binary`. The BERT and GPT **zero-shot labelers** in notebooks 05–06 are audited instead against the **Claude-drafted validation set** — the original `gpt-5.4-mini` run reaches exposure AUC ≈ 0.94 / F1 0.75 and automatability F1 0.61, while cached candidates score higher on the validation audit; see the two-construct result above.)*

---

## Diagnostics convention

Every notebook prints row counts before/after major transformations (load, dedupe, dropna, train/test split, model fit) so changes to upstream data are obvious from the run log.

---

## Data provenance

- `data/raw/postings_<industry>.csv` — scraped from LinkedIn in May 2026 by `01_scraping.ipynb`. Per-industry files; `source_platform = 'linkedin'`.
- `data/raw/postings_<industry>_2024.csv` — derived from the Kaggle "LinkedIn Job Postings 2024" public archive via `00_import_external_dataset.ipynb`. `source_platform = 'linkedin_2024'`.
- `data/raw/postings_all_2024.csv` — combined version of the above.
- `data/processed/postings_clean.csv` — pooled, deduplicated, AI-flagged corpus written by `02_preprocessing.ipynb`. Schema preserves `source_platform` for period-stratified downstream analyses.

---

## Reproducibility notes

- All random seeds = `42` (notebooks 04, 05).
- Train/test split: 20% held out, stratified on the binary outcome.
- BERT embeddings and BERTopic models are **cached to disk** in `data/processed/`; re-runs skip the expensive computation if the cached job-id alignment matches.
- LinkedIn DOM changes will eventually break `01_scraping.ipynb`. The selectors target classes that have been stable since 2024 but YMMV.
