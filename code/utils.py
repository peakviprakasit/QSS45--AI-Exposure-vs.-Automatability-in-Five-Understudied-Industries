"""
QSS 45 Final Project — shared utility module.

Consolidates functions and constants used across the notebooks so each notebook
does not redefine them locally. Import as:

    from utils import (
        INDUSTRY_KEYS, INDUSTRY_LABELS, TIME_BIN_DATES, AI_TERMS,
        clean_text, apply_ai_flags, assign_time_bin, mask_ai_terms,
    )

All path constants assume cwd is the project root. The notebooks include a
small bootstrap that ensures this regardless of launch location.
"""

from __future__ import annotations

import html
import re
from datetime import datetime
from pathlib import Path
from typing import Dict


# ===========================================================================
# Path constants
# ===========================================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATA_DIR        = PROJECT_ROOT / 'data'
RAW_DIR         = DATA_DIR / 'raw'
PROCESSED_DIR   = DATA_DIR / 'processed'
EXTERNAL_DIR    = DATA_DIR / 'external'

OUTPUT_DIR      = PROJECT_ROOT / 'output'
FIG_DIR         = OUTPUT_DIR / 'figures'


# ===========================================================================
# Project taxonomy
# ===========================================================================

INDUSTRY_KEYS = [
    'pharma_chem', 'legal_services', 'farming_forestry', 'insurance', 'patent_ip',
]

INDUSTRY_LABELS = {
    'pharma_chem':      'Pharmaceutical / Chemical Manufacturing',
    'legal_services':   'Legal Services',
    'farming_forestry': 'Farming, Ranching and Forestry',
    'insurance':        'Insurance',
    'patent_ip':        'Patent Analysis and IP Research',
}

# LinkedIn industry-ID → our bucket (used by 00_import_external_dataset)
INDUSTRY_ID_MAP = {
    'pharma_chem':      [12, 15, 54, 690, 3238],
    'legal_services':   [9, 10],
    'farming_forestry': [63, 201, 298],
    'insurance':        [42, 1725, 1737, 1743],
}


# ===========================================================================
# Time-bin definitions (AI breakpoints, GPT-3 → present)
# ===========================================================================

TIME_BINS_ORDERED = [
    'pre_gpt3', 'gpt3_era', 'copilot_chatgpt', 'gpt4_harvey', 'gpt4o_present',
]

TIME_BIN_DATES = {
    'pre_gpt3':        ('2015-01-01', '2020-09-30'),
    'gpt3_era':        ('2020-10-01', '2022-05-31'),
    'copilot_chatgpt': ('2022-06-01', '2023-02-28'),
    'gpt4_harvey':     ('2023-03-01', '2024-04-30'),
    'gpt4o_present':   ('2024-05-01', '2030-12-31'),
}

AI_BREAKPOINTS = {
    'GPT-3':             '2020-10-01',
    'GitHub Copilot GA': '2022-06-01',
    'ChatGPT':           '2022-11-30',
    'GPT-4':             '2023-03-14',
    'Harvey AI launch':  '2023-11-01',
    'GPT-4o':            '2024-05-13',
    'Claude 3.5 Sonnet': '2024-06-20',
    'OpenAI o1':         '2024-09-12',
    'Claude 3.7 Sonnet': '2025-02-24',
    'OpenAI o3/o4-mini': '2025-04-16',
}


def assign_time_bin(dt) -> str:
    """Return the time-bin label for a given timestamp (or 'unknown' for NaT)."""
    import pandas as pd
    if pd.isna(dt):
        return 'unknown'
    ts = pd.Timestamp(dt)
    for label, (start, end) in TIME_BIN_DATES.items():
        if pd.Timestamp(start) <= ts <= pd.Timestamp(end):
            return label
    return 'unknown'


# ===========================================================================
# AI-term flag definitions (the DV is derived from these)
# ===========================================================================

AI_TERMS: Dict[str, 're.Pattern'] = {
    'flag_machine_learning':  re.compile(r'\bmachine[- ]?learning\b', re.I),
    'flag_artificial_intel':  re.compile(r'\bartificial intelligence\b|\bAI\b', re.I),
    'flag_automation':        re.compile(r'\bautomati[onsed]+\b', re.I),
    'flag_llm':               re.compile(r'\bLLM[s]?\b|\blarge language model', re.I),
    'flag_generative_ai':     re.compile(r'\bgenerative AI\b|\bgen[- ]?AI\b', re.I),
    'flag_python':            re.compile(r'\bpython\b', re.I),
    'flag_prompt_eng':        re.compile(r'\bprompt engineering\b|\bprompt design\b', re.I),
    'flag_nlp':               re.compile(r'\bNLP\b|\bnatural language process', re.I),
    'flag_deep_learning':     re.compile(r'\bdeep[- ]?learning\b|\bneural network', re.I),
    'flag_data_science':      re.compile(r'\bdata science\b|\bdata scientist', re.I),
    'flag_gpt':               re.compile(r'\bGPT[- ]?[0-9]*\b|\bChatGPT\b|\bOpenAI\b', re.I),
    'flag_copilot':           re.compile(r'\bCopilot\b|\bGitHub Copilot\b', re.I),
    'flag_predictive':        re.compile(r'\bpredictive analytics\b|\bpredictive model', re.I),
    'flag_cloud_ml':          re.compile(r'\bSageMaker\b|\bAzure ML\b|\bVertex AI\b|\bBigQuery ML\b', re.I),
}

