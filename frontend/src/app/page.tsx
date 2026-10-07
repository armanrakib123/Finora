'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BANK_NAME } from '../constants';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroEyebrowRef = useRef<HTMLDivElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroDescRef = useRef<HTMLParagraphElement | null>(null);
  const heroActionsRef = useRef<HTMLDivElement | null>(null);
  const heroTrustRef = useRef<HTMLDivElement | null>(null);
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const rotatingWordRef = useRef<HTMLSpanElement | null>(null);
  const counter1Ref = useRef<HTMLDivElement | null>(null);
  const counter2Ref = useRef<HTMLDivElement | null>(null);
  const counter3Ref = useRef<HTMLDivElement | null>(null);
  const logosRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const testimonialsRef = useRef<HTMLElement | null>(null);
  const securityRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);

  const words = ['smarter.', 'faster.', 'secure.', 'modern.'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentYear = new Date().getFullYear();

  const partnerLogos = ['Stripe', 'Shopify', 'Notion', 'Linear', 'Vercel', 'Figma'];

  const steps = [
    {
      title: 'Create your account',
      desc: 'Sign up in minutes with your business details — no branch visit required.',
    },
    {
      title: 'Verify your identity',
      desc: 'Secure KYC verification keeps your account protected from day one.',
    },
    {
      title: 'Start banking',
      desc: 'Open accounts, transfer funds, and track everything from your dashboard.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Northstar cut our payment reconciliation time in half. The dashboard gives us clarity we never had before.',
      name: 'Sarah Chen',
      role: 'CFO, Bloom Studio',
      initials: 'SC',
      color: '#2563eb',
    },
    {
      quote:
        'Opening a business account took less than ten minutes. Transfers are instant and fees are transparent.',
      name: 'Marcus Webb',
      role: 'Founder, Trailhead Co.',
      initials: 'MW',
      color: '#7c3aed',
    },
    {
      quote:
        'Security alerts and approval workflows give our finance team real peace of mind at scale.',
      name: 'Elena Ruiz',
      role: 'VP Finance, Nova Labs',
      initials: 'ER',
      color: '#10b981',
    },
  ];

  const features = [
    {
      title: 'Business Checking & Savings',
      desc: 'Flexible accounts that help you run payroll, manage cash flow, and grow with confidence.',
      bg: 'rgba(37,99,235,0.1)',
      color: '#2563eb',
      icon: (
        <>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </>
      ),
    },
    {
      title: 'Credit & Lending Solutions',
      desc: 'Fast approvals and tailored terms to support expansion, equipment, and working capital.',
      bg: 'rgba(16,185,129,0.1)',
      color: '#10b981',
      icon: (
        <>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </>
      ),
    },
    {
      title: 'Payments & Transfers',
      desc: 'Send and receive funds instantly with speed, low fees, and full visibility across all channels.',
      bg: 'rgba(236,72,153,0.1)',
      color: '#ec4899',
      icon: (
        <>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </>
      ),
    },
    {
      title: 'Digital Tools & Insights',
      desc: 'Track budgets, forecast cash flow, and optimize spending with smart reporting dashboards.',
      bg: 'rgba(139,92,246,0.1)',
      color: '#7c3aed',
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </>
      ),
    },
    {
      title: 'Merchant & POS Services',
      desc: 'Integrated payment acceptance for in-store and online transactions with ease.',
      bg: 'rgba(245,158,11,0.1)',
      color: '#f59e0b',
      icon: (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M8 12h8" />
        </>
      ),
    },
    {
      title: 'Business Support Team',
      desc: 'Dedicated experts available 24/7 to guide your financial strategy and keep you moving.',
      bg: 'rgba(6,182,212,0.1)',
      color: '#06b6d4',
      icon: (
        <>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      ),
    },
  ];

  const securityItems = [
    'Real-time fraud detection & alerts',
    'Contextual risk signals on every payment',
    'Multi-factor & biometric authentication',
    'SOC 2 certified & GDPR compliant',
  ];

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (counter1Ref.current) counter1Ref.current.textContent = '$64,820';
      if (counter2Ref.current) counter2Ref.current.textContent = '$38,190';
      if (counter3Ref.current) counter3Ref.current.textContent = '1,284';
      if (rotatingWordRef.current) rotatingWordRef.current.textContent = words[0];
      return;
    }

    // 1. Particle Canvas Background
    const canvas = canvasRef.current;
    let running = true;
    let animId: number | null = null;
    let mouseHandler: ((e: MouseEvent) => void) | null = null;
    let resizeHandler: (() => void) | null = null;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        let mouseX = w / 2;
        let mouseY = h / 2;
        const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
        const count = Math.min(50, Math.floor((w * h) / 20000));

        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5,
          });
        }

        mouseHandler = (e: MouseEvent) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        };
        window.addEventListener('mousemove', mouseHandler);

        resizeHandler = () => {
          if (!canvas) return;
          w = canvas.width = window.innerWidth;
          h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeHandler);

        const animate = () => {
          if (!running) return;
          if (document.hidden) {
            animId = requestAnimationFrame(animate);
            return;
          }
          ctx.clearRect(0, 0, w, h);

          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
              p.x -= dx * 0.002;
              p.y -= dy * 0.002;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
            ctx.fill();
          });

          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(37, 99, 235, ${0.06 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }

          animId = requestAnimationFrame(animate);
        };
        animId = requestAnimationFrame(animate);
      }
    }

    // GSAP animations with context
    const gsapCtx = gsap.context(() => {
      // 2. Hero Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (heroEyebrowRef.current) {
        tl.fromTo(
          heroEyebrowRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        );
      }
      if (heroTitleRef.current) {
        tl.fromTo(
          heroTitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.5'
        );
      }
      if (heroDescRef.current) {
        tl.fromTo(
          heroDescRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.6'
        );
      }
      if (heroActionsRef.current) {
        tl.fromTo(
          heroActionsRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        );
      }
      if (heroTrustRef.current) {
        tl.fromTo(
          heroTrustRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        );
      }
      if (heroVisualRef.current) {
        tl.fromTo(
          heroVisualRef.current,
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out' },
          '-=1.2'
        );
      }

      // 3. Rotating Word
      const wordEl = rotatingWordRef.current;
      if (wordEl) {
        const wordTl = gsap.timeline({ repeat: -1 });
        let currentIdx = 0;
        words.forEach((_, i) => {
          if (i === 0) {
            wordTl.to(wordEl, { duration: 2.2 });
          }
          wordTl
            .to(wordEl, {
              opacity: 0,
              y: -20,
              duration: 0.35,
              ease: 'power2.in',
              onComplete: () => {
                currentIdx = (currentIdx + 1) % words.length;
                if (wordEl) wordEl.textContent = words[currentIdx];
              },
            })
            .fromTo(
              wordEl,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            )
            .to(wordEl, { duration: 2.2 });
        });
      }

      // 4. Counters Animation
      const c1 = counter1Ref.current;
      const c2 = counter2Ref.current;
      const c3 = counter3Ref.current;
      if (c1 && c2 && c3) {
        const counter1 = { val: 0 };
        gsap.to(counter1, {
          val: 64820,
          duration: 2.5,
          delay: 0.8,
          ease: 'power2.out',
          onUpdate: () => {
            if (c1) c1.textContent = '$' + Math.round(counter1.val).toLocaleString('en-US');
          },
        });

        const counter2 = { val: 0 };
        gsap.to(counter2, {
          val: 38190,
          duration: 2.5,
          delay: 1.0,
          ease: 'power2.out',
          onUpdate: () => {
            if (c2) c2.textContent = '$' + Math.round(counter2.val).toLocaleString('en-US');
          },
        });

        const counter3 = { val: 0 };
        gsap.to(counter3, {
          val: 1284,
          duration: 2.5,
          delay: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            if (c3) c3.textContent = Math.round(counter3.val).toLocaleString('en-US');
          },
        });
      }

      // 5. ScrollTrigger Animations
      if (logosRef.current) {
        const logoItems = logosRef.current.querySelectorAll('.lp-logo-item');
        if (logoItems.length > 0) {
          gsap.fromTo(
            logoItems,
            { y: 30, opacity: 0 },
            {
              scrollTrigger: { trigger: logosRef.current, start: 'top 85%' },
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.6,
              ease: 'power2.out',
            }
          );
        }
      }

      if (featuresRef.current) {
        const head = featuresRef.current.querySelector('.lp-section-head');
        if (head) {
          gsap.fromTo(
            head,
            { y: 40, opacity: 0 },
            {
              scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
            }
          );
        }
        const cards = featuresRef.current.querySelectorAll('.lp-feature-card');
        const grid = featuresRef.current.querySelector('.lp-features-grid');
        if (cards.length > 0 && grid) {
          gsap.fromTo(
            cards,
            { y: 60, opacity: 0 },
            {
              scrollTrigger: {
                trigger: grid,
                start: 'top 80%',
              },
              y: 0,
              opacity: 1,
              stagger: 0.12,
              duration: 0.8,
              ease: 'power3.out',
            }
          );
        }
      }

      if (testimonialsRef.current) {
        const head = testimonialsRef.current.querySelector('.lp-section-head');
        if (head) {
          gsap.fromTo(
            head,
            { y: 40, opacity: 0 },
            {
              scrollTrigger: { trigger: testimonialsRef.current, start: 'top 80%' },
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
            }
          );
        }
        const items = testimonialsRef.current.querySelectorAll('.lp-testimonial');
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { y: 50, opacity: 0 },
            {
              scrollTrigger: { trigger: testimonialsRef.current, start: 'top 75%' },
              y: 0,
              opacity: 1,
              stagger: 0.15,
              duration: 0.8,
              ease: 'power3.out',
            }
          );
        }
      }

      if (securityRef.current) {
        const copy = securityRef.current.querySelector('.lp-security-copy');
        const visual = securityRef.current.querySelector('.lp-security-visual');
        if (copy) {
          gsap.fromTo(
            copy,
            { x: -60, opacity: 0 },
            {
              scrollTrigger: { trigger: securityRef.current, start: 'top 75%' },
              x: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
            }
          );
        }
        if (visual) {
          gsap.fromTo(
            visual,
            { x: 60, opacity: 0 },
            {
              scrollTrigger: { trigger: securityRef.current, start: 'top 75%' },
              x: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
            }
          );
        }
        const secCards = securityRef.current.querySelectorAll('.lp-sec-card');
        if (secCards.length > 0) {
          gsap.fromTo(
            secCards,
            { y: 40, opacity: 0 },
            {
              scrollTrigger: { trigger: securityRef.current, start: 'top 60%' },
              y: 0,
              opacity: 1,
              stagger: 0.2,
              duration: 0.7,
              ease: 'power3.out',
            }
          );
        }
      }

      if (ctaRef.current) {
        const content = ctaRef.current.querySelector('.lp-cta-content');
        if (content) {
          gsap.fromTo(
            content,
            { y: 50, opacity: 0 },
            {
              scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
            }
          );
        }
      }

      ScrollTrigger.refresh();
    }, rootRef);

    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      if (mouseHandler) window.removeEventListener('mousemove', mouseHandler);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      gsapCtx.revert();
    };
  }, []);

  return (
    <div className="lp" ref={rootRef}>
      {/* Particle canvas background */}
      <canvas className="lp-particles" ref={canvasRef}></canvas>

      {/* Ambient gradient orbs */}
      <div className="lp-orbs" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* ======================== HERO ======================== */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <div className="lp-hero-eyebrow" ref={heroEyebrowRef}>
              <span className="eyebrow-pulse"></span>
              Trusted by 10,000+ businesses worldwide
            </div>
            <h1 className="lp-hero-title" ref={heroTitleRef}>
              Banking that
              <br />
              <span className="lp-hero-rotating" ref={rotatingWordRef}>
                {words[0]}
              </span>
            </h1>
            <p className="lp-hero-desc" ref={heroDescRef}>
              From startups to enterprises — manage cash flow, access credit, and grow faster with
              modern financial tools built for your business.
            </p>
            <div className="lp-hero-actions" ref={heroActionsRef}>
              <Link href="/register" className="lp-btn lp-btn-primary">
                <span>Get started free</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/login" className="lp-btn lp-btn-outline">
                Sign in
              </Link>
            </div>
            <div className="lp-hero-trust" ref={heroTrustRef}>
              <div className="trust-avatars">
                <div className="trust-av" style={{ background: '#3b82f6' }}>
                  J
                </div>
                <div className="trust-av" style={{ background: '#8b5cf6' }}>
                  S
                </div>
                <div className="trust-av" style={{ background: '#ec4899' }}>
                  M
                </div>
                <div className="trust-av" style={{ background: '#f59e0b' }}>
                  A
                </div>
              </div>
              <div className="trust-text">
                <strong>4.9/5</strong> rating from <span>2,400+</span> reviews
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="lp-hero-visual" ref={heroVisualRef}>
            <div className="mock-shell">
              <div className="mock-topbar">
                <div className="mock-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="mock-url">app.northstar.bank/dashboard</div>
              </div>
              <div className="mock-body">
                <div className="mock-sidebar">
                  <div className="mock-sb-item active"></div>
                  <div className="mock-sb-item"></div>
                  <div className="mock-sb-item"></div>
                  <div className="mock-sb-item"></div>
                </div>
                <div className="mock-content">
                  <div className="mock-header-bar">
                    <div className="mock-hb-line w60"></div>
                    <div className="mock-hb-line w30"></div>
                  </div>
                  <div className="mock-metrics">
                    <div className="mock-metric">
                      <div className="mock-metric-val" ref={counter1Ref}>
                        $0
                      </div>
                      <div className="mock-metric-label">Total Balance</div>
                      <div className="mock-metric-trend up">+12.5%</div>
                    </div>
                    <div className="mock-metric">
                      <div className="mock-metric-val" ref={counter2Ref}>
                        $0
                      </div>
                      <div className="mock-metric-label">Monthly Revenue</div>
                      <div className="mock-metric-trend up">+8.2%</div>
                    </div>
                    <div className="mock-metric">
                      <div className="mock-metric-val" ref={counter3Ref}>
                        0
                      </div>
                      <div className="mock-metric-label">Transactions</div>
                      <div className="mock-metric-trend up">+24%</div>
                    </div>
                  </div>
                  <div className="mock-chart">
                    <svg
                      className="mock-sparkline"
                      viewBox="0 0 200 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        className="spark-area"
                        d="M0 55 L20 45 L40 48 L60 30 L80 35 L100 20 L120 25 L140 15 L160 18 L180 10 L200 12 L200 60 L0 60Z"
                        fill="url(#sparkGrad)"
                      />
                      <path
                        className="spark-line"
                        d="M0 55 L20 45 L40 48 L60 30 L80 35 L100 20 L120 25 L140 15 L160 18 L180 10 L200 12"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badges around mockup */}
            <div className="mock-float mf-top">
              <div className="mf-icon mf-icon-green">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>Payment secured</span>
            </div>
            <div className="mock-float mf-right">
              <div className="mf-icon mf-icon-blue">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span>256-bit encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== LOGOS ======================== */}
      <section className="lp-logos" ref={logosRef} aria-label="Trusted partners">
        <p className="lp-logos-label">Trusted by industry leaders</p>
        <div className="lp-logos-marquee" aria-hidden="true">
          <div className="lp-logos-track">
            {partnerLogos.map((logo, idx) => (
              <div className="lp-logo-item" key={`logo-1-${idx}`}>
                <span>{logo}</span>
              </div>
            ))}
            {partnerLogos.map((logo, idx) => (
              <div className="lp-logo-item" key={`logo-2-${idx}`}>
                <span>{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== HOW IT WORKS ======================== */}
      <section className="lp-steps" aria-label="How it works">
        <div className="lp-section-head">
          <span className="lp-eyebrow">Simple onboarding</span>
          <h2 className="lp-section-title">Up and running in minutes</h2>
        </div>
        <div className="lp-steps-grid">
          {steps.map((step, i) => (
            <div className="lp-step" key={i}>
              <div className="lp-step-num">{i + 1}</div>
              <h5>{step.title}</h5>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================== FEATURES ======================== */}
      <section className="lp-features" id="features" ref={featuresRef} aria-label="Product features">
        <div className="lp-section-head">
          <span className="lp-eyebrow">Everything you need</span>
          <h2 className="lp-section-title">Built for modern businesses</h2>
          <p className="lp-section-desc">
            Powerful financial tools designed to help you manage, grow, and scale with confidence.
          </p>
        </div>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div className="lp-feature-card" key={i}>
              <div className="lp-fc-icon" style={{ background: f.bg, color: f.color }}>
                <svg
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
              </div>
              <h5>{f.title}</h5>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
      <section
        className="lp-testimonials"
        ref={testimonialsRef}
        aria-label="Customer testimonials"
      >
        <div className="lp-section-head">
          <span className="lp-eyebrow">What customers say</span>
          <h2 className="lp-section-title">Loved by growing teams</h2>
        </div>
        <div className="lp-testimonials-grid">
          {testimonials.map((t, i) => (
            <blockquote className="lp-testimonial" key={i}>
              <p>&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <div className="lp-t-avatar" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ======================== SECURITY ======================== */}
      <section className="lp-security" id="security" ref={securityRef} aria-label="Security">
        <div className="lp-security-grid">
          <div className="lp-security-copy">
            <span className="lp-eyebrow">Protect your business</span>
            <h2 className="lp-section-title">
              Enterprise-grade security, <span className="text-gradient">built for every stage.</span>
            </h2>
            <p>
              Our platform helps you detect threats early, secure transactions, and keep operations
              running smoothly with modern protection built for business banking.
            </p>
            <ul className="lp-check-list">
              {securityItems.map((item, i) => (
                <li key={i}>
                  <span className="lp-check">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/login" className="lp-btn lp-btn-outline">
              Learn about security
            </Link>
          </div>
          <div className="lp-security-visual">
            <div className="lp-sec-glow"></div>
            <div className="lp-sec-card sc-1">
              <div className="sc-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="sc-body">
                <strong>Fraud detection</strong>
                <span>AI-powered real-time monitoring</span>
              </div>
            </div>
            <div className="lp-sec-card sc-2">
              <div className="sc-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="sc-body">
                <strong>Secure approvals</strong>
                <span>Contextual risk signals</span>
              </div>
            </div>
            <div className="lp-sec-card sc-3">
              <div className="sc-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="sc-body">
                <strong>100% uptime SLA</strong>
                <span>Enterprise reliability</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="lp-cta" ref={ctaRef} aria-label="Get started">
        <div className="lp-cta-glow"></div>
        <div className="lp-cta-content">
          <h2>
            Ready to transform your
            <br />
            <span className="text-gradient">business banking?</span>
          </h2>
          <p>
            Join thousands of businesses that trust {BANK_NAME}.<br />
            No hidden fees. No surprises. Just results.
          </p>
          <Link href="/register" className="lp-btn lp-btn-primary lp-btn-lg">
            <span>Open your free account</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className="lp-footer" aria-label="Site footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">
              <span className="brand-mark">N</span>
              <strong>{BANK_NAME}</strong>
            </div>
            <p>Modern business banking for teams that move fast.</p>
          </div>
          <div className="lp-footer-col">
            <h6>Product</h6>
            <a href="#features">Features</a>
            <a href="#security">Security</a>
            <Link href="/register">Pricing</Link>
          </div>
          <div className="lp-footer-col">
            <h6>Company</h6>
            <Link href="/login">About</Link>
            <Link href="/login">Careers</Link>
            <Link href="/login">Contact</Link>
          </div>
          <div className="lp-footer-col">
            <h6>Legal</h6>
            <Link href="/login">Privacy Policy</Link>
            <Link href="/login">Terms of Service</Link>
            <Link href="/login">Compliance</Link>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>
            &copy; {currentYear} {BANK_NAME}. All rights reserved.
          </span>
          <div className="lp-footer-actions">
            <Link href="/login">Sign in</Link>
            <Link href="/register" className="lp-footer-cta">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
