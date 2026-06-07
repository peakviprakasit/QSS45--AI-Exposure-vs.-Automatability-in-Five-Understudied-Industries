import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './field.css'

const PAPER_URL = '/final_report.pdf'
const REPO_URL = 'https://github.com/peakviprakasit/QSS45--AI-Exposure-vs.-Automatability-in-Five-Understudied-Industries'
const SECTIONS = [['question', 'Question'], ['data', 'Data'], ['method', 'Method'], ['results', 'Results']]

function useActive() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const els = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

function Fg({ src, lbl, fig, cap }) {
  return (
    <figure className="fg">
      <div className="lbl">{lbl} <b>{fig}</b></div>
      <div className="frame"><img src={src} alt={cap} loading="lazy" /></div>
      <figcaption>{cap}</figcaption>
    </figure>
  )
}
function Fx({ src, lbl, fig, cap, h = 620 }) {
  return (
    <figure className="fg">
      <div className="lbl">{lbl} · interactive <b>{fig}</b></div>
      <div className="frame"><iframe src={src} title={cap} style={{ height: h }} loading="lazy" /></div>
      <figcaption>{cap}</figcaption>
    </figure>
  )
}

export default function Field() {
  const active = useActive()
  return (
    <div className="instr">
      <nav className="nav">
        <div className="col">
          <Link to="/" className="brand">Parama&nbsp;Viprakasit</Link>
          <div className="lnk">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={active === id ? 'on' : ''}>{label}</a>
            ))}
            <a href={PAPER_URL} className="cta">Paper</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="col">
          <p className="eyebrow">QSS 45 · Final Project · Dartmouth ’27</p>
          <h1>Jobs are being built <mark>around</mark> AI — not replaced by it.</h1>
          <p className="dek">
            Across <b>12,487</b> LinkedIn postings in five understudied industries, AI exposure rose
            sharply between 2024 and 2026 — yet how <b>automatable</b> that work is barely moved. Two
            questions usually collapsed into one “AI&nbsp;risk,” measured apart.
          </p>
          <div className="stats">
            <div className="stat lime"><div className="v">+60%</div><div className="k">mean AI exposure · 2024→2026 · p = 2.6×10⁻⁸</div></div>
            <div className="stat"><div className="v">≈ flat</div><div className="k">automatability change · p = 0.31</div></div>
            <div className="stat"><div className="v">r −0.11</div><div className="k">exposure ↔ automatability · n = 2,614</div></div>
          </div>
          <div className="actions">
            <a href={PAPER_URL} className="btn fill">Read the paper</a>
            <a href={REPO_URL} className="btn ghost">View the code</a>
          </div>
        </div>
      </header>

      <section id="question" className="s">
        <div className="col">
          <div className="shead">
            <div className="snum">01 / <b>The question</b></div>
            <h2>Exposure is not the same as automatability</h2>
          </div>
          <p className="prose">
            Public debate fuses two ideas: that a job <em>involves</em> AI, and that a job could be
            <em> done by</em> AI. They are different — sometimes opposite — so I measure each on its own
            axis, from employer demand rather than speculation.
          </p>
          <div className="cards">
            <div className="card x">
              <div className="t">Axis X · Exposure</div>
              <h3>Does the role involve AI?</h3>
              <p>An ML-engineering posting is saturated with AI — and is no candidate for automation.</p>
            </div>
            <div className="card y">
              <div className="t">Axis Y · Automatability</div>
              <h3>Could its tasks be automated?</h3>
              <p>A data-entry posting may never mention AI yet be almost entirely codifiable.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="data" className="s">
        <div className="col">
          <div className="shead">
            <div className="snum">02 / <b>The data</b></div>
            <h2>12,487 postings · 5 industries · 2 snapshots</h2>
          </div>
          <p className="prose">
            Five sectors under-represented in existing AI-and-work studies — farming/forestry, insurance,
            legal services, patent/IP, and pharma/chemical — scraped at two points: April&nbsp;2024 and
            May&nbsp;2026. Because each snapshot is a different scrape, <b>year is confounded with source</b>;
            every result is read <em>within</em> industry, never as a time trend.
          </p>
          <Fg src="/figures/fig4_ai_term_heatmap_industry.png" lbl="Fig." fig="01"
              cap="Raw keyword AI-term prevalence by industry — the noisy signal that motivates a length-invariant language-model measure." />
        </div>
      </section>

      <section id="method" className="s">
        <div className="col">
          <div className="shead">
            <div className="snum">03 / <b>The method</b></div>
            <h2>One language model, two constructs</h2>
          </div>
          <p className="prose">
            A supervised check showed the signal lives in the job <em>text</em>, not the metadata
            (AUC&nbsp;0.69&nbsp;→&nbsp;0.92), so every posting is scored on both hypotheses by a cloud GPT
            model and validated — exposure reaches <span className="hi">ROC-AUC&nbsp;0.94</span> against a
            100-posting audit set, beating the keyword baseline.
          </p>
          <Fg src="/figures/fig18_zeroshot_vs_keyword.png" lbl="Fig." fig="02"
              cap="Convergent validity: the model vs. an independent keyword flag (AUC 0.77, κ 0.42). Most disagreements are the model correctly rejecting boilerplate keyword hits." />
        </div>
      </section>

      <section id="results" className="s">
        <div className="col">
          <div className="shead">
            <div className="snum">04 / <b>The results</b></div>
            <h2>Exposure climbed; automatability held</h2>
          </div>
          <p className="prose">
            Between snapshots, mean exposure rose <span className="hi">0.061&nbsp;→&nbsp;0.098</span>
            (p&nbsp;=&nbsp;2.6×10⁻⁸); automatability was statistically unchanged
            (0.334&nbsp;→&nbsp;0.324, p&nbsp;=&nbsp;0.31). The gains concentrate in knowledge work —
            Patent/IP&nbsp;+0.104, Legal&nbsp;+0.068, Pharma&nbsp;+0.045 — while farming and insurance
            dipped. And the two axes are nearly independent (r&nbsp;=&nbsp;−0.11): a role becoming
            AI-<em>involved</em> tells you almost nothing about whether it’s AI-<em>replaceable</em>.
          </p>
          <Fg src="/figures/fig08_mean_scores_by_year.png" lbl="Fig." fig="03"
              cap="Headline: mean exposure rises significantly between snapshots; mean automatability does not." />
          <Fx src="/figures/fig09_industry_compare.html" lbl="Fig." fig="04" h={680}
              cap="Per-industry means — toggle the menu (top-right) between exposure and automatability." />
          <Fx src="/figures/fig09_movement_map.html" lbl="Fig." fig="05" h={620}
              cap="Each arrow is one industry, 2024 → 2026: large horizontal shifts (exposure), negligible vertical ones (automatability)." />
          <Fx src="/figures/fig09_joint_density.html" lbl="Fig." fig="06" h={620}
              cap="Posting-level density of the two axes (n = 2,614). Exposure barely predicts automatability." />
          <Fx src="/figures/fig09_distribution_shift_ecdf.html" lbl="Fig." fig="07" h={620}
              cap="The full 2024 → 2026 distribution shift — toggle the construct; exposure pulls right, automatability’s curves overlap." />
        </div>
      </section>

      <section className="notes">
        <div className="col">
          <p className="eyebrow">Notes &amp; caveats</p>
          <ol>
            <li>Two snapshots, not a time series. 2024 (archival) and 2026 (fresh scrape) come from different collection processes, so year is confounded with source platform. Read within industry; nothing here is causal.</li>
            <li>Model-labeled, not human-coded. Both axes are scored by GPT-5.4 / 5.4-mini and cross-checked against a zero-shot BERT baseline; the model-selection audit set was AI-drafted and is pending human review.</li>
            <li>Exposure validates at ROC-AUC 0.94 against a 100-posting audit set and beats the keyword baseline; automatability has no ground truth and rests on face + discriminant validity only.</li>
            <li>LinkedIn skews toward formal, white-collar postings — these five sectors are understudied, not representative of all work.</li>
            <li>n = 2,614 is the stratified, balanced analysis sample drawn from the 12,487-posting corpus.</li>
          </ol>
        </div>
      </section>

      <section className="take">
        <div className="col">
          <p className="eyebrow">The takeaway</p>
          <h2>
            Employer demand got measurably more <span className="hi">AI-involved</span> without getting
            more <span className="hi">AI-replaceable</span> — and the two are nearly independent.
          </h2>
          <p className="prose">Collapsing them into one “AI&nbsp;risk” score hides the real pattern.</p>
          <div className="actions">
            <a href={PAPER_URL} className="btn fill">Read the paper</a>
            <a href={REPO_URL} className="btn ghost">Browse the code</a>
            <Link to="/research" className="btn ghost">Standard write-up</Link>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="col">
          <span>© 2026 Parama Viprakasit · Dartmouth ’27</span>
          <span><Link to="/">← Back to site</Link></span>
        </div>
      </footer>
    </div>
  )
}
