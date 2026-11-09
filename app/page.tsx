"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

function Arrow({ diagonal = false, className = "" }: { diagonal?: boolean; className?: string }) {
  return <svg className={`arrow ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.35" strokeLinecap="square" /></svg>;
}

function Brand({ large = false }: { large?: boolean }) {
  return <a className={`brand ${large ? "brand-large" : ""}`} href="#top" aria-label="Oyra home">oyra</a>;
}

const materials = [
  { name: "Stone & tile", code: "ST–014", title: "Ivory porcelain", finish: "Matte · 600 × 600 mm", quantity: 1200, unit: "sq ft", original: 12.8, alternative: 9.6, sample: "Warm ivory porcelain", swatch: "stone", note: "Same format; proposed alternative. Review tone, surface, and technical requirements." },
  { name: "Timber & panels", code: "TP–008", title: "Natural oak panel", finish: "Brushed · Natural finish", quantity: 320, unit: "sq ft", original: 18.5, alternative: 15.25, sample: "Brushed oak panel", swatch: "wood", note: "Similar finish; proposed alternative. Confirm grain, construction, dimensions, and installation requirements." },
  { name: "Wall finishes", code: "WF–021", title: "Linen wallcovering", finish: "Warm grey · Woven texture", quantity: 180, unit: "yd", original: 62, alternative: 48, sample: "Textured linen wallcovering", swatch: "linen", note: "Proposed alternative. Confirm sample, coverage, backing, and application requirements." },
];

const questions = [
  ["Who is Oyra for?", "Interior designers, architects, and project teams sourcing materials."],
  ["What can I bring to a demo?", "A finish schedule, material list, or supplier quote. A PDF or spreadsheet works. Remove confidential client information."],
  ["Does Oyra replace our suppliers?", "No. Compare your existing suppliers alongside other sources and proposed alternatives."],
  ["Who approves alternative materials?", "Your team. Review samples and technical documents before approving a substitute."],
  ["Do you handle delivery?", "No. Suppliers handle delivery. Oyra supports sourcing and purchase preparation."],
];

function ProductStudy() {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<"schedule" | "comparison">("comparison");
  const [details, setDetails] = useState(false);
  const m = materials[active];
  const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return <div className="product-study">
    <div className="material-select" role="tablist" aria-label="Example material category">
      {materials.map((material, i) => <button key={material.name} role="tab" aria-selected={active === i} aria-controls="material-example" id={`material-tab-${i}`} className={active === i ? "material-tab active" : "material-tab"} onClick={() => { setActive(i); setDetails(false); }}><span className="mono">0{i + 1}</span><span>{material.name}</span><Arrow diagonal /></button>)}
      <p className="study-aside">Select a category to explore the example.</p>
    </div>
    <div className="product-window" id="material-example" role="tabpanel" aria-labelledby={`material-tab-${active}`}>
      <div className="window-header"><span className="window-wordmark">oyra</span><span className="mono">PROJECT 001 / MATERIAL STUDY</span><span className="window-menu"><i /><i /><i /></span></div>
      <div className="window-project"><div><span className="mono light-label">YOUR WORKSPACE</span><h3>{view === "schedule" ? "Finish schedule" : "Source comparison"}</h3></div><span className="project-count">{String(active + 1).padStart(2, "0")} <span>of 03</span></span></div>
      <div className="window-tabs" role="tablist" aria-label="Product preview view"><button role="tab" aria-selected={view === "schedule"} onClick={() => setView("schedule")}>Finish schedule</button><button role="tab" aria-selected={view === "comparison"} onClick={() => setView("comparison")}>Source comparison <span>2</span></button></div>
      <div className="selected-material"><div className={`material-swatch ${m.swatch}`} /><div className="material-info"><span className="mono light-label">{m.code} / ORIGINAL SPECIFICATION</span><h4>{m.title}</h4><p>{m.finish}</p></div><span className="material-quantity">{m.quantity.toLocaleString()} <span>{m.unit}</span></span></div>
      {view === "comparison" ? <div className="comparison-area" key={`comparison-${active}`}>
        <div className="quote-row original"><div><span className="mono light-label">01 / ORIGINAL SOURCE</span><p>Specified material</p></div><div className="quote-price">${m.original.toFixed(2)}<span> / {m.unit}</span></div></div>
        <div className="quote-row alternative"><div><span className="mono light-label">02 / ALTERNATIVE TO REVIEW</span><p>{m.sample}</p><span className="review-label"><span /> Sample review required</span></div><div className="quote-price">${m.alternative.toFixed(2)}<span> / {m.unit}</span></div></div>
        <div className="comparison-bottom"><div><span className="mono light-label">ILLUSTRATIVE PRICE DIFFERENCE</span><strong>{money((m.original - m.alternative) * m.quantity)}</strong><small>Before freight, fees, and other project costs</small></div><button className="text-link" onClick={() => setDetails(!details)} aria-expanded={details}>{details ? "Close details" : "Review details"}<Arrow diagonal /></button></div>
        {details && <div className="review-detail"><span className="mono">FOR YOUR TEAM TO CONSIDER</span><p>{m.note}</p><p className="detail-footnote">Illustrative products and prices. This example is not a live supplier quote or a guarantee of equivalence.</p></div>}
      </div> : <div className="schedule-view"><div><span>Material</span><span>Quantity</span><span>Status</span></div>{materials.map((item, i) => <button key={item.code} className={active === i ? "schedule-line selected" : "schedule-line"} onClick={() => { setActive(i); setView("comparison"); }}><span><small className="mono">{item.code}</small>{item.title}</span><span>{item.quantity.toLocaleString()} {item.unit}</span><span>Compare <Arrow diagonal /></span></button>)}</div>}
      <div className="window-footer"><span className="status-dot" /> Your team makes the final selection.<span className="mono">ILLUSTRATIVE PREVIEW</span></div>
    </div>
  </div>;
}

function DemoDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [requestId] = useState(() => crypto.randomUUID());
  useEffect(() => {
    dialogRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: requestId, name: data.get("name"), email: data.get("email"), studio: data.get("studio"), role: data.get("role"), context: data.get("context"), website: data.get("website") }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn't save your request. Please try again.");
      setStatus("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong. Please try again."); setStatus("error"); }
  }
  return <dialog className="demo-dialog" ref={dialogRef} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="demo-title"><div className="dialog-layout"><div className="dialog-visual"><img src="/images/material-study.png" alt="A study of stone, timber, and architectural material samples" /><span className="dialog-brand">oyra</span><p>See Oyra<br />in practice.</p><span className="mono">MATERIAL SOURCING SOFTWARE</span></div><div className="dialog-content"><button className="close-dialog" onClick={onClose} aria-label="Close demo request"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg></button>{status === "success" ? <div className="form-success" role="status"><span className="success-mark">✓</span><span className="mono">REQUEST RECEIVED</span><h2 id="demo-title">Request received</h2><p>Your request is saved. A time has not been booked yet.</p><button className="button button-dark" onClick={onClose}>Back to Oyra <Arrow /></button></div> : <><span className="eyebrow"><i /> DEMO REQUEST</span><h2 id="demo-title">Book a demo</h2><p className="form-intro">Leave your details and what you want to see.</p><form onSubmit={submit}><div className="form-columns"><label>Your name<input name="name" autoComplete="name" placeholder="Full name" maxLength={120} required /></label><label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@studio.com" maxLength={254} required /></label></div><div className="form-columns"><label>Studio or company<input name="studio" autoComplete="organization" placeholder="Studio name" maxLength={160} required /></label><label>I work in<select name="role" required defaultValue=""><option value="" disabled>Select your field</option><option>Interior design</option><option>Architecture</option><option>Development</option><option>Other</option></select></label></div><label>What would you like to explore? <span className="optional">Optional</span><textarea name="context" placeholder="Material categories or a sourcing question…" rows={3} maxLength={1500} /></label><div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>{status === "error" && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark form-submit" disabled={status === "sending"} type="submit">{status === "sending" ? "Sending your request…" : "Request a demo"}<Arrow /></button><p className="form-privacy">We’ll use these details to respond to your demo request. Please don’t include confidential project information.</p></form></>}</div></div></dialog>;
}

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [privacy, setPrivacy] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(node => observer.observe(node));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);
  const openDemo = () => { setMenuOpen(false); setDemoOpen(true); };
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${scrolled || menuOpen ? "header-solid" : ""}`}><Brand /><nav className="desktop-nav" aria-label="Main navigation"><a href="#approach">What it does</a><a href="#platform">The platform</a><a href="#process">How it works</a></nav><div className="header-actions"><button className="nav-demo" onClick={openDemo}>Book a demo <Arrow diagonal /></button><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}><span /><span /></button></div>{menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><a href="#approach" onClick={() => setMenuOpen(false)}>What it does <Arrow diagonal /></a><a href="#platform" onClick={() => setMenuOpen(false)}>The platform <Arrow diagonal /></a><a href="#process" onClick={() => setMenuOpen(false)}>How it works <Arrow diagonal /></a><button onClick={openDemo}>Book a demo <Arrow diagonal /></button></nav>}</header>
    <main id="main">
      <section className="hero" id="top"><img className="hero-image" src="/images/architecture-hero.jpg" alt="Curved metal facade photographed by Daniel Sessler" fetchPriority="high" /><div className="hero-shade" /><div className="hero-topline mono"><span>MATERIAL SOURCING SOFTWARE</span><span>FOR ARCHITECTURE & INTERIORS</span></div><div className="hero-content"><div className="hero-heading"><h1>Find materials<br />Compare sources</h1><button className="button button-light hero-button" onClick={openDemo}>Book a demo <Arrow diagonal /></button></div><div className="hero-description"><p>Bring your finish schedule. Compare suppliers, prices, and alternatives in one place.</p></div></div><div className="hero-bottom mono"><span>OYRA / SOURCING SOFTWARE</span><a href="#platform">SEE THE PLATFORM <span className="down-arrow">↓</span></a></div></section>
      <section className="approach section-padding" id="approach"><div className="section-label mono"><span>01</span> / WHAT IT DOES</div><div className="approach-body" data-reveal><h2>From finish schedule<br />to supplier quotes</h2><div className="approach-copy"><p>Oyra reads your schedule, finds suppliers and alternatives, and organizes their quotes.</p><p>Compare specifications, prices, and availability. Review samples and approve the selection with your team.</p></div></div></section>
      <section className="material-portrait" aria-label="Architectural material study"><img src="/images/material-study.png" alt="Stone, timber, and textile material samples in monochrome" loading="lazy" /><div className="portrait-overlay" /><div className="portrait-top mono"><span>MATERIAL STUDY</span><span>STONE / TIMBER / SURFACE FINISHES</span></div><div className="material-coordinate coordinate-one"><i /><span className="mono">01 / STONE</span></div><div className="material-coordinate coordinate-two"><i /><span className="mono">02 / TIMBER</span></div></section>
      <section className="platform section-padding" id="platform"><div className="platform-intro"><div className="section-label mono"><span>02</span> / THE PLATFORM</div><div data-reveal><h2>Compare your options</h2><p>Explore an example schedule and source comparison below.</p></div></div><div data-reveal><ProductStudy /></div><div className="platform-caption mono"><span>INTERACTIVE PRODUCT EXAMPLE</span><span>EXAMPLE DATA / NOT LIVE QUOTES</span></div></section>
      <section className="process section-padding" id="process"><div className="process-intro"><div className="section-label mono"><span>03</span> / HOW IT WORKS</div><h2 data-reveal>Three steps</h2></div><div className="process-steps"><article data-reveal><span className="step-number mono">01</span><div><h3>Bring your schedule</h3><p>Start with a finish schedule or material list, including quantities and requirements.</p></div><span className="step-symbol">↳</span></article><article data-reveal><span className="step-number mono">02</span><div><h3>Compare sources</h3><p>Review supplier quotes and proposed alternatives. See prices, specifications, and differences side by side.</p></div><span className="step-symbol">↳</span></article><article data-reveal><span className="step-number mono">03</span><div><h3>Approve the selection</h3><p>Review samples and documentation with your team, then prepare the purchase. Suppliers handle delivery.</p></div><span className="step-symbol">↗</span></article></div></section>
      <section className="faq section-padding" id="questions"><div><div className="section-label mono"><span>04</span> / QUESTIONS</div><h2>Good to know</h2></div><div className="faq-items">{questions.slice(1).map(([question, answer], i) => <article className={faq === i ? "faq-item expanded" : "faq-item"} key={question}><h3><button aria-expanded={faq === i} aria-controls={`faq-${i}`} onClick={() => setFaq(faq === i ? null : i)}>{question}<span>{faq === i ? "−" : "+"}</span></button></h3><div id={`faq-${i}`} hidden={faq !== i}><p>{answer}</p></div></article>)}</div></section>
      <section className="final-cta section-padding"><div className="cta-top mono"><span>SEE OYRA IN PRACTICE</span></div><div className="cta-main" data-reveal><h2>Bring a project<br />We’ll show you Oyra</h2><div><button className="button button-light" onClick={openDemo}>Book a demo <Arrow diagonal /></button></div></div></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><p>Material sourcing software.<br />Architecture & interiors.</p><div><a href="#approach">What it does</a><a href="#platform">The platform</a><button onClick={openDemo}>Contact <Arrow diagonal /></button></div><span className="mono">NEW YORK</span></div><Brand large /><div className="footer-bottom mono"><span>© {new Date().getFullYear()} OYRA</span><button onClick={() => setPrivacy(!privacy)} aria-expanded={privacy}>PRIVACY {privacy ? "−" : "+"}</button></div>{privacy && <div className="privacy-copy"><h3>Your information</h3><p>Demo requests collect your name, email, company, field, and optional project context. Oyra stores these details to review and respond to your request. No advertising trackers are used. Don’t include confidential project information.</p></div>}</footer>
    {demoOpen && <DemoDialog onClose={() => setDemoOpen(false)} />}
  </>;
}
