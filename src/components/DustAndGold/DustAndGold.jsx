import React, { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight } from "lucide-react";
import "./DustAndGold.css";
import otitoPhoto from "../../assets/otito.jpg"; // swap in your actual filename/extension

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

function BookFaceFront() {
  return (
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
  );
}

function BookFaceBack() {
  return (
    <div className="dg-book-face">
      <p className="dg-book-kicker">PRAISE FOR THE BOOK</p>
      <p className="dg-book-back-quote">
        &ldquo;A rare, unflinching meditation on what it costs to become yourself.&rdquo;
      </p>
      <div className="dg-book-dot">
        <i />
      </div>
      <p className="dg-book-sub">ON BECOMING: DUST &amp; GOLD</p>
    </div>
  );
}

function BookCover() {
  const slides = [BookFaceFront, BookFaceBack];
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef(null);
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
    widthRef.current = stageRef.current ? stageRef.current.offsetWidth : 1;
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

  // Live rotateY while dragging: a full-width drag previews a half flip,
  // then snaps to a clean 0deg/180deg face on release.
  const dragDeg = widthRef.current ? -(dragX / widthRef.current) * 180 : 0;
  const rotation = index * 180 + dragDeg;

  return (
    <div className="dg-book-wrap">
      <div className="dg-book" ref={stageRef}>
        <div
          className="dg-book-flip"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transition: dragging ? "none" : "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
          }}
          onPointerDown={(e) => onDown(e.clientX)}
          onPointerMove={(e) => onMove(e.clientX)}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onTouchStart={(e) => onDown(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onUp}
        >
          <div className="dg-book-face-pos front">
            <div className="dg-book-bg" />
            <BookFaceFront />
            <div className="dg-book-edge" />
          </div>
          <div className="dg-book-face-pos back">
            <div className="dg-book-bg" />
            <BookFaceBack />
            <div className="dg-book-edge" />
          </div>
        </div>
        <div className="dg-book-indicators">
          {slides.map((_, i) => (
            <span key={i} className={`dg-book-indicator ${i === index ? "active" : ""}`} />
          ))}
        </div>
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
              Be among the first to know when <strong>On Becoming: Dust &amp; Gold</strong> is
              available, receive
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
        <div className="dg-inner dg-single">
          <Reveal>
            <p className="dg-eyebrow">About the book</p>
            <h2 className="dg-h2">On Becoming: Dust &amp; Gold</h2>
            <p className="dg-body">
              is a literary memoir about the lifelong work of becoming human in a world that often
              wounds us before we understand ourselves.
            </p>
            <p className="dg-body">
              Moving between autobiography, philosophy, psychology, history, theology, literature,
              and cultural criticism, Otito Nosike explores the invisible forces that shape
              identity: love and abandonment, hope and disappointment, suffering and resilience,
              family, memory, faith, shame, power, and the stories we inherit long before we learn
              to question them.
            </p>
            <p className="dg-quote-line">It is a journey through dust and toward gold.</p>
            <a href="/synopsis.html" className="dg-link">
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
              Otito Nosike grew up in Lagos, Nigeria, where a lifelong fascination with literature
              first took root.
            </p>
            <p className="dg-body">
              He is the founder of <strong>Zeya</strong>, a writing startup committed to helping
              people write with greater depth and authenticity, and the creator of{" "}
              <strong>The Writing Forge</strong>, an online writing mentorship programme.
            </p>
            <p className="dg-body">
              <strong>On Becoming: Dust &amp; Gold</strong> is his first book.
            </p>
            <a href="/author.html" className="dg-link">
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
        <p>© 2026 Otito Nosike. All rights reserved.</p>
      </footer>
    </div>
  );
}