import React, { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import "./DustAndGold.css";
import otitoPhoto from "../../assets/otito.jpg"; // swap in your actual filename/extension
import frontCoverImg from "../../assets/front-cover-placeholder.svg"; // replace with real front cover
import backCoverImg from "../../assets/back-cover-placeholder.svg"; // replace with real back cover

// lucide-react dropped brand/social icons in v1, so these three are
// small inline SVGs instead — same 24x24 grid, same stroke style.
const iconProps = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

function XIcon(props) {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.6 10.6 20.9 2h-2.2l-6.2 7.2L7.5 2H1l7.6 11L1 22h2.2l6.6-7.6L15.5 22H22l-8.4-11.4Zm-2.3 2.7-.8-1.1L4.1 3.5h2.5l4.9 6.8.8 1.1 6.4 8.9h-2.5l-5.2-7Z" />
    </svg>
  );
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`dg-reveal ${visible ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function EmailForm({ dark = false }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
  };

  if (sent) {
    return <p className="dg-confirm">You're on the list — thank you.</p>;
  }

  return (
    <form onSubmit={submit} className={`dg-email-form ${dark ? "on-dark" : ""}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
      />
      <button type="submit">I want to read it</button>
    </form>
  );
}

function BookCover() {
  return (
    <div className="dg-book-wrap">
      <div className="dg-book">
        <div className="dg-book-bg" />
        <div className="dg-book-face">
          <div>
            <p className="dg-book-kicker">ON BECOMING</p>
            <h3 className="dg-book-title">
              Dust <span>&amp;</span>
              <br />
              <span>Gold</span>
            </h3>
          </div>
          <div className="dg-book-dot">
            <i />
          </div>
          <div>
            <p className="dg-book-sub">
              A MEMOIR OF LOVE, LOSS,
              <br />
              HOPE AND THE HUMAN JOURNEY
            </p>
            <p className="dg-book-author">Otito Nosike</p>
          </div>
        </div>
        <div className="dg-book-edge" />
      </div>
    </div>
  );
}

function FrontCoverCard() {
  return (
    <div className="dg-cover-card">
      <img src={frontCoverImg} alt="Front cover of On Becoming: Dust & Gold" className="dg-cover-img" />
    </div>
  );
}

function BackCoverCard() {
  return (
    <div className="dg-cover-card">
      <img src={backCoverImg} alt="Back cover of On Becoming: Dust & Gold" className="dg-cover-img" />
    </div>
  );
}

