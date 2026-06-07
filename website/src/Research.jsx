import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroTech from './HeroTech.jsx'

const PAPER_URL = '/final_report.pdf'
const REPO_URL = 'https://github.com/peakviprakasit/QSS45--AI-Exposure-vs.-Automatability-in-Five-Understudied-Industries'

const SECTIONS = [
  ['question', 'Question'],
  ['data', 'Data'],
  ['method', 'Method'],
  ['results', 'Results'],
  ['takeaway', 'Takeaway'],
]

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setP(max > 0 ? el.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return p
}

function useScrolled() {
  const [s, setS] = useState(false)
  useEffect(() => {
    const on = () => setS(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return s
}

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const secs = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    secs.forEach((s) => io.observe(s))
    const onScroll = () => { if (window.scrollY < 140) setActive('') } // clear in the hero
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])
  return active
}

function FigureImg({ fig, src, caption, source, max }) {
  return (
    <figure className="fig reveal">
      <div className="fig-head"><span className="fig-no">Figure {fig}</span></div>
      <div className="fig-frame">
        <img src={src} alt={caption} loading="lazy" style={max ? { maxWidth: max, margin: '0 auto' } : undefined} />
      </div>
      <figcaption>
        <span className="cap"><b>Fig.&nbsp;{fig}.</b> {caption}</span>
        {source && <span className="src">{source}</span>}
      </figcaption>
    </figure>
  )
}

function Embed({ fig, src, caption, source, height = 600 }) {
  return (
    <figure className="fig reveal">
      <div className="fig-head">
        <span className="fig-no">Figure {fig}</span>
        <span className="fig-tag">Interactive — hover / menu</span>
      </div>
      <div className="fig-frame embed">
        <iframe src={src} title={caption} style={{ height }} loading="lazy" />
      </div>
      <figcaption>
        <span className="cap"><b>Fig.&nbsp;{fig}.</b> {caption}</span>
        {source && <span className="src">{source}</span>}
      </figcaption>
    </figure>
  )
}

function Section({ id, num, eyebrow, title, sub, children, tint }) {
  return (
    <section id={id} className={`section${tint ? ' tint' : ''}`}>
      <div className="container sec-grid">
        <header className="sec-head reveal">
          <span className="sec-no" aria-hidden="true">{num}</span>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {sub && <p className="sub">{sub}</p>}
        </header>
        <div className="sec-body">{children}</div>
      </div>
    </section>
  )
}