# Threshold for the binary DV `ai_exposure_binary` (>=1 AI term).
AI_EXPOSURE_THRESHOLD = 1


def apply_ai_flags(text: str) -> Dict[str, int]:
    """Return {flag_name: 0/1} for every AI term in the description."""
    if not isinstance(text, str):
        return {k: 0 for k in AI_TERMS}
    return {k: int(bool(pat.search(text))) for k, pat in AI_TERMS.items()}


# Single regex that matches any AI flag term. Used in modeling notebooks to
# mask the AI vocabulary from descriptions before TF-IDF / BERT, so models
# learn *contextual* predictors instead of trivially recovering the DV.
AI_MASK_PATTERN = re.compile('|'.join(p.pattern for p in AI_TERMS.values()),
                              re.IGNORECASE)


def mask_ai_terms(text: str) -> str:
    """Replace all AI flag terms in the text with whitespace."""
    return '' if not isinstance(text, str) else AI_MASK_PATTERN.sub(' ', text)


# ===========================================================================
# Text cleaning (HTML strip + LinkedIn-specific boilerplate stripping)
# ===========================================================================

GENERIC_BOILERPLATE = [
    r'equal opportunity employer[^.]*\.?',
    r'we are an eoe[^.]*\.?',
    r'we offer a competitive salary[^.]*\.?',
    r'apply now[^.]*\.?',
    r'click (here )?to apply[^.]*\.?',
    r'(view|see) full job description[^.]*\.?',
    r'show (more|less)[^.]*\.?',
    r'job (type|id|ref(erence)?)\s*:?\s*[\w\-]+',
    r'(full[- ]time|part[- ]time|contract|permanent)\s*$',
]

LINKEDIN_BOILERPLATE = [
    r'(posted\s+)?\d+\s+(day|week|month|hour|minute|min|sec|hr)s?\s+ago',
    r'posted\s+(yesterday|today|just\s+now)',
    r'\b\d+\s+(applicants?|connections?\s+work\s+here|people\s+clicked\s+apply)',
    r'over\s+\d+\s+applicants',
    r'be\s+among\s+the\s+first\s+\d+\s+applicants',
    r'actively\s+reviewing\s+applicants',
    r'easy\s+apply',
    r'see\s+more\s+jobs\s+like\s+this',
    r'similar\s+jobs',
    r'jobs?\s+you\s+might\s+be\s+interested\s+in',
    r'save\s+(this\s+)?job',
    r'share\s+(this\s+)?job',
    r'linkedin\s+premium',
    r'try\s+premium[^.\n]*',
    r'unlock\s+premium[^.\n]*',
    r'get\s+premium',
    r'you\s+are\s+on\s+the\s+messaging\s+overlay[^.\n]*',
    r'press\s+enter\s+to\s+(open|close)[^.\n]*',
    r'to\s+open\s+the\s+dialog',
    r'about\s+·\s+accessibility\s+·[^\n]*',
    r'linkedin\s+corporation\s+©[^\n]*',
    r'\b(bahasa|tagalog|chinese|english)\b\s*(indonesia|malaysia)?',
    r'\((on-site|hybrid|remote)\)',
    r'united\s+states\s+·\s+(remote|on-site|hybrid)',
    r'^about\s+the\s+job\s*',
]

_BOILERPLATE_RE = re.compile(
    '|'.join(f'(?:{p})' for p in GENERIC_BOILERPLATE + LINKEDIN_BOILERPLATE),
    flags=re.IGNORECASE | re.MULTILINE,
)


def clean_text(raw: str) -> str:
    """
    Pipeline: HTML entity decode → strip HTML tags → strip generic + LinkedIn
    boilerplate → collapse whitespace.

    Validated to preserve every AI-term flag count while removing ~13% of
    total chars (LinkedIn UI chrome).
    """
    if not isinstance(raw, str) or not raw.strip():
        return ''
    # Lazy import so utils.py loads cheaply even without BS4
    text = html.unescape(raw)
    if '<' in text and '>' in text:
        try:
            from bs4 import BeautifulSoup
            text = BeautifulSoup(text, 'lxml').get_text(separator=' ')
        except Exception:
            pass
    text = _BOILERPLATE_RE.sub(' ', text)
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'  +', ' ', text)
    return text.strip()


# ===========================================================================
# Misc helpers
# ===========================================================================

def ensure_dirs() -> None:
    """Create all standard project directories if missing."""
    for d in [RAW_DIR, PROCESSED_DIR, EXTERNAL_DIR, FIG_DIR]:
        d.mkdir(parents=True, exist_ok=True)


def now_iso() -> str:
    """Return current timestamp in ISO format for scrape_at columns."""
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