function CoverCarousel() {
  const slides = [FrontCoverCard, BackCoverCard];
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    if (dragging) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, [dragging, slides.length]);

  const onDown = (clientX) => {
    startX.current = clientX;
    widthRef.current = trackRef.current ? trackRef.current.offsetWidth : 1;
    setDragging(true);
  };
  const onMove = (clientX) => {
    if (!dragging) return;
    setDragX(clientX - startX.current);
  };
  const onUp = () => {
    if (!dragging) return;
    const threshold = widthRef.current * 0.18;
    if (dragX < -threshold && index < slides.length - 1) setIndex(index + 1);
    else if (dragX > threshold && index > 0) setIndex(index - 1);
    setDragging(false);
    setDragX(0);
  };

  const offsetPercent = -index * 100;
  const dragPercent = widthRef.current ? (dragX / widthRef.current) * 100 : 0;

  return (
    <div className="dg-carousel">
      <div
        className="dg-carousel-track"
        ref={trackRef}
        style={{
          transform: `translateX(${offsetPercent + dragPercent}%)`,
          transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
        onPointerDown={(e) => onDown(e.clientX)}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onUp}
      >
        {slides.map((Slide, i) => (
          <div className="dg-carousel-slide" key={i}>
            <Slide />
          </div>
        ))}
      </div>

      <button
        className="dg-carousel-arrow prev"
        onClick={() => setIndex((i) => Math.max(0, i - 1))}
        aria-label="Previous cover"
        disabled={index === 0}
      >
        <ArrowLeft size={16} />
      </button>
      <button
        className="dg-carousel-arrow next"
        onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
        aria-label="Next cover"
        disabled={index === slides.length - 1}
      >
        <ArrowRight size={16} />
      </button>

      <div className="dg-carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dg-carousel-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function Timeline() {
  const items = [
    { n: "01", title: "First access to the book", desc: "Be the very first to read On Becoming before public release." },
    { n: "02", title: "Exclusive excerpts before publication", desc: "Chapters and passages shared only with early readers." },
    { n: "03", title: "Behind-the-scenes updates", desc: "Notes from the writing process, straight from Otito." },
    { n: "04", title: "Early access to first pre-orders", desc: "Reserve your copy before the general waitlist opens." },
  ];
  return (
    <div>
      {items.map((item, i) => (
        <Reveal key={item.n} delay={i * 0.08}>
          <div className="dg-timeline-item">
            <span className="dg-timeline-num">{item.n}</span>
            <div>
              <p className="dg-timeline-title">{item.title}</p>
              <p className="dg-timeline-desc">{item.desc}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

const NAV_LINKS = [
  { label: "The Book", href: "#book" },
  { label: "About the Author", href: "#author" },
  { label: "Join the Waitlist", href: "#waitlist" },
];

// Fixed nav overlaps the top of whatever we scroll to, so offset by its
// rendered height rather than a hardcoded number (it differs mobile vs desktop).
function scrollToSection(e, href, closeMenu) {
  e.preventDefault();
  const target = document.querySelector(href);
  if (!target) return;
  const navEl = document.querySelector(".dg-nav");
  const offset = (navEl ? navEl.offsetHeight : 0) + 12;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
  if (closeMenu) closeMenu();
}

export default function DustAndGold() {
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="dg">
      {/* NAV */}
      <nav className={`dg-nav ${navSolid ? "solid" : ""}`}>
        <span className="dg-logo">DUST &amp; GOLD</span>

        <div className="dg-nav-links">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} onClick={(e) => scrollToSection(e, href)}>
              {label}
            </a>
          ))}
        </div>

        <button
          className={`dg-burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`dg-mobile-menu ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href} onClick={(e) => scrollToSection(e, href, () => setMenuOpen(false))}>
            {label}
          </a>
        ))}
      </div>

      {/* HERO */}
      <header className="dg-hero">
        <div className={`dg-hero-copy ${heroIn ? "in" : ""}`}>
          <p className="dg-kicker">A literary memoir by Otito Nosike</p>
          <h1 className="dg-h1">
            On Becoming:
            <br />
            <em>Dust &amp; Gold</em>
          </h1>
          <p className="dg-lede">
            Somewhere between what breaks us and what we become, there is a story worth telling.
          </p>

          <div className="dg-form-card">
            <p className="label">Join the first readers</p>
            <p className="desc">
              Be among the first to know when On Becoming: Dust &amp; Gold is available, receive
              exclusive excerpts and updates from the journey, and get early access to the first
              edition.
            </p>
            <EmailForm />
            <p className="dg-microcopy">No spam. Ever. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className={`dg-hero-art ${heroIn ? "in" : ""}`}>
          <BookCover />
        </div>
      </header>

      {/* ABOUT THE BOOK */}
      <section className="dg-section" id="book">
        <div className="dg-inner dg-grid-2">
          <Reveal>
            <div className="dg-tree-box">
              <CoverCarousel />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="dg-eyebrow">About the book</p>
            <h2 className="dg-h2">On Becoming: Dust &amp; Gold</h2>
            <p className="dg-body">
              is a literary memoir about the lifelong work of becoming human in a world that often
              wounds us before we understand ourselves.
            </p>
            <p className="dg-body">
              Moving through childhood, family, love, grief, faith, betrayal, hope, and mortality,
              the book turns personal experience into larger questions about why we hurt, what we
              heal, what we inherit, and who we might become.
            </p>
            <p className="dg-quote-line">It is a journey through dust and toward gold.</p>
            <a href="#" className="dg-link">
              Read the full synopsis <ArrowRight size={13} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ABOUT AUTHOR */}
      <section className="dg-section dg-panel" id="author">
        <div className="dg-inner dg-grid-2">
          <Reveal>
            <div className="dg-portrait">
              <img src={otitoPhoto} alt="Otito Nosike" className="dg-portrait-img" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="dg-eyebrow">About Otito Nosike</p>
            <h2 className="dg-h2">
              A writer who explores philosophy, religion, and the human condition
            </h2>
            <p className="dg-body">
              Otito Nosike is a Nigerian writer whose work explores philosophy, religion,
              psychology, history, and the human condition. He is the founder of Zeiya, a writing
              agency dedicated to helping people write with more depth and authenticity, and the
              creator of The Writing Forge, an online writing mentorship programme.
            </p>
            <p className="dg-body">On Becoming: Dust &amp; Gold is his first book.</p>
            <a href="#" className="dg-link">
              Read more about the author <ArrowRight size={13} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* THREE COLUMN */}
      <section className="dg-section dg-panel">
        <div className="dg-inner dg-grid-3">
          <Reveal>
            <p className="dg-eyebrow">Join before the book arrives</p>
            <Timeline />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="dg-eyebrow">A few pages from the book</p>
            <p className="dg-mark">&ldquo;</p>
            <p className="dg-excerpt">
              To be alive and not yearn for something is to be dead. We are creatures of longing.
              Longing in the evidence that we understand, even if vaguely, that there is more than
              what we currently see and have.
            </p>
            <a href="#" className="dg-link">
              More excerpts coming soon
            </a>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="dg-card">
              <Mail size={20} color="#b8923d" />
              <p className="dg-eyebrow">Be part of the journey</p>
              <p className="dg-body">
                Join a growing community of readers who believe in stories that speak to the soul
                and questions that matter.
              </p>
              <p className="dg-quote-line">The story is becoming. Be the first to read it.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="dg-cta dg-panel" id="waitlist">
        <Reveal>
          <h2 className="dg-h2">The story is becoming. Don't miss the beginning.</h2>
          <div className="dg-cta-form-wrap">
            <EmailForm dark />
          </div>
          <p className="dg-microcopy on-dark">No spam. Ever. Unsubscribe anytime.</p>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="dg-footer dg-panel">
        <div className="dg-footer-brand">
          <p>Dust &amp; Gold</p>
          <p>© 2026 Otito Nosike. All rights reserved.</p>
        </div>
        <div className="dg-social">
          <span>Follow Otito</span>
          <a href="https://x.com/otitonosike" aria-label="X (Twitter)">
            <XIcon color="#b8923d" />
          </a>
        </div>
      </footer>
    </div>
  );
}