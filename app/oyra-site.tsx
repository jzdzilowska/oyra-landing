"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Lenis from "lenis";
import { useInternalNavigation } from "./page-transitions";

type SitePage = "home" | "platform" | "about" | "contact";
const navigation = [{ label: "Platform", href: "/platform", page: "platform" }, { label: "About", href: "/about", page: "about" }, { label: "Contact", href: "/contact", page: "contact" }];

function Arrow({ diagonal = false, className = "" }: { diagonal?: boolean; className?: string }) {
  return <svg className={`arrow ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.35" strokeLinecap="square" /></svg>;
}

function SlabMark({ animated = false }: { animated?: boolean }) {
  return <svg className={`slab-mark${animated ? " is-animated" : ""}`} viewBox="0 0 96 96" fill="currentColor" aria-hidden="true">
    <rect className="slab-block slab-top" x="22" y="0" width="74" height="18" />
    <rect className="slab-block slab-left" x="0" y="0" width="18" height="74" />
    <rect className="slab-block slab-bottom" x="0" y="78" width="74" height="18" />
    <rect className="slab-block slab-right" x="78" y="22" width="18" height="74" />
  </svg>;
}

function Brand({ large = false }: { large?: boolean }) {
  return <a className={`brand ${large ? "brand-large" : "brand-lockup"}`} href="/" aria-label="Oyra home">
    {!large && <SlabMark />}
    <img className={large ? "brand-wordmark-large" : "brand-wordmark"} src="/brand/oyra-wordmark.svg" alt="" />
  </a>;
}

const materials = [
  { name: "Stone & tile", code: "ST–014", title: "Ivory porcelain", finish: "Matte · 600 × 600 mm", quantity: 1200, unit: "sq ft", original: 12.8, alternative: 9.6, sample: "Warm ivory porcelain", swatch: "stone", leadTimes: ["2–3 weeks", "4–5 weeks"], minimums: ["600 sq ft", "800 sq ft"], format: "600 × 600 mm", note: "Confirm tone, surface finish, and technical suitability against the project requirements before approving either source." },
  { name: "Timber & panels", code: "TP–008", title: "Natural oak panel", finish: "Brushed · Natural finish", quantity: 320, unit: "sq ft", original: 18.5, alternative: 15.25, sample: "Brushed oak panel", swatch: "wood", leadTimes: ["3–4 weeks", "5–6 weeks"], minimums: ["200 sq ft", "300 sq ft"], format: "Dimensions to confirm", note: "Confirm grain, construction, panel dimensions, and installation requirements. Similar appearance does not establish technical suitability." },
  { name: "Wall finishes", code: "WF–021", title: "Linen wallcovering", finish: "Warm grey · Woven texture", quantity: 180, unit: "yd", original: 62, alternative: 48, sample: "Textured linen wallcovering", swatch: "linen", leadTimes: ["In stock", "3–4 weeks"], minimums: ["30 yd", "50 yd"], format: "Roll width to confirm", note: "Confirm sample, roll width, backing, coverage, and application requirements before making a selection." },
];

const sourceRecords = [
  { manufacturers: ["Demonstration manufacturer 01", "Not supplied"], references: ["P-6060-M", "P-6060-W"], thickness: ["9 mm", "10 mm"], quoteRefs: ["Q-014-01", "Q-014-02"], document: "Product sheet · revision 02" },
  { manufacturers: ["Demonstration manufacturer 03", "Not supplied"], references: ["WP-OAK-18", "WP-OAK-16"], thickness: ["18 mm", "16 mm"], quoteRefs: ["Q-008-01", "Q-008-02"], document: "Panel schedule · revision 01" },
  { manufacturers: ["Demonstration manufacturer 05", "Not supplied"], references: ["WC-LIN-01", "WC-LIN-02"], thickness: ["Not stated", "Not stated"], quoteRefs: ["Q-021-01", "Q-021-02"], document: "Finish schedule · revision 03" },
];

function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number, length: number, select: (index: number) => void) {
  let next: number;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + length) % length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = length - 1;
  else return;
  event.preventDefault();
  select(next);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
}

const questions = [
  ["Which materials does Oyra cover?", "Stone and tile, timber and panels, and wall finishes. Discuss your material list with us to confirm the scope for your project."],
  ["Can we work with our existing suppliers?", "Yes. Compare quotations from your existing suppliers alongside other sources and proposed alternatives."],
  ["Who approves suppliers and alternative materials?", "Your team makes the final decision. Supplier information, quotations, samples, and technical documents need to be reviewed against the project requirements."],
  ["Where does Oyra’s scope end?", "Oyra supports supplier sourcing, quotation comparison, sample coordination, and purchase preparation. Suppliers handle delivery; your team retains approval of the selection."],
  ["What can we discuss in a demonstration?", "The workflow from a finish schedule to supplier comparison, sample tracking, and approval. You can bring a material list or sourcing question; remove confidential client details."],
];

function ProductStudy({ linkToPlatform = false }: { linkToPlatform?: boolean }) {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<"comparison" | "schedule" | "approvals">("comparison");
  const [details, setDetails] = useState(false);
  const [recordsOpen, setRecordsOpen] = useState(false);
  const m = materials[active];
  const record = sourceRecords[active];
  const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const views = [{ id: "comparison", label: "Source comparison" }, { id: "approvals", label: "Samples & approvals" }, { id: "schedule", label: "Finish schedule" }] as const;
  return <div className="product-study sourcing-study">
    <div className="material-select" role="tablist" aria-label="Example material category">
      {materials.map((material, i) => <button key={material.name} role="tab" aria-selected={active === i} aria-controls="material-example" id={`material-tab-${i}`} className={active === i ? "material-tab active" : "material-tab"} tabIndex={active === i ? 0 : -1} onKeyDown={event => moveTab(event, i, materials.length, next => { setActive(next); setDetails(false); setRecordsOpen(false); })} onClick={() => { setActive(i); setDetails(false); setRecordsOpen(false); }}><span className="mono">0{i + 1}</span><span>{material.name}</span><Arrow diagonal /></button>)}
      <p className="study-aside">Explore a material, then switch between supplier comparison, samples, and the finish schedule.</p>
      {linkToPlatform && <a className="text-link study-platform-link" href="/platform">Explore the platform <Arrow diagonal /></a>}
    </div>
    <div className="product-window" id="material-example" role="tabpanel" aria-labelledby={`material-tab-${active}`}>
      <div className="window-header"><span className="window-wordmark">OYRA</span><span className="mono">MATERIAL WORKSPACE</span></div>
      <div className="window-project"><div><span className="mono light-label">{m.code}</span><h3>{m.title}</h3></div><span className="study-state">Quotation review</span></div>
      <div className="window-tabs" role="tablist" aria-label="Product preview view">{views.map((item, index) => <button key={item.id} id={`study-tab-${item.id}`} role="tab" aria-selected={view === item.id} aria-controls="study-view" tabIndex={view === item.id ? 0 : -1} onKeyDown={event => moveTab(event, index, views.length, next => setView(views[next].id))} onClick={() => { setView(item.id); setDetails(false); }}>{item.label}</button>)}</div>
      <div className="study-view" id="study-view" role="tabpanel" aria-labelledby={`study-tab-${view}`}>
        {view === "comparison" && <>
          <div className="selected-material"><div className={`material-swatch ${m.swatch}`} /><div className="material-info"><span className="mono light-label">PROJECT REQUIREMENT</span><h4>{m.finish}</h4><p>{m.quantity.toLocaleString()} {m.unit} required</p></div></div>
          <div className="source-table-wrap"><table className="source-table"><caption className="sr-only">Supplier quotations and review status for {m.title}</caption><thead><tr><th scope="col">Comparison</th><th scope="col">Supplier 01<small>Specified product</small><small>{record.quoteRefs[0]} · 12 Nov 2026</small></th><th scope="col">Supplier 02<small>Proposed alternative</small><small>{record.quoteRefs[1]} · 12 Nov 2026</small></th></tr></thead><tbody>
            <tr><th scope="row">Material</th><td>{m.title}</td><td>{m.sample}</td></tr>
            <tr><th scope="row">Manufacturer</th><td>{record.manufacturers[0]}</td><td><span className="missing-information">{record.manufacturers[1]}</span></td></tr>
            <tr><th scope="row">Product reference</th><td>{record.references[0]}</td><td>{record.references[1]}</td></tr>
            <tr><th scope="row">Thickness</th><td>{record.thickness[0]}</td><td>{record.thickness[1]}{record.thickness[0] !== record.thickness[1] && <small className="field-difference">Differs from specification</small>}</td></tr>
            <tr><th scope="row">Unit price</th><td>${m.original.toFixed(2)} / {m.unit}</td><td>${m.alternative.toFixed(2)} / {m.unit}</td></tr>
            <tr><th scope="row">Material total</th><td>{money(m.original * m.quantity)}</td><td>{money(m.alternative * m.quantity)}</td></tr>
            <tr><th scope="row">Quoted lead time</th><td>{m.leadTimes[0]}</td><td>{m.leadTimes[1]}</td></tr>
            <tr><th scope="row">Minimum order</th><td>{m.minimums[0]}</td><td>{m.minimums[1]}</td></tr>
            <tr><th scope="row">Dimensions</th><td>{m.format}</td><td>{m.format}</td></tr>
            <tr><th scope="row">Sample</th><td>Received</td><td>Requested</td></tr>
            <tr><th scope="row">Technical review</th><td>Pending</td><td>Data sheet required</td></tr>
          </tbody></table></div>
          <div className="source-record-toggle"><span>Snapshot at quotation stage</span><button className="text-link" onClick={() => setRecordsOpen(!recordsOpen)} aria-expanded={recordsOpen} aria-controls="source-records">{recordsOpen ? "Close source records" : "View source records"}<Arrow diagonal /></button></div>
          {recordsOpen && <div className="source-records" id="source-records"><div><span className="mono">SUPPLIER 01</span><h4>{record.quoteRefs[0]}</h4><p>Quotation · 12 Nov 2026</p><p>Price, minimum order, and lead time: supplier quotation.</p><p>Product reference and dimensions: {record.document.toLowerCase()}.</p></div><div><span className="mono">SUPPLIER 02</span><h4>{record.quoteRefs[1]}</h4><p>Quotation · 12 Nov 2026</p><p>Price, minimum order, and lead time: supplier quotation.</p><p>Manufacturer confirmation and technical data: outstanding.</p></div><p className="source-record-disclosure">These are demonstration document records, not supplier-issued documents.</p></div>}
          <div className="study-review"><p>Material selection not yet recorded</p><button className="text-link" onClick={() => setDetails(!details)} aria-expanded={details} aria-controls="study-requirements">{details ? "Close requirements" : "Review requirements"}<Arrow diagonal /></button></div>
          {details && <div className="review-detail" id="study-requirements"><span className="mono">SELECTION REQUIREMENTS</span><p>{m.note}</p><p>Material totals exclude freight, taxes, and project-specific charges. Lead times require supplier confirmation before purchase.</p></div>}
        </>}
        {view === "approvals" && <div className="approval-view"><div className="approval-intro"><h4>Review before selection</h4><p>Samples and technical checks stay attached to each source.</p></div><div className="approval-row"><span>Supplier 01 sample</span><span>Received · awaiting review</span></div><div className="approval-row"><span>Supplier 02 sample</span><span>Requested · not received</span></div><div className="approval-row"><span>Technical documentation</span><span>Review incomplete</span></div><div className="approval-row"><span>Final selection</span><span>Not approved</span></div><p className="approval-note">Your team reviews the material and records the approved selection before purchase preparation.</p></div>}
        {view === "schedule" && <div className="schedule-view"><div><span>Material</span><span>Quantity</span><span>Review</span></div>{materials.map((item, i) => <button key={item.code} className={active === i ? "schedule-line selected" : "schedule-line"} onClick={() => { setActive(i); setView("comparison"); setDetails(false); setRecordsOpen(false); }}><span><small className="mono">{item.code}</small>{item.title}</span><span>{item.quantity.toLocaleString()} {item.unit}</span><span>Compare <Arrow diagonal /></span></button>)}</div>}
      </div>
      <div className="window-footer study-disclosure">Demonstration workspace · Suppliers, products, quotations, and documents are illustrative</div>
    </div>
  </div>;
}

const selectionStages = [
  { label: "Requirement", date: "11 Nov", title: "Define the finish requirement", description: "Reception floor · ST–014", rows: [["Specified finish", "Matte porcelain, 600 × 600 mm, 9 mm thick"], ["Quantity", "1,200 sq ft"], ["Programme", "Material required within three weeks"]], evidence: "Finish schedule · revision 02", outcome: "Requirement issued for sourcing" },
  { label: "Sources", date: "12 Nov", title: "Record the supplier proposals", description: "Two quotations linked to the same finish reference.", rows: [["Supplier 01 · P-6060-M", "$12.80 / sq ft · 2–3 weeks · 9 mm"], ["Supplier 02 · P-6060-W", "$9.60 / sq ft · 4–5 weeks · 10 mm"], ["Outstanding", "Alternative manufacturer and technical data"]], evidence: "Quotations Q-014-01 and Q-014-02", outcome: "Alternative identified for review" },
  { label: "Differences", date: "13 Nov", title: "Identify what changes", description: "The alternative affects more than the material total.", rows: [["Material price", "Supplier 02 is $3.20 / sq ft lower"], ["Build-up", "10 mm alternative differs from the 9 mm specification"], ["Programme", "4–5 week lead time exceeds the three-week requirement"]], evidence: "Quotation comparison · finish ST–014", outcome: "Thickness and programme differences flagged" },
  { label: "Review", date: "14 Nov", title: "Record the team’s review", description: "Sample review and material selection are separate decisions.", rows: [["Specified product sample", "Reviewed by interiors lead; finish accepted"], ["Specified product data", "Reviewed against the finish requirement"], ["Alternative", "Not progressed because of thickness and lead-time differences"]], evidence: "Sample review SR-014 · technical review TR-014", outcome: "Specified product recommended for selection" },
  { label: "Decision", date: "15 Nov", title: "Record the selected material", description: "The decision stays attached to the finish and its supporting records.", rows: [["Selected material", "P-6060-M · Supplier 01"], ["Decision", "Specified product retained after team review"], ["Reason", "Meets the specified thickness and quoted programme"], ["Purchase preparation", "Selection ready for quantity and supplier-term confirmation"]], evidence: "Selection record SEL-014 · recorded by project lead", outcome: "Material selection recorded · order not placed" },
];

function SelectionExample() {
  const [stage, setStage] = useState(0);
  const selected = selectionStages[stage];
  return <section className="decision-example section-padding" id="selection-example">
    <div className="decision-heading"><span className="section-label mono"><span>03</span> MATERIAL SELECTION</span><h2>From requirement<br />to recorded decision</h2><p>Follow one interior finish through sourcing, sample review, and selection.</p><span className="case-label">Demonstration scenario · reception floor</span></div>
    <div className="selection-case"><div className="case-tabs" role="tablist" aria-label="Material selection stages">{selectionStages.map((item, index) => <button key={item.label} role="tab" id={`case-step-${index}`} aria-controls="case-panel" aria-selected={stage === index} tabIndex={stage === index ? 0 : -1} onKeyDown={event => moveTab(event, index, selectionStages.length, setStage)} onClick={() => setStage(index)}><span>0{index + 1}</span>{item.label}</button>)}</div><div className="case-panel" role="tabpanel" id="case-panel" aria-labelledby={`case-step-${stage}`}><div className="case-panel-meta"><span className="mono">ST–014 · RECEPTION FLOOR</span><span className="mono">{selected.date}</span></div><h3>{selected.title}</h3><p className="case-description">{selected.description}</p><dl className="case-details">{selected.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="case-evidence"><span className="mono">LINKED RECORD</span><p>{selected.evidence}</p></div><div className="case-outcome"><span className="mono">STATUS</span><p>{selected.outcome}</p></div><button className="text-link" onClick={() => setStage((stage + 1) % selectionStages.length)}>{stage === selectionStages.length - 1 ? "Back to requirement" : `Next: ${selectionStages[stage + 1].label.toLowerCase()}`}<Arrow /></button></div><p className="case-disclosure">Illustrative products, documents, review roles, and decisions. This is not a completed client project.</p></div>
  </section>;
}

function RequestForm({ onClose = () => {}, contact = false }: { onClose?: () => void; contact?: boolean }) {
  const titleId = contact ? "contact-title" : "demo-title";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [requestId] = useState(() => crypto.randomUUID());
  useEffect(() => {
    if (contact) return;
    dialogRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [contact]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: requestId, kind: contact ? "contact" : "demo", name: data.get("name"), email: data.get("email"), studio: data.get("studio"), role: data.get("role"), context: data.get("context"), website: data.get("website") }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn't save your request. Please try again.");
      setStatus("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong. Please try again."); setStatus("error"); }
  }
  const content = <div className="dialog-layout"><div className="dialog-visual"><img src="/images/material-study.png" alt="A study of stone, timber, and architectural material samples" /><span className="dialog-brand">OYRA</span><p>See Oyra<br />in practice.</p><span className="mono">MATERIAL SOURCING SOFTWARE</span></div><div className="dialog-content">{!contact && <button className="close-dialog" onClick={onClose} aria-label="Close demo request"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg></button>}{status === "success" ? <div className="form-success" role="status"><span className="success-mark">✓</span><span className="mono">REQUEST RECEIVED</span><h2 id={titleId}>Request received</h2><p>{contact ? "Your enquiry has been received." : "Your request is saved. A time has not been booked yet."}</p>{contact ? <a className="button button-dark" href="/">Back to Oyra <Arrow /></a> : <button className="button button-dark" onClick={onClose}>Back to Oyra <Arrow /></button>}</div> : <><span className="eyebrow"><i /> {contact ? "CONTACT OYRA" : "DEMO REQUEST"}</span><h2 id={titleId}>{contact ? "Send an enquiry" : "Request a demo"}</h2><p className="form-intro">{contact ? "For project enquiries, supplier introductions, and questions about Oyra." : "Leave your details and what you want to see."}</p><form onSubmit={submit}><div className="form-columns"><label>Your name<input name="name" autoComplete="name" placeholder="Full name" maxLength={120} required /></label><label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@studio.com" maxLength={254} required /></label></div><div className="form-columns"><label>Studio or company<input name="studio" autoComplete="organization" placeholder="Studio name" maxLength={160} required /></label><label>I work in<select name="role" required defaultValue=""><option value="" disabled>Select your field</option><option>Interior design</option><option>Architecture</option><option>Development</option><option>Supplier</option><option>Other</option></select></label></div><label>{contact ? "Your enquiry" : "What would you like to explore?"} {!contact && <span className="optional">Optional</span>}<textarea name="context" placeholder={contact ? "Tell us about your project or enquiry" : "Material categories or a sourcing question…"} rows={4} maxLength={1500} required={contact} /></label><div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>{status === "error" && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark form-submit" disabled={status === "sending"} type="submit">{status === "sending" ? "Sending…" : contact ? "Send enquiry" : "Request a demo"}<Arrow /></button><p className="form-privacy">We’ll use these details to respond to your enquiry. Please don’t include confidential project information.</p></form></>}</div></div>;
  return contact ? <section className="contact-panel" aria-labelledby={titleId}>{content}</section> : <dialog data-lenis-prevent="" className="demo-dialog" ref={dialogRef} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby={titleId}>{content}</dialog>;
}

export default function OyraSite({ page = "home" }: { page?: SitePage }) {
  const internallyNavigated = useInternalNavigation();
  const scrollRef = useRef<Lenis | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navOnDark, setNavOnDark] = useState(page === "home");
  const [loading, setLoading] = useState(page === "home" && !internallyNavigated);
  const [loadingLeaving, setLoadingLeaving] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [privacy, setPrivacy] = useState(false);
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const configureScrolling = () => {
      scrollRef.current?.destroy();
      scrollRef.current = null;
      if (motionPreference.matches) return;
      const scroll = new Lenis({
        autoRaf: true,
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        prevent: node => node.closest("dialog") !== null,
      });
      if (document.querySelector(".brand-loader, dialog[open]")) scroll.stop();
      scrollRef.current = scroll;
    };
    configureScrolling();
    motionPreference.addEventListener("change", configureScrolling);
    return () => {
      motionPreference.removeEventListener("change", configureScrolling);
      scrollRef.current?.destroy();
      scrollRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (demoOpen || loading) scrollRef.current?.stop();
    else scrollRef.current?.start();
  }, [demoOpen, loading]);
  useEffect(() => {
    if (!loading) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fadeTimer = window.setTimeout(() => setLoadingLeaving(true), 2300);
    const timer = window.setTimeout(() => setLoading(false), 3000);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [loading]);
  useEffect(() => {
    const sections = [...document.querySelectorAll("main > section, main > .hero-frame > section, footer")];
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const surface = sections.find(section => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= 32 && bounds.bottom > 32;
      });
      setNavOnDark(surface?.matches(".hero, .approach, .product-overview, .decision-example, .material-portrait, .final-cta") ?? false);
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(node => observer.observe(node));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);
  const openDemo = () => { setMenuOpen(false); setDemoOpen(true); };
  return <>
    <div className="site-content" inert={loading} aria-hidden={loading || undefined}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${scrolled || menuOpen || page !== "home" ? "header-solid" : ""} ${navOnDark ? "header-on-dark" : ""}`}><Brand /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <a key={item.page} href={item.href} aria-current={page === item.page ? "page" : undefined}>{item.label}</a>)}</nav><div className="header-actions"><button className="nav-demo" onClick={openDemo}>Request a demo <Arrow diagonal /></button><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}><span /><span /></button></div>{menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <a key={item.page} href={item.href} aria-current={page === item.page ? "page" : undefined} onClick={() => setMenuOpen(false)}>{item.label}<Arrow diagonal /></a>)}<button onClick={openDemo}>Request a demo <Arrow diagonal /></button></nav>}</header>
    <main id="main" tabIndex={-1}>
    {page === "home" && <>

      <div className="hero-frame"><section className="hero" id="top"><img className="hero-image" src="/images/declan-sun-staircase.jpg" alt="Sweeping timber walls and an illuminated curved staircase photographed by Declan Sun" fetchPriority="high" /><div className="hero-shade" /><div className="hero-content"><div className="hero-heading"><h1>A new standard<br />for material sourcing</h1></div><div className="hero-description"><p>Source interior materials and finishes, compare supplier quotations, and coordinate samples through to approval.</p></div><button className="button button-light hero-button" onClick={openDemo}>Request a demo <Arrow diagonal /></button></div></section></div>
      <section className="platform product-overview section-padding" id="platform"><div className="platform-intro"><div className="section-label mono"><span>01</span> THE PLATFORM</div><div><h2>Compare sources against<br />your specification</h2><p>Compare quotations, lead times, minimum orders, and sample status against your finish schedule.</p></div></div><ProductStudy linkToPlatform /></section>
      <section className="capabilities section-padding" id="capabilities"><div className="capabilities-heading"><span className="section-label mono"><span>02</span> SOURCING & SELECTION</span><h2>The details behind<br />a material decision</h2></div><div className="capability-grid"><article><span className="mono">01</span><h3>Material sourcing</h3><p>Organise potential sources against the finish schedule, including material requirements, quantities, and outstanding information.</p><div className="capability-preview"><span className="mono">SUPPLIER SHORTLIST</span><div><span>Specified product</span><strong>P-6060-M · Supplier 01</strong></div><div><span>Proposed alternative</span><strong>P-6060-W · Supplier 02</strong></div></div></article><article><span className="mono">02</span><h3>Quotation comparison</h3><p>Review prices alongside dimensions, minimum orders, availability, and proposed differences from the specification.</p><div className="capability-preview"><span className="mono">DIFFERENCES IDENTIFIED</span><div><span>Thickness</span><strong>9 mm / 10 mm</strong></div><div><span>Quoted lead time</span><strong>2–3 / 4–5 weeks</strong></div></div></article><article><span className="mono">03</span><h3>Samples & approvals</h3><p>Track sample requests, technical documents, and review status before recording the approved selection for purchase.</p><div className="capability-preview"><span className="mono">REVIEW RECORD</span><div><span>Sample review</span><strong>Recorded</strong></div><div><span>Material selection</span><strong>Specified product retained</strong></div></div></article></div><p className="capability-disclosure">Illustrative outputs from the material selection below.</p></section>
      <SelectionExample />
      <section className="faq section-padding" id="questions"><div><div className="section-label mono"><span>04</span> QUESTIONS</div><h2>Working with Oyra</h2></div><div className="faq-items">{questions.map(([question, answer], i) => <article className={faq === i ? "faq-item expanded" : "faq-item"} key={question}><h3><button aria-expanded={faq === i} aria-controls={`faq-${i}`} onClick={() => setFaq(faq === i ? null : i)}>{question}<span>{faq === i ? "−" : "+"}</span></button></h3><div id={`faq-${i}`} hidden={faq !== i}><p>{answer}</p></div></article>)}</div></section>
      <section className="final-cta section-padding"><div className="cta-top mono"><span>DEMONSTRATION</span></div><div className="cta-main" data-reveal><h2>See Oyra<br />in practice</h2><div><p>Review supplier comparison, sample tracking, and approval with a material list or sourcing question.</p><button className="button button-light" onClick={openDemo}>Request a demo <Arrow diagonal /></button></div></div></section>
    </>}
    {page === "platform" && <>
      <section className="page-masthead section-padding"><span className="eyebrow">PLATFORM</span><h1>From specification<br />to selection</h1><p>Source interior materials and finishes, compare supplier quotations, coordinate samples, and prepare approved selections for purchase.</p></section>
      <section className="material-scope section-padding"><div className="section-label">MATERIALS</div><div className="scope-grid"><article><span className="mono">01</span><h2>Stone & tile</h2><p>Compare formats, finishes, quantities, pricing, and supplier documentation.</p></article><article><span className="mono">02</span><h2>Timber & panels</h2><p>Review species, construction, dimensions, surface treatments, and availability.</p></article><article><span className="mono">03</span><h2>Wall finishes</h2><p>Consider texture, coverage, backing, and application requirements alongside samples.</p></article></div><p className="scope-note">Material suitability and substitutions remain subject to your team’s review and approval.</p></section>
      <section className="platform section-padding" id="platform"><div className="platform-intro"><div className="section-label mono"><span>01</span> SOURCE COMPARISON</div><div data-reveal><h2>Compare your options</h2><p>Explore an example schedule and source comparison below.</p></div></div><div data-reveal><ProductStudy /></div></section>
      <section className="process section-padding" id="process"><div className="process-intro"><div className="section-label mono"><span>02</span> WORKFLOW</div><h2 data-reveal>Three steps</h2></div><div className="process-steps"><article data-reveal><span className="step-number mono">01</span><div><h3>Bring your schedule</h3><p>Start with a finish schedule or material list, including quantities and requirements.</p></div><span className="step-symbol">↳</span></article><article data-reveal><span className="step-number mono">02</span><div><h3>Compare sources</h3><p>Review supplier quotes and proposed alternatives. See prices, specifications, and differences side by side.</p></div><span className="step-symbol">↳</span></article><article data-reveal><span className="step-number mono">03</span><div><h3>Approve the selection</h3><p>Review samples and documentation with your team, then prepare the purchase. Suppliers handle delivery.</p></div><span className="step-symbol">↗</span></article></div></section>
      <section className="faq section-padding" id="questions"><div><div className="section-label mono"><span>03</span> QUESTIONS</div><h2>Working with Oyra</h2></div><div className="faq-items">{questions.map(([question, answer], i) => <article className={faq === i ? "faq-item expanded" : "faq-item"} key={question}><h3><button aria-expanded={faq === i} aria-controls={`faq-${i}`} onClick={() => setFaq(faq === i ? null : i)}>{question}<span>{faq === i ? "−" : "+"}</span></button></h3><div id={`faq-${i}`} hidden={faq !== i}><p>{answer}</p></div></article>)}</div></section>
      <section className="final-cta section-padding"><div className="cta-top mono"><span>DEMONSTRATION</span></div><div className="cta-main" data-reveal><h2>See Oyra<br />in practice</h2><div><p>Review supplier comparison, sample tracking, and approval with a material list or sourcing question.</p><button className="button button-light" onClick={openDemo}>Request a demo <Arrow diagonal /></button></div></div></section>
    </>}
    {page === "about" && <>
      <section className="page-masthead section-padding"><span className="eyebrow">ABOUT OYRA</span><h1>Material sourcing for<br />architecture and interiors</h1><p>Oyra brings supplier research, quotations, samples, and selections into one workspace.</p></section>
      <section className="about-body section-padding"><div className="section-label">OUR APPROACH</div><div className="about-copy"><h2>Keep the specification<br />in view</h2><p>A material decision depends on more than appearance or unit price. Dimensions, technical requirements, availability, and samples all need to be considered together.</p><p>Oyra organises those details around the project’s finish schedule. Teams can review their existing suppliers alongside other sources, understand proposed alternatives, and record what has been approved.</p><div className="about-principles"><article><h3>Clear comparisons</h3><p>Compare quotes against the same requirements, with differences and missing information visible.</p></article><article><h3>Approval stays with your team</h3><p>Proposed alternatives are reviewed against samples and documentation before a selection is approved.</p></article><article><h3>A defined scope</h3><p>Oyra supports sourcing and purchase preparation. Suppliers handle delivery.</p></article></div></div></section>
      <section className="about-location section-padding"><span className="section-label">BASED IN NEW YORK</span><div><h2>Speak with Oyra</h2><p>Discuss a project, introduce your materials, or arrange a demonstration.</p><a className="text-link" href="/contact">Contact <Arrow diagonal /></a></div></section>
    </>}
    {page === "contact" && <>
      <section className="contact-page section-padding"><div className="contact-intro"><span className="eyebrow">CONTACT</span><h1>Get in touch</h1><p>For architecture and interior design teams, material suppliers, and project enquiries.</p><div className="contact-demo"><h2>See the platform</h2><p>Bring a finish schedule, material list, or sourcing question to a demonstration.</p><button className="text-link" onClick={openDemo}>Request a demo <Arrow diagonal /></button></div><span className="mono contact-location">NEW YORK</span></div><RequestForm contact /></section>
    </>}
    </main>
    <footer className="site-footer"><div className="footer-top"><p>Material sourcing software.<br />Architecture & interiors.</p><div>{navigation.map(item => <a key={item.page} href={item.href}>{item.label}</a>)}</div><span className="mono">NEW YORK</span></div><Brand large /><div className="footer-bottom mono"><span>© {new Date().getFullYear()} OYRA</span><button onClick={() => setPrivacy(!privacy)} aria-expanded={privacy}>PRIVACY {privacy ? "−" : "+"}</button></div>{privacy && <div className="privacy-copy"><h3>Your information</h3><p>Enquiries and demo requests collect your name, email, company, field, and project context. Oyra stores these details to review and respond to your enquiry. No advertising trackers are used. Don’t include confidential project information.</p></div>}</footer>
    {demoOpen && <RequestForm onClose={() => setDemoOpen(false)} />}
    </div>
    {loading && <div className={`brand-loader${loadingLeaving ? " is-leaving" : ""}`} role="status" aria-label="Loading Oyra"><SlabMark animated /></div>}
  </>;
}
