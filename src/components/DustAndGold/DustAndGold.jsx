import React, { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight } from "lucide-react";
import "./DustAndGold.css";

// lucide-react dropped brand/social icons in v1, so these three are
// small inline SVGs instead — same 24x24 grid, same stroke style.
const iconProps = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

function TwitterIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M22 4.01c-.9.4-1.8.7-2.8.9 1-.6 1.8-1.6 2.2-2.8-1 .6-2 1-3.1 1.2A4.4 4.4 0 0 0 11.5 7c0 .3 0 .7.1 1A12.5 12.5 0 0 1 2.5 3.3a4.4 4.4 0 0 0 1.4 5.9c-.8 0-1.5-.2-2.1-.6v.1c0 2.1 1.5 3.9 3.5 4.3-.6.2-1.3.2-1.9.1.5 1.7 2.1 3 4 3A8.8 8.8 0 0 1 1 19.5 12.4 12.4 0 0 0 7.9 21.5c8.4 0 13-7 13-13v-.6c.9-.6 1.6-1.4 2.2-2.3Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.4a4 4 0 1 1-7.9-1.1 4 4 0 0 1 7.9 1.1Z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.1L18 11h-4V7a1 1 0 0 1 1-1h3Z" />
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

function TreeIllustration() {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="skyGrad" cx="30%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#e8d3a3" />
          <stop offset="55%" stopColor="#b89968" />
          <stop offset="100%" stopColor="#6b5638" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill="url(#skyGrad)" />
      <ellipse cx="200" cy="235" rx="180" ry="18" fill="#4a3a24" opacity="0.35" />
      <g opacity="0.92">
        <path
          d="M200 230 C196 190 198 160 195 140 C170 130 150 100 155 80 C160 95 175 108 193 118 C188 90 178 60 190 30 C195 60 200 90 205 118 C222 108 238 92 244 74 C248 96 228 128 202 138 C200 160 202 190 204 230 Z"
          fill="#1c140c"
        />
        <path d="M195 140 C175 148 150 148 130 132 C140 152 165 162 193 156 Z" fill="#1c140c" />
        <path d="M204 138 C226 148 252 144 268 126 C260 148 234 162 205 156 Z" fill="#1c140c" />
      </g>
    </svg>
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

const NAV_LINKS = ["The Book", "About the Author", "Join the Waitlist"];

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
          {NAV_LINKS.map((l) => (
            <a key={l} href="#">
              {l}
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
        {NAV_LINKS.map((l) => (
          <a key={l} href="#" onClick={() => setMenuOpen(false)}>
            {l}
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
      <section className="dg-section">
        <div className="dg-inner dg-grid-2">
          <Reveal>
            <div className="dg-tree-box">
              <TreeIllustration />
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
      <section className="dg-section dg-panel">
        <div className="dg-inner dg-grid-2">
          <Reveal>
            <div className="dg-portrait">
              <div className="dg-portrait-fade" />
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
      <section className="dg-cta dg-panel">
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
          {[TwitterIcon, InstagramIcon, FacebookIcon].map((Icon, i) => (
            <a key={i} href="#" aria-label="Social link">
              <Icon color="#b8923d" />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}