import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Camera, Facebook, Film, Globe, Mail, MapPin, Menu, Pause, Phone, Play, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Atmosphere } from "@/components/atmosphere";
import { CinematicIntro } from "@/components/cinema/cinematic-intro";
import { filterPortfolio, portfolio, services } from "@/lib/studio";
import logo from "@/assets/dw-mark.asset.json";

import { WorkBook } from "@/components/cinema/work-book";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "DW Production Media — Innovate. Create. Elevate." },
    { name: "description", content: "Complete media and branding solutions from DW Production Media in Dhaka. Film, photography, digital content, events, talent and media management." },
    { property: "og:title", content: "DW Production Media — Innovate. Create. Elevate." },
    { property: "og:description", content: "A new-generation creative production studio. Explore our media, branding and production ecosystem." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const [selected, setSelected] = useState(0);
  const [category, setCategory] = useState("All work");
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookIndex, setBookIndex] = useState<number | null>(null);

  // Contact form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formService, setFormService] = useState("Cinema & Commercial Production");
  const [formMessage, setFormMessage] = useState("");
  const [formSent, setFormSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project Inquiry: ${formService} - ${formName}`);
    const body = encodeURIComponent(
      `DW PRODUCTION MEDIA PROJECT INQUIRY\n` +
      `====================================\n\n` +
      `CLIENT NAME: ${formName}\n` +
      `CLIENT EMAIL: ${formEmail}\n` +
      `PHONE / WHATSAPP: ${formPhone || "Not provided"}\n` +
      `SERVICE CATEGORY: ${formService}\n\n` +
      `PROJECT BRIEF / MESSAGE:\n` +
      `${formMessage}\n\n` +
      `------------------------------------\n` +
      `Target Recipient: dwproductionmedia@gmail.com\n` +
      `Sent via DW Production Media Web Portal`
    );

    window.location.href = `mailto:dwproductionmedia@gmail.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  };
  const service = services[selected] ?? services[0];
  const selectByKeyboard = (event: React.KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % services.length;
    else if (event.key === "ArrowUp") next = (index + services.length - 1) % services.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    else return;
    event.preventDefault(); setSelected(next);
    document.getElementById(`service-${next}`)?.focus();
  };
  return (
    <div className={`studio ${paused ? "paused" : ""}`}>
      <CinematicIntro />
      <header className="site-header">
        <a href="#top" className="brand" aria-label="DW Production Media home">
          <img src={logo.url} alt="DW Production Media" className="brand-official-logo" />
        </a>
        <nav aria-label="Main navigation" className={`navigation ${menuOpen ? "is-open" : ""}`}>
          {[['Work', '#work'], ['Services', '#services'], ['The Studio', '#studio'], ['Contact', '#contact']].map(([name, href]) => <a key={name} href={href} onClick={() => setMenuOpen(false)}>{name}</a>)}
        </nav>
        <div className="header-action"><Button variant="cinema" asChild><a href="#contact">Let’s talk <ArrowUpRight /></a></Button><Button variant="editorial" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
      </header>
      <main>
        <section id="top" className="hero">
          <Atmosphere paused={paused} /><div className="film-grain" />
          <div className="container hero-inner">
            <div className="hero-film-strip-badge">
              <Film size={12} />
              <span>CINEMA &amp; DIGITAL PRODUCTION STUDIO · SCENE 01 / TAKE 2026</span>
            </div>
            <div className="eyebrow">DW PRODUCTION MEDIA · DHAKA, BANGLADESH</div>
            <h1 aria-label="Innovate. Create. Elevate."><span className="hero-word">INNOVATE<span>.</span></span><span className="hero-word">CREATE<span>.</span></span><span className="hero-word">ELEVATE.</span></h1>
            <p className="hero-description">Complete Media &amp; Branding Solutions</p>
            <div className="hero-actions">
              <Button variant="cinema" asChild><a href="#work">Explore our work <ArrowUpRight /></a></Button>
              <Button variant="editorial" asChild><a href="#services"><span className="round-icon"><ArrowRight size={13} /></span>Our creative worlds</a></Button>
            </div>
          </div>
          <div className="hero-camera-spin-wrap" aria-hidden="true">
            <img
              src="/media/hero-cinema-camera.png"
              alt="35mm Cinema Camera &amp; Film Reel"
              className="hero-camera-spin-img"
            />
          </div>
          <div className="hero-side" aria-hidden="true"><div className="side-line" /><span className="side-text">VISION INTO REALITY</span></div>
          <div className="hero-bottom"><div><span className="live-dot" /> INDEPENDENT VISION. COLLECTIVE CREATIVITY.</div><a className="hero-scroll" href="#services">SCROLL TO DISCOVER <ArrowDown size={12} /></a><Button className="hero-motion" variant="editorial" onClick={() => setPaused(!paused)} aria-label={paused ? "Resume atmospheric motion" : "Pause atmospheric motion"}>{paused ? <Play size={10} /> : <Pause size={10} />} {paused ? "MOTION OFF" : "MOTION ON"}</Button></div>
        </section>
        <section className="association" aria-label="Strategic associations">
          <div className="association-marquee-wrap">
            <div className="association-track">
              <span className="eyebrow">IN STRATEGIC ASSOCIATION WITH</span>
              <div className="partner-name">Dhaka Model Agency<small>FASHION · TALENT · PRODUCTION</small></div>
              <div className="partner-name">Anondo Binodon<small>ENTERTAINMENT · CULTURE · MEDIA</small></div>
              <div className="partner-name">Neo Classic Media<small>CREATIVE COLLABORATION</small></div>
              <span className="eyebrow" aria-hidden="true">IN STRATEGIC ASSOCIATION WITH</span>
              <div className="partner-name" aria-hidden="true">Dhaka Model Agency<small>FASHION · TALENT · PRODUCTION</small></div>
              <div className="partner-name" aria-hidden="true">Anondo Binodon<small>ENTERTAINMENT · CULTURE · MEDIA</small></div>
              <div className="partner-name" aria-hidden="true">Neo Classic Media<small>CREATIVE COLLABORATION</small></div>
            </div>
          </div>
        </section>
        <section id="services" className="section container">
          <div className="section-head"><div><div className="eyebrow"><span className="section-number">01 /</span> WHAT WE CREATE</div><h2>Different worlds.<br /><em>One creative vision.</em></h2></div><p className="section-caption">From the first spark of an idea<br />to the moment it meets the world.</p></div>
          <div className="services-layout"><div role="tablist" aria-label="Production services" aria-orientation="vertical">{services.map((item, index) => <Button id={`service-${index}`} role="tab" tabIndex={selected === index ? 0 : -1} aria-selected={selected === index} aria-controls="service-preview" key={item.name} variant="service" onMouseEnter={() => setSelected(index)} onFocus={() => setSelected(index)} onClick={() => setSelected(index)} onKeyDown={(event) => selectByKeyboard(event,index)}><span className="service-left"><span className="service-index">{String(index + 1).padStart(2, '0')}</span>{item.name}</span><ArrowRight className="service-arrow" /></Button>)}</div>
            <div id="service-preview" role="tabpanel" aria-labelledby={`service-${selected}`} className={`service-stage world-${service.world}`}><div className="service-image-wrap"><img key={service.name} src={service.image} alt={`${service.name} reference from the supplied partner portfolio`} loading="lazy" /><div className="stage-frame" /><span className="frame-label">{service.frame}</span><div className="rhythm" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i}/>)}</div></div><p className="service-credit">{selected === 7 ? "Anondo Binodon" : "Dhaka Model Agency"} · Supplied partner portfolio</p><h3>{service.short}</h3><p>{service.description}</p><Button variant="editorial" asChild><a href={`mailto:dwproductionmedia@gmail.com?subject=${encodeURIComponent(service.name + ' enquiry')}`}>Discuss a {service.name.toLowerCase()} project <ArrowUpRight /></a></Button></div>
          </div>
        </section>
        <section id="work" className="section work-section"><div className="container"><div className="section-head"><div><div className="eyebrow"><span className="section-number">02 /</span> OUR CREATIVE ECOSYSTEM — PREVIOUS &amp; LEGACY WORK</div><h2>Real people.<br /><em>Real production.</em></h2></div><p className="section-caption">A look inside the work of our<br />production and creative collaborators.</p></div><div className="work-filters" aria-label="Filter portfolio">{['All work', ...Array.from(new Set(portfolio.map((p) => p.category)))].map((filter)=><Button key={filter} variant="editorial" aria-pressed={category===filter} onClick={()=>setCategory(filter)}>{filter}</Button>)}</div><div className="work-grid">{filterPortfolio(category).map((work,index)=>{const pIdx = portfolio.findIndex((p)=>p.title===work.title); return (<article className="work-item" key={work.title}><Button className="work-open" variant="editorial" onClick={()=>setBookIndex(pIdx >= 0 ? pIdx : index)} aria-label={`Open work book for ${work.title}`}><div className="work-photo"><img src={work.image} alt={work.title} loading="lazy"/>{work.status && (<span className="work-badge-upcoming">{work.status}</span>)}<span className="round-icon"><ArrowUpRight size={15}/></span></div></Button><div className="work-meta"><span>{work.category.toUpperCase()}{work.status ? ` · ${work.status}` : ""}</span><span>0{index+1}</span></div><h3>{work.title}</h3><p className="work-credit">{work.credit}</p></article>);})}</div></div></section>
        <section id="studio" className="section about"><div className="container about-inner"><div><div className="eyebrow"><span className="section-number">03 /</span> THE STUDIO</div><h2>Fresh perspective.<br /><em>Shared experience.</em></h2></div><div className="about-copy"><p><strong>We are DW Production Media.</strong> A new-generation media and entertainment initiative bringing together creative production, brand experiences and digital culture.</p><p>Our independent vision is supported by experienced collaborators in fashion, production and entertainment media. Together, we connect ideas, talent and brands—with thoughtful planning and purposeful execution.</p><div className="about-signature"><span className="live-dot" /> CREATE · CAPTURE · CONNECT</div></div></div></section>
        {/* Section 04: Interactive Direct Contact Form */}
        <section id="contact" className="contact-section">
          <div className="container">
            <div className="eyebrow"><span className="section-number">04 /</span> THE NEXT FRAME IS YOURS</div>
            <div className="contact-line">
              <h2>LET’S CREATE<br /><em>SOMETHING GREAT.</em></h2>
              <a
                href="mailto:dwproductionmedia@gmail.com"
                className="contact-cta"
                aria-label="Direct email to dwproductionmedia@gmail.com"
              >
                <Mail size={28} />
              </a>
            </div>

            {/* Direct Contact Form */}
            <form className="direct-contact-form" onSubmit={handleContactSubmit}>
              <div className="form-header-badge">
                <span className="live-dot" />
                <span>DIRECT DISPATCH TO: dwproductionmedia@gmail.com</span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="contact-name">YOUR NAME *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Shakib Ahmed"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">YOUR EMAIL *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-phone">PHONE / WHATSAPP</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+880 1345-741060"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-service">PROJECT TYPE</label>
                  <select
                    id="contact-service"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                  >
                    <option value="Cinema & Commercial Production">Cinema &amp; Commercial Production</option>
                    <option value="Event Management & Award Shows (BCCA / CCA)">Event Management &amp; Award Shows (BCCA / CCA)</option>
                    <option value="Fashion Runway & Brand Production">Fashion Runway &amp; Brand Production</option>
                    <option value="Talent & Model Management">Talent &amp; Model Management (Dhaka Model Agency)</option>
                    <option value="Entertainment & Media Publishing">Entertainment &amp; Media Publishing (Anondo Binodon)</option>
                    <option value="General Branding Inquiry">General Branding Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="contact-message">PROJECT BRIEF / MESSAGE *</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Share your project concept, timeline, and vision..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                />
              </div>

              <div className="form-action-bar">
                <Button type="submit" variant="cinema" className="send-form-btn">
                  <Mail size={16} />
                  <span>SEND MESSAGE TO DW PRODUCTION MEDIA</span>
                  <ArrowUpRight size={16} />
                </Button>
                <div className="direct-email-indicator">
                  Target Email: <strong>dwproductionmedia@gmail.com</strong>
                </div>
              </div>

              {formSent && (
                <div className="form-success-banner" role="alert">
                  <span className="live-dot" />
                  <div>
                    <strong>INQUIRY PREPARED FOR DW PRODUCTION MEDIA!</strong>
                    <p>
                      Opening your email client with message prefilled to <strong>dwproductionmedia@gmail.com</strong>.
                      If your mail program didn't open automatically, <a href={`mailto:dwproductionmedia@gmail.com?subject=${encodeURIComponent('Project Inquiry: ' + formService)}&body=${encodeURIComponent(formMessage)}`}>click here to send email directly</a>.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main-grid">
          {/* Column 1: Brand & Facebook QR */}
          <div className="footer-col footer-brand-col">
            <div className="footer-brand">
              <img src={logo.url} alt="DW Production Media" className="footer-official-logo" />
            </div>
            <p className="footer-tagline">
              Innovate. Create. Elevate.<br />
              Complete media, event &amp; branding solutions connecting creators, culture, and corporate excellence.
            </p>
            <div className="footer-socials">
              <a
                href="https://www.facebook.com/share/1ckyyQszSx/"
                target="_blank"
                rel="noopener noreferrer"
                className="facebook-btn"
                aria-label="DW Production Media Official Facebook"
              >
                <Facebook size={14} />
                <span>Official Facebook Page</span>
              </a>

              {/* Facebook Page QR Code Card */}
              <div className="facebook-qr-card">
                <div className="qr-frame">
                  <img src="/media/location-qr.png" alt="Scan QR Code for Official Facebook Page" />
                </div>
                <div className="qr-copy">
                  <span>SCAN FOR FACEBOOK</span>
                  <small>Scan QR code to connect on Facebook Page</small>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col footer-links-col">
            <h4>CREATIVE NAVIGATION</h4>
            <ul>
              <li><a href="#work">Selected Productions</a></li>
              <li><a href="#services">Services Overview</a></li>
              <li><a href="#studio">The Studio &amp; Vision</a></li>
              <li><a href="#contact">Contact &amp; Location</a></li>
            </ul>
            <h4 style={{ marginTop: "20px" }}>FLAGSHIP PLATFORMS</h4>
            <ul>
              <li><a href="#work" onClick={() => setBookIndex(0)}>BCCA Awards 2026</a></li>
              <li><a href="#work" onClick={() => setBookIndex(1)}>CCA Award 2026 (Upcoming)</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="footer-col footer-contact-col">
            <h4>GET IN TOUCH</h4>
            <div className="contact-info-list">
              <div className="info-item">
                <Mail size={15} className="info-icon" />
                <div>
                  <small>DIRECT EMAIL</small>
                  <a href="mailto:dwproductionmedia@gmail.com">dwproductionmedia@gmail.com</a>
                </div>
              </div>

              <div className="info-item">
                <Phone size={15} className="info-icon" />
                <div>
                  <small>PHONE / WHATSAPP</small>
                  <a href="tel:+8801345741060">+880 1345-741060</a>
                </div>
              </div>

              <div className="info-item">
                <MapPin size={15} className="info-icon" />
                <div>
                  <small>STUDIO OFFICE ADDRESS</small>
                  <address>
                    House 8, 9, 10/3, Free School Street,<br />
                    Panthapath Road, Dhaka 1205, Bangladesh
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Office Location & Google Maps */}
          <div className="footer-col footer-location-col">
            <h4>OFFICE LOCATION</h4>
            <div className="office-location-card">
              <div className="location-header">
                <MapPin size={16} />
                <span>STUDIO HEADQUARTERS</span>
              </div>
              <address>
                House 8, 9, 10/3, Free School Street,<br />
                Panthapath Road, Dhaka 1205, Bangladesh
              </address>
              <a
                href="https://maps.google.com/?q=House+8+Free+School+Street+Panthapath+Dhaka+1205"
                target="_blank"
                rel="noopener noreferrer"
                className="maps-btn"
              >
                <MapPin size={12} />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Copyright Bar */}
        <div className="footer-bottom-bar">
          <div className="container footer-bottom-inner">
            <span>© {new Date().getFullYear()} DW PRODUCTION MEDIA. ALL RIGHTS RESERVED.</span>
            <span className="footer-motto">INNOVATE. CREATE. ELEVATE.</span>
            <a href="#top" className="back-top">BACK TO TOP ↑</a>
          </div>
        </div>
      </footer>
      <WorkBook isOpen={bookIndex !== null} initialIndex={bookIndex ?? 0} projectIndex={bookIndex ?? 0} project={bookIndex !== null ? portfolio[bookIndex] : undefined} onClose={() => setBookIndex(null)} />
    </div>
  );
}