export default function Research() {
  const progress = useScrollProgress()
  const scrolled = useScrolled()
  const active = useActiveSection()
  const activeIdx = SECTIONS.findIndex(([id]) => id === active)
  useReveal()

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand">
            &larr;&nbsp;Parama&nbsp;Viprakasit<span className="by">QSS 45 · 2026</span>
          </Link>
          <div className="nav-links">
            {SECTIONS.map(([id, label], i) => (
              <a key={id} href={`#${id}`} className={active === id ? 'on' : ''}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>{label}
              </a>
            ))}
            <a href={PAPER_URL} className="btn-sm">Paper</a>
          </div>
        </div>
        <div className="progress" style={{ transform: `scaleX(${progress})` }} />
      </nav>

      <div className={`read-chip${activeIdx >= 0 ? ' show' : ''}`} aria-hidden="true">
        <span className="rc-dot" />
        <span className="rc-lab">Reading</span>
        <span className="rc-sec">
          <span className="rc-n">{activeIdx >= 0 ? String(activeIdx + 1).padStart(2, '0') : ''}</span>
          {activeIdx >= 0 ? SECTIONS[activeIdx][1] : ''}
        </span>
      </div>

      <header id="top" className="hero">
        <HeroTech />
        <div className="container hero-grid">
          <div className="hero-lead">
            <p className="eyebrow">QSS 45 · Final Project · Dartmouth College</p>
            <h1>
              Jobs are increasingly <span className="ac1">integrating</span> AI&nbsp;, not{' '}
              <span className="ac2">being replaced</span> by it.
            </h1>
            <p className="lede">
              Across <strong>12,487</strong> job postings in five understudied industries, AI{' '}
              <strong>exposure</strong> rose sharply between 2024 and 2026 — yet how{' '}
              <strong>automatable</strong> that work is barely moved. Two questions usually collapsed
              into a single &ldquo;AI&nbsp;risk,&rdquo; measured apart.
            </p>
            <div className="cta">
              <a href={PAPER_URL} className="btn"><span>Read the paper</span></a>
              <a href={REPO_URL} className="btn ghost"><span>View the code</span></a>
            </div>
          </div>

          <aside className="dossier reveal" aria-label="Study dossier">
            <div className="dossier-head">
              <span className="meta">Study dossier</span>
              <span className="tag">2024 / 2026</span>
            </div>
            <div className="dossier-sect">
              <p className="ds-lab">Field notes</p>
              <dl>
                <div className="lrow"><dt>Corpus</dt><dd>12,487<small>job postings</small></dd></div>
                <div className="lrow"><dt>Analyzed</dt><dd>2,614<small>stratified sample</small></dd></div>
                <div className="lrow"><dt>Industries</dt><dd>5<small>understudied sectors</small></dd></div>
                <div className="lrow"><dt>Labeler</dt><dd>GPT-5.4 / -mini<small>two constructs</small></dd></div>
              </dl>
            </div>
            <div className="dossier-sect findings">
              <p className="ds-lab">Key findings</p>
              <dl>
                <div className="lrow"><dt>AI exposure</dt><dd className="up">+60%<small>p = 2.6×10⁻⁸</small></dd></div>
                <div className="lrow"><dt>Automatability</dt><dd className="flat">≈ flat<small>p = 0.31</small></dd></div>
                <div className="lrow"><dt>Correlation</dt><dd>r = −0.11<small>near-independent</small></dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </header>

      <Section
        id="question"
        num="01"
        eyebrow="The question"
        title="Exposure is not the same as automatability"
        sub="Two dimensions that public debate keeps collapsing into one — measured here on perpendicular axes."
      >
        <p className="prose reveal">
          Public debate runs two ideas together: that a job <em>involves</em> AI, and that a job could
          be <em>done by</em> AI. They are different — sometimes opposite. I measure each separately,
          from employer demand (job postings), in five sectors under-represented in existing studies.
        </p>
        <p className="prose reveal">
          That difference has teeth. Fold the two into a single &ldquo;AI&nbsp;risk&rdquo; score — as most
          headline estimates do — and a job being <em>reshaped around</em> new tools becomes indistinguishable
          from one being <em>eliminated by</em> it. Rather than rate occupations from expert task checklists,
          this study reads both signals off something concrete and current: the language of the postings
          employers actually write, in industries the literature usually skips.
        </p>

        <div className="dimensions reveal">
          <div className="glossary" style={{ '--c': 'var(--green)' }}>
            <div className="g-head">
              <p className="g-lab">Exposure</p>
              <span className="g-axis">horizontal&nbsp;&rarr;</span>
            </div>
            <h3 className="g-term">Does the role <em>involve</em> AI?</h3>
            <p className="g-def">An ML-engineering job is saturated with AI — and is no candidate for automation at all.</p>
            <p className="g-eg"><b>Signal</b> Read from the language of the posting itself.</p>
          </div>
          <div className="glossary" style={{ '--c': 'var(--rust)' }}>
            <div className="g-head">
              <p className="g-lab">Automatability</p>
              <span className="g-axis">vertical&nbsp;&uarr;</span>
            </div>
            <h3 className="g-term">Could its tasks be <em>automated</em>?</h3>
            <p className="g-def">A data-entry job may never mention AI yet be almost entirely codifiable.</p>
            <p className="g-eg"><b>Signal</b> Inferred from the routine, rule-bound content of the work.</p>
          </div>
        </div>

        <div className="axes-cue reveal">
          <div className="ac-y">Automatability&nbsp;&uarr;</div>
          <div className="ac-plot">
            <span className="ac-x">AI&nbsp;exposure&nbsp;&rarr;</span>
            <span className="ac-note">
              Two independent dimensions, not one risk score. <b>Across 2,614 postings, r = −0.11.</b>
            </span>
          </div>
        </div>
      </Section>

      <Section
        id="data"
        num="02"
        eyebrow="The data"
        title="A field notebook of 12,487 postings"
        sub="Two snapshots, five understudied industries, scraped from LinkedIn."
        tint
      >
        <p className="prose reveal">
          I scraped LinkedIn postings for farming &amp; forestry, insurance, legal services, patent/IP, and
          pharmaceutical &amp; chemical manufacturing at two points — April&nbsp;2024 and May&nbsp;2026. The
          five sectors are a deliberate choice: work on AI and jobs tends to orbit software and the
          professions, so these <strong>manual, clerical, and knowledge</strong> sectors rarely make the
          sample, yet together they span the work where AI&rsquo;s reach is most contested.
        </p>

        <div className="ledger reveal">
          <div className="ledger-head">
            <span className="meta">Dataset inventory</span>
            <span className="meta">LinkedIn · 2024 + 2026</span>
          </div>
          <div className="ledger-body">
            <div className="lrow"><span className="k">Raw corpus</span><span className="v">12,487 postings</span></div>
            <div className="lrow"><span className="k">Analyzed sample</span><span className="v">2,614 stratified</span></div>
            <div className="lrow"><span className="k">Industries</span><span className="v">5 understudied</span></div>
            <div className="lrow"><span className="k">Snapshots</span><span className="v">Apr 2024 · May 2026</span></div>
            <div className="lrow"><span className="k">Unit of analysis</span><span className="v">one job posting</span></div>
            <div className="lrow"><span className="k">Balanced by</span><span className="v">industry × year</span></div>
          </div>
        </div>

        <div className="notebox reveal">
          <span className="nb-tag">Method note</span>
          <p>
            Each snapshot is a separate scrape, so <strong>year is confounded with source</strong>. This is a
            two-snapshot comparison, <strong>not a time series</strong> — every result is reported within
            industry, and never as a trend.
          </p>
        </div>

        <p className="prose reveal">
          From the raw corpus I draw a stratified, industry-balanced sample of <strong>2,614</strong>, so no
          single sector or year drives the comparison. A naive keyword count won&rsquo;t do: as the heatmap
          shows, AI-term prevalence tracks posting length and house style as much as real content — which is
          why the study moves to a length-invariant language-model measure.
        </p>

        <FigureImg
          fig="1"
          src="/figures/fig4_ai_term_heatmap_industry.png"
          caption="Keyword AI-term prevalence by industry. The raw keyword signal is noisy and length-sensitive, motivating a more robust model-based measure."
          source="Raw keyword scan · 5 industries"
        />
      </Section>

      <Section
        id="method"
        num="03"
        eyebrow="The method"
        title="One labeler, two constructs"
        sub="A transparent pipeline from posting to comparison — validated, not assumed."
      >
        <p className="prose reveal">
          A supervised baseline showed the signal lives in the description <em>text</em>: structured
          metadata alone barely predicts exposure (AUC&nbsp;≈&nbsp;0.69), while the job text does
          (AUC&nbsp;0.92). So every posting is scored on both hypotheses by a cloud GPT labeler —
          gpt-5.4 for exposure, gpt-5.4-mini for automatability — and the measure is validated rather
          than trusted.
        </p>

        <div className="pipeline reveal">
          <div className="step">
            <span className="snum">01</span><h4>Scrape</h4>
            <p>LinkedIn postings, five industries, two snapshots.</p>
            <span className="tech">12,487 raw</span>
          </div>
          <div className="step">
            <span className="snum">02</span><h4>Clean text</h4>
            <p>Normalize descriptions; strip boilerplate.</p>
            <span className="tech">per posting</span>
          </div>
          <div className="step exposure">
            <span className="snum">03</span><h4>Label exposure</h4>
            <p>Does the role involve AI?</p>
            <span className="tech">gpt-5.4 · →</span>
          </div>
          <div className="step auto">
            <span className="snum">04</span><h4>Label automatability</h4>
            <p>Could its tasks be automated?</p>
            <span className="tech">gpt-5.4-mini · ↑</span>
          </div>
          <div className="step">
            <span className="snum">05</span><h4>Stratify</h4>
            <p>Balance by industry × year.</p>
            <span className="tech">n = 2,614</span>
          </div>
          <div className="step">
            <span className="snum">06</span><h4>Compare</h4>
            <p>Within industry, between snapshots.</p>
            <span className="tech">no trend claim</span>
          </div>
        </div>

        <div className="specs reveal">
          <span className="spec">Labelers <b>gpt-5.4 / -mini</b></span>
          <span className="spec">Exposure ROC-AUC <b>0.94</b></span>
          <span className="spec">Text vs. metadata <b>0.92 / 0.69</b></span>
          <span className="spec rust">Keyword agreement <b>κ 0.42</b></span>
        </div>

        <p className="prose reveal">
          Validation matters more than the model itself. Exposure clears four checks: it <strong>agrees</strong>{' '}
          with an independent keyword flag where the two should converge — and the disagreements, on inspection,
          are the model correctly ignoring boilerplate mentions; it stays <strong>stable</strong> as the decision
          threshold moves; it remains <strong>distinct</strong> from automatability rather than collapsing into
          it; and it holds at ROC&nbsp;AUC&nbsp;0.94 against a hand-checked audit set. Automatability has no ground
          truth — there is no registry of which tasks <em>could</em> be automated — so it rests on face and
          discriminant validity alone, and I treat it as the softer of the two measures throughout.
        </p>

        <FigureImg
          fig="2"
          max="560px"
          src="/figures/fig18_zeroshot_vs_keyword.png"
          caption="Convergent validity of the exposure measure against the independent keyword flag (AUC 0.77, κ 0.42). Disagreements are mostly the model correctly rejecting boilerplate keyword hits."
          source="Model vs. keyword · audit set n = 100"
        />
      </Section>

      <Section
        id="results"
        num="04"
        eyebrow="The results"
        title="Exposure climbed; automatability held"
        tint
      >
        <p className="prose reveal">
          Between snapshots, mean AI exposure rose from <strong>0.061 to 0.098</strong>{' '}
          (p&nbsp;=&nbsp;2.6×10⁻⁸); mean automatability was statistically unchanged
          (<strong>0.334 → 0.324</strong>, p&nbsp;=&nbsp;0.31). The rise concentrates in knowledge work —
          Patent/IP (+0.104), Legal (+0.068), Pharma (+0.045) — while Farming and Insurance dipped.
        </p>

        <p className="pullquote reveal">
          Employer demand for AI-involved work <span className="hl">climbed about 60%</span> in two years — while
          the share a machine could actually do <span className="hl">barely moved</span>.
        </p>

        <FigureImg
          fig="3"
          src="/figures/fig08_mean_scores_by_year.png"
          caption="The headline. Mean AI exposure rises significantly between snapshots; mean automatability does not."
          source="Stratified sample · n = 2,614"
        />

        <p className="prose reveal">
          The movement is not uniform. It piles up in knowledge work — Patent/IP, legal services, and pharma all
          advertise sharply more AI-involved roles by 2026 — while farming and insurance, if anything, slip back.
          The second axis stays put across every sector, and the two are nearly orthogonal: a role&rsquo;s
          exposure tells you almost nothing about its automatability.
        </p>

        <div className="keyfinds reveal">
          <div className="keyfind" style={{ '--c': 'var(--slate)' }}>
            <div className="kf-num">r = −0.11</div>
            <p className="kf-lab">Exposure × automatability</p>
            <p>Across 2,614 postings the two dimensions are nearly independent — knowing one tells you almost nothing about the other.</p>
          </div>
          <div className="keyfind" style={{ '--c': 'var(--rust)' }}>
            <div className="kf-num">0.4%</div>
            <p className="kf-lab">Both highly exposed &amp; automatable</p>
            <p>Only a sliver of postings sit in the high-high quadrant; about a quarter are automatable but <em>not</em> exposed, and most are neither.</p>
          </div>
        </div>

        <div className="fig-aside">
          <Embed
            fig="4"
            src="/figures/fig09_exposure_by_industry_slope.html"
            height={560}
            caption="AI exposure by industry, 2024 → 2026. Hover a line for its ×multiplier — the centerpiece of the divergence."
            source="Model-labeled · gpt-5.4"
          />
          <div className="sidebar reveal">
            <p className="sb-lab">Why knowledge work?</p>
            <p>
              2024–2026 is the generative-AI moment, and today&rsquo;s models are strongest at the language- and
              document-heavy tasks — drafting, search, synthesis, review — at the core of patent, legal, and
              pharmaceutical work. Where AI <strong>complements</strong> existing expertise, employers advertise
              it; where a sector&rsquo;s core is physical (farming) or transactional (insurance), today&rsquo;s
              models map less directly onto the roles, so AI-involvement doesn&rsquo;t climb — Acemoglu &amp;
              Restrepo&rsquo;s point that a technology reshapes demand for the tasks it can do.
            </p>
            <p>
              One honest caveat: exposure is read from a posting&rsquo;s <em>language</em>, so part of that rise
              may be employers adopting AI vocabulary to signal modernity rather than deeper integration.
            </p>
          </div>
        </div>

        <div className="fig-row">
          <Embed
            fig="5"
            src="/figures/fig09_movement_map.html"
            height={560}
            caption="By industry — each arrow is one sector's 2024 → 2026 shift: large horizontal moves (exposure), little vertical (automatability)."
            source="Exposure → · automatability ↑"
          />
          <Embed
            fig="6"
            src="/figures/fig09_joint_density.html"
            height={560}
            caption="By posting (n = 2,614) — AI exposure barely predicts how automatable a role is (r = −0.11)."
            source="Joint density"
          />
        </div>

        <Embed
          fig="7"
          src="/figures/fig09_industry_compare.html"
          height={680}
          caption="Per-industry means, 2024 vs 2026 — use the menu (top-right) to switch between AI exposure and automatability. The gains concentrate in Patent/IP, Legal, and Pharma; automatability barely moves."
          source="Toggle: exposure / automatability"
        />

        <Embed
          fig="8"
          src="/figures/fig09_distribution_shift_ecdf.html"
          caption="The full 2024 → 2026 distribution shift — exposure pulls right while automatability's curves overlap. Use the menu to toggle measures."
          source="Empirical CDF"
        />
      </Section>

      <section id="takeaway" className="takeaway">
        <HeroTech variant="band" />
        <div className="container">
          <p className="eyebrow reveal">05 · The takeaway</p>
          <p className="big reveal">
            Employer demand became measurably more <span className="ac1">AI-involved</span> without
            becoming more <span className="ac2">replaceable</span> — and the two are nearly independent.
            Collapsing them into one &ldquo;AI&nbsp;risk&rdquo; score hides the real pattern.
          </p>
          <p className="research-note reveal">
            <b>Read it carefully.</b> A two-snapshot design (no causal claims), a draft audit set still
            pending human review, and LinkedIn&rsquo;s skew toward formal white-collar postings all bound
            what these numbers can say.
          </p>
          <div className="doc-actions reveal">
            <a href={PAPER_URL} className="btn light"><span>Read the full paper</span></a>
            <a href={REPO_URL} className="btn ghost-light"><span>Browse the notebooks</span></a>
          </div>
          <div className="colophon reveal">
            <span>QSS 45 Final Project</span><span className="dot">·</span>
            <span>Dartmouth College</span><span className="dot">·</span>
            <span>Parama Viprakasit&nbsp;&rsquo;27</span><span className="dot">·</span>
            <span>2026</span><span className="dot">·</span>
            <a href={PAPER_URL}>Paper</a><span className="dot">·</span>
            <a href={REPO_URL}>GitHub</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p className="note">
            Roles are increasingly built <em>around</em> AI without becoming measurably more
            <em> replaceable</em> by it — two questions worth keeping apart.
          </p>
          <div className="foot-grid">
            <div className="foot-col">
              <p className="label">The project</p>
              <p>AI exposure × automatability</p>
              <p>QSS 45 · Final Project</p>
              <p>Dartmouth College · 2026</p>
              <p>Parama Viprakasit&nbsp;&rsquo;27</p>
            </div>
            <div className="foot-col">
              <p className="label">Read</p>
              <a href={PAPER_URL}>Full paper (PDF)</a>
              <a href={REPO_URL}>Code &amp; notebooks</a>
            </div>
            <div className="foot-col">
              <p className="label">Method note</p>
              <p>
                Both constructs are model-labeled estimates (gpt-5.4 / gpt-5.4-mini), validated against a keyword flag and a
                100-posting audit set. A two-snapshot design — year is confounded with scrape source; all
                comparisons are within-industry.
              </p>
            </div>
            <div className="foot-meta">
              <span>© 2026 Parama Viprakasit · Dartmouth&nbsp;&rsquo;27</span>
              <a href="#top">Back to top ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
