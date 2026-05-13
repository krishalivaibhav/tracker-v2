import { useEffect, useRef, useState } from 'react';

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Push yourself, because no one else is going to do it for you.", author: null },
  { text: "Great things never come from comfort zones.", author: null },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: null },
  { text: "Dream it. Wish it. Do it.", author: null },
  { text: "Your only limit is your mind.", author: null },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
];

const GOOGLE_SVG = (
  <svg viewBox="0 0 48 48" width="16" height="16" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function LandingPage({ user, onEnterApp }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [quoteVisible, setQuoteVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const N = Math.min(90, Math.floor(W * H / 12000));
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.8 + .6,
    }));
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,.7)'; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${.18 * (1 - d/130)})`; ctx.lineWidth = .6; ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    frame();
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIdx(i => (i + 1) % QUOTES.length);
        setQuoteVisible(true);
      }, 350);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const q = QUOTES[quoteIdx];

  return (
    <div className="landing-page" style={{ display: 'flex' }}>
      <canvas ref={canvasRef} className="landing-canvas" />
      <div className="landing-blob landing-blob-1" />
      <div className="landing-blob landing-blob-2" />
      <div className="landing-blob landing-blob-3" />

      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <div className="landing-nav-mark" style={{ fontSize: '13px' }}>T+</div>
          <span className="landing-nav-name">Track+</span>
        </div>
        {!user && (
          <a href="/api/auth/login" className="landing-google-btn">
            {GOOGLE_SVG} Sign in
          </a>
        )}
      </nav>

      <div className="landing-hero">
        <div className="landing-eyebrow">Track+</div>
        <h1 className="landing-headline">
          Master DSA.<br />
          <span className="landing-headline-grad">Land Your Dream Job.</span>
        </h1>
        <p className="landing-sub">Track every problem, every application, every opportunity — all in one place, powered by AI.</p>

        <div className="landing-quote-wrap">
          <div className="landing-quote-mark">"</div>
          <div>
            <div className="landing-quote-text" style={{ opacity: quoteVisible ? 1 : 0, transition: 'opacity .35s ease' }}>{q.text}</div>
            <div className="landing-quote-author">{q.author ? `— ${q.author}` : ''}</div>
          </div>
        </div>

        <div className="landing-features-row">
          <span className="landing-feat-chip">📊 DSA Sheet</span>
          <span className="landing-feat-chip">🤖 AI Resume Scanner</span>
          <span className="landing-feat-chip">💼 Job Tracker</span>
          <span className="landing-feat-chip">📈 CGPA Planner</span>
          <span className="landing-feat-chip">⚡ Groq AI</span>
        </div>

        {user ? (
          <button className="landing-enter-btn" onClick={onEnterApp} style={{ display: 'inline-flex' }}>
            Enter App, {user.name.split(' ')[0]} →
          </button>
        ) : (
          <a href="/api/auth/login" className="landing-cta">
            <svg viewBox="0 0 48 48" width="18" height="18" style={{ flexShrink: 0 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </a>
        )}
      </div>
    </div>
  );
}
