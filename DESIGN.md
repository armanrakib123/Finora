---
name: Northstar Bank
description: Modern business banking platform design system
colors:
  primary: "#2563eb"
  primary-dark: "#123d8b"
  secondary: "#7c3aed"
  accent: "#14b8a6"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"
  bg: "#f4f7fb"
  surface: "#ffffff"
  surface-alt: "#f8fbff"
  text: "#10223f"
  muted: "#5f6f88"
  border: "#dfe8f5"
  dark-surface: "#0f172a"
  dark-bg: "#1e293b"
typography:
  h1:
    fontFamily: Inter, sans-serif
    fontSize: clamp(2.8rem, 4.5vw, 4.5rem)
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.03em
  h2:
    fontFamily: Inter, sans-serif
    fontSize: clamp(2rem, 3.2vw, 3rem)
    fontWeight: 800
    lineHeight: 1.1
  h3:
    fontFamily: Inter, sans-serif
    fontSize: 1.5rem
    fontWeight: 800
  h5:
    fontFamily: Inter, sans-serif
    fontSize: 1.05rem
    fontWeight: 700
  body:
    fontFamily: Inter, sans-serif
    fontSize: 1rem
    lineHeight: 1.75
  body-small:
    fontFamily: Inter, sans-serif
    fontSize: 0.92rem
    lineHeight: 1.65
  caption:
    fontFamily: Inter, sans-serif
    fontSize: 0.82rem
    fontWeight: 600
  eyebrow:
    fontFamily: Inter, sans-serif
    fontSize: 0.78rem
    fontWeight: 700
    letterSpacing: 0.16em
    textTransform: uppercase
rounded:
  sm: 8px
  md: 12px
  lg: 18px
  xl: 20px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
---

## 1. Visual Theme & Atmosphere

Modern, professional, and trustworthy fin-tech aesthetic. Clean and airy with subtle glass-morphism effects. The design communicates security and innovation through a light blue-tinted background with floating gradient orbs and a subtle particle network. Cards use semi-transparent white with backdrop blur for a frosted-glass feel. The overall density is spacious with generous whitespace, letting content breathe.

## 2. Color Palette & Roles

- **Primary Blue (#2563eb):** Main brand color for primary actions, links, and key UI accents. Also used in gradient combinations.
- **Secondary Purple (#7c3aed):** Used as a secondary gradient accent alongside Primary Blue (e.g., button gradients: `linear-gradient(135deg, #2563eb, #7c3aed)`).
- **Deep Navy Text (#0f172a):** All heading and body text for maximum readability.
- **Muted Slate (#475569 / #64748b):** Secondary text, descriptions, and metadata.
- **Light Background (#f8fbff → #eef4ff):** Page-level gradient background, cool and calming.
- **White Surface (#ffffff / rgba(255,255,255,0.85)):** Card backgrounds with backdrop blur for glass effect.
- **Success Green (#10b981):** Positive trends, checkmarks, and confirmation states.
- **Dark CTA Surface (#0f172a → #1e293b):** Dark section backgrounds (CTA, footer).
- **Feature Accents:** Blue(#2563eb), Green(#10b981), Pink(#ec4899), Purple(#7c3aed), Amber(#f59e0b), Cyan(#06b6d4) — used for feature card icon containers.

## 3. Typography Rules

- **Headings:** Inter ExtraBold (800), tight letter-spacing (-0.03em for h1). Use gradient text (blue→purple) for emphasized words.
- **Body:** Inter Regular (400) at ~1rem, comfortable line-height (1.75).
- **Eyebrow labels:** Inter Bold (700), uppercase with wide letter-spacing (0.16em), colored in Primary Blue.
- **Small/Utility text:** Inter SemiBold (600) at 0.82rem, used for labels and metadata.
- **Buttons:** Inter SemiBold (600) at 0.95rem.

## 4. Component Stylings

### Buttons
- **Primary CTA:** Fully rounded (999px), gradient background (blue→purple), white text. 12px/30px shadow in primary blue. Lifts 2px on hover with deeper shadow.
- **Outline button:** Fully rounded, white/transparent background, subtle border. Lifts 2px on hover with blue tint.
- **Large variant:** More padding (1rem 2rem), larger font.
- **Auth button (.auth-btn):** 14px border radius (not pill), 3rem height, gradient background, full-width.

### Cards & Containers
- **Feature/Step/Testimonial cards:** 20px border radius, white/semi-transparent background (`rgba(255,255,255,0.75)`), backdrop-blur(16px), soft border (`rgba(148,163,184,0.15)`). Lift 4-8px on hover with enhanced shadow.
- **Auth card (.auth-card):** 24px border radius, stronger backdrop-blur(24px), 2.5rem padding, layered shadow (spread + narrow).
- **Dashboard mockup:** 20px border radius, white/0.92 opacity, backdrop-blur(20px), deeper shadow (30px/80px).

### Inputs & Forms
- **Auth inputs:** 12px border radius, 3rem height, 0.8rem padding, left padding 2.8rem for icon. Blue focus ring.
- **Standard inputs:** 12px border radius, 0.8rem padding, blue focus border.

### Floating Badges
- White/0.95 opacity, backdrop-blur(12px), 12px border radius, 0.6rem padding, soft shadow. Used for trust signals around the mockup.

### Navigation & Footer
- **Navbar:** White/0.9 opacity with backdrop-blur(16px), subtle bottom border.
- **Footer:** Light background with top border, 3-column grid + brand column.

## 5. Layout Principles

- **Max content width:** 1280px, centered with auto margins.
- **Whitespace:** Generous padding (4rem top/bottom on hero, 5rem on sections).
- **Grid patterns:** 3-column grids for features, steps, and testimonials. 2-column for hero and security sections.
- **Responsive:** Break at 1100px (single column), 768px (stack metrics), 480px (full-width buttons).
- **Marquee:** Partner logos scroll infinitely with mask-image fade on edges.

## 6. Design System Notes for Stitch Generation

### Language to Use
- **Atmosphere:** "Modern, professional fin-tech with glass-morphism and generous whitespace"
- **Card shapes:** "Subtle 20px rounded corners with frosted glass background"
- **Buttons:** "Fully pill-shaped gradient buttons" or "14px rounded auth buttons"
- **Shadows:** "Soft layered shadows with blue tint"
- **Spacing:** "Generous breathing room between sections"

### Component Prompts
- "Create a hero section with a rotating gradient word, dashboard mockup, and floating trust badges"
- "Design a feature card with a colored icon container (52x52px, 14px radius), bold title, and concise description"
- "Add a testimonial card with circular avatar initials, quote text, and name/role footer"
- "Generate a dark CTA section with centered headline, subtext, and gradient primary button"
- "Design an auth form card with icon-prefixed input fields and a full-width gradient submit button"

### Incremental Iteration
1. Start with the full landing page prompt above
2. Refine one section at a time (e.g., "Make the feature cards more compact")
3. Reference color names with hex codes from section 2
4. Use descriptive language rather than technical CSS values where possible
