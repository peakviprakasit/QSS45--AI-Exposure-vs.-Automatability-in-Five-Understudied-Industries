import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroTech from './HeroTech.jsx'

// TODO: fill these in
const GITHUB = 'https://github.com/peakviprakasit/QSS45--AI-Exposure-vs.-Automatability-in-Five-Understudied-Industries'  // project repo
const LINKEDIN = 'https://www.linkedin.com/in/parama-viprakasit-5aa5a3207/'
const EMAIL = 'mailto:parama.viprakasit.27@dartmouth.edu'

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
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}

export default function Home() {
  const scrolled = useScrolled()
  useReveal()
  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          <span className="brand">Parama&nbsp;Viprakasit<span className="by">Dartmouth · QSS</span></span>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#research">Research</a>
            <a href="#contact">Contact</a>
            <Link to="/research" className="btn-sm">The study</Link>
          </div>
        </div>
      </nav>

      <header id="top" className="hero">
        <HeroTech />
        <div className="container hero-lead">
          <p className="eyebrow">Dartmouth College · Quantitative Social Science · &rsquo;27</p>
          <h1>Parama <span className="ac1">Viprakasit</span></h1>
          <p className="lede">
            Welcome to my personal website, a showcase of my most recent works and research projects. Most recently, I examined how <strong>technology reshapes work</strong> : combining statistics, machine
            learning, and NLP to ask questions about labor, AI, and opportunity. Specifically, I measured how AI <em>exposure</em> and task <em>automatability</em> moved across
            five understudied industries in <em>2024</em> vs. <em>2026</em>.
          </p>
          <div className="cta">
            <Link to="/research" className="btn"><span>View my research</span></Link>
            <a href="#contact" className="btn ghost"><span>Contact</span></a>
          </div>
        </div>
      </header>

      <section id="about" className="section">
        <div className="container sec-grid">
          <header className="sec-head reveal">
            <span className="sec-no" aria-hidden="true">01</span>
            <p className="eyebrow">About</p>
            <h2>A Quantitative Social Science Major, Econ Concentration at Dartmouth College</h2>
          </header>
          <div className="sec-body">
            <p className="prose reveal">
              I&rsquo;m a Dartmouth class of 2027 student majoring in Quantitative Social Science with a focus on Economics. My work combines statistical methods
              and computational tools to understand social and economic phenomena. My interests span data science,
              financial economics, labor economics, and machine learning. I am especially interested in exploring how emerging technology affects work and
              opportunity. Outside research I&rsquo;m usually in the gym, skiing in the mountains of New Hampshire, cooking meals without recipes, and producing EDM/House music.
            </p>
            <div className="ledger reveal">
              <div className="ledger-head">
                <span className="meta">At a glance</span>
                <span className="meta">Dartmouth College</span>
              </div>
              <div className="ledger-body">
                <div className="lrow"><span className="k">Program</span><span className="v">Quantitative Social Science</span></div>
                <div className="lrow"><span className="k">Year</span><span className="v">Junior &middot; &rsquo;27</span></div>
                <div className="lrow"><span className="k">Toolkit</span><span className="v">Statistics, Economics, and Computation</span></div>
                <div className="lrow"><span className="k">Interests</span><span className="v">Data science &middot; Economics &middot; Machine Learning</span></div>
                <div className="lrow"><span className="k">Studying</span><span className="v">How technology reshapes work</span></div>
                <div className="lrow"><span className="k">Outside work</span><span className="v">Skiing &middot; Cooking &middot; Producing</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="research" className="section tint">
        <div className="container sec-grid">
          <header className="sec-head reveal">
            <span className="sec-no" aria-hidden="true">02</span>
            <p className="eyebrow">Research</p>
            <h2>Featured project</h2>
          </header>
          <div className="sec-body">
          <article className="project reveal">
            <div className="project-body">
              <span className="dc-tag">QSS 45 · 2026</span>
              <h3>AI exposure is rising in knowledge work, but task automatability remains relatively constant.</h3>
              <p>
                12,487 LinkedIn postings across five understudied industries, each scored on two
                constructs by a validated GPT labeler. AI exposure rose sharply when comparing job postings in 2024 vs. 2026. The automatability of tasks stayed flat, and the two are nearly
                independent. So &ldquo;AI exposure&rdquo; and &ldquo;automation risk&rdquo; shouldn&rsquo;t be measured by one metric.
              </p>
              <div className="proj-stats">
                <span><b>+60%</b> mean exposure</span>
                <span><b className="rust">relatively flat</b> automatability</span>
                <span><b>r = −0.11</b> independence</span>
              </div>
              <Link to="/research" className="btn"><span>Read the full study</span></Link>
            </div>
            <div className="project-figure reveal">
              <img src="/figures/fig08_joint_density_posting_level.png" alt="Exposure vs. automatability, posting-level density" loading="lazy" />
            </div>
          </article>
          </div>
        </div>
      </section>

      <section id="contact" className="takeaway">
        <HeroTech variant="band" />
        <div className="container">
          <p className="eyebrow reveal">03 · Contact</p>
          <p className="big reveal">For more information or any inquiries, please feel free to reach out via.</p>
          <div className="doc-actions reveal">
            <a href={EMAIL} className="btn light"><span>Email me</span></a>
            <a href={GITHUB} target="_blank" rel="noopener" className="btn ghost-light"><span>GitHub</span></a>
            <a href={LINKEDIN} target="_blank" rel="noopener" className="btn ghost-light"><span>LinkedIn</span></a>
          </div>
          <div className="colophon reveal">
            <span>Parama Viprakasit&nbsp;&rsquo;27</span><span className="dot">·</span>
            <span>Quantitative Social Science</span><span className="dot">·</span>
            <span>Dartmouth College</span><span className="dot">·</span>
            <span>2026</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p className="note">
            Combining statistics, machine learning, NLP, and Economic theories/concepts to ask empirical questions about labor,
            AI, and opportunity.
          </p>
          <div className="foot-grid">
            <div className="foot-col">
              <p className="label">Parama Viprakasit</p>
              <p>Dartmouth College · 2026</p>
              <p>Quantitative Social Science</p>
            </div>
            <div className="foot-col">
              <p className="label">Elsewhere</p>
              <a href={EMAIL}>Email</a>
              <a href={GITHUB} target="_blank" rel="noopener">GitHub</a>
              <a href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a>
            </div>
            <div className="foot-col">
              <p className="label">Work</p>
              <Link to="/research">The AI-and-labor study</Link>
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
