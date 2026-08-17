# Operating Rules

## Core Workflow & Skills
- **Workflow**: 1. Understand business → 2. Read main docs → 3. Understand task → 4. Select skills → 5. Plan → 6. Implement → 7. Self-review. Never skip steps.
- **Always Active Skills**: `ponytail` (clean code), `caveman` (concise communication), `i-have-adhd` (structured response).
- **Auto-Activate Skills**: Use relevant skills automatically (UI/UX, accessibility, SEO, responsive design, performance, security).
- **Uncertainty**: Use `grill-me` when business, architectural, or design decisions are ambiguous.
- **Decision Hierarchy**: 1. Business clarity → 2. User understanding → 3. Conversion → 4. Simplicity → 5. Mobile → 6. Accessibility → 7. Performance → 8. Maintainability → 9. Visual polish.

## AI Product Engineering & Code Craftsmanship
- **Minimal Diff Principle**: Modify only what is necessary; never rewrite whole files or reformat unrelated lines. Preserve Git blame.
- **Never Guess, Always Inspect**: Read existing code signatures, schemas, and types before implementation.
- **Root-Cause Fixes**: Never suppress errors with `any`, `@ts-ignore`, or `eslint-disable`. Fix root interfaces and schemas.
- **Closed-Loop Verification**: Never declare tasks complete without running typechecks (`tsc --noEmit`), linters, or build validations.
- **Schema-First (Zod / TypeScript)**: Single source of truth for DB models, APIs, and structured LLM tool outputs. No regex parsing of LLM outputs.
- **Mobile First, KISS, YAGNI, DRY**: Solve real business problems with simplest working solutions. Never invent fake data or stats.
- **Parity & Autonomy**: Keep all pages/docs in parity. Automatically run Git commands (`git add .`, `git commit`, `git push`) on task completion.

---

# Premium UI/UX & Frontend Rules (Anti-AI Slop)

The design and layout must feel handcrafted by senior product engineers (Linear, Stripe, Apple, Vercel) — never like a generic AI template.

## 1. Composition, Layout & Bento Grids
- **No Predictable Grids**: Ban generic 3x3 icon boxes and alternating chessboard columns.
- **Bento Grids**: Asymmetric layout — 1 large anchor card (2 spans with live preview) + 2 compact detail cards.
- **Breathing Room**: Generous section padding (`py-20` to `py-32` / `80px–140px`), container `max-w-6xl` or `max-w-7xl` with `px-4 sm:px-6 lg:px-8`.

## 2. Surfaces, Depth & Borders
- **Surface Tokens**: `bg-base` (canvas) → `bg-surface-1` (section) → `bg-surface-2` (elevated card) → `bg-surface-3` (popover/menu).
- **No Muddy Glassmorphism**: Avoid heavy unreadable blur. Use crisp 1px borders (`rgba(255,255,255,0.07)` dark / `rgba(0,0,0,0.06)` light).
- **Inner Depth & Shadows**: Subtle top inner highlight (`inset 0 1px 0 rgba(...)`) + multi-layer ambient/directional shadows.
- **Background Details**: Subtle dot-grid/mesh with `mask-image: radial-gradient(...)`. Low-opacity soft ambient glow (blur 100px+, opacity 0.15).

## 3. Typography & CSS Engineering
- **Modern Font Stacks**: Inter, Plus Jakarta Sans, Outfit, DM Sans, Sora, Geist.
- **Headings**: Negative tracking (`-0.02em` to `-0.04em`), tight line-height (`1.05–1.15`), `text-wrap: balance`.
- **Body & Data**: Line-height `1.55–1.65`, `text-wrap: pretty`. Tabular numbers (`tabular-nums`) for prices, dates, metrics.
- **Contrast Hierarchy**: Primary text (100%), Secondary (70%), Muted (45%).

## 4. The 5 UI States Rule (Mandatory for Every Data Component)
1. **Ideal State**: Clean rendered data with proper spacing and hierarchy.
2. **Empty State**: Clear placeholder with helpful onboarding copy and a primary action button.
3. **Loading / Skeleton**: Layout-stable skeleton shells with exact `aspect-ratio` (CLS = 0).
4. **Error / Retry**: Human-friendly error message with an explicit "Try Again" retry action.
5. **Edge / Overflow**: Handles 0 items, 10,000 items, and ultra-long text gracefully (`truncate` + tooltip).

## 5. Components, Color & Mobile Polish
- **Unified Icons**: Strictly ONE icon set (e.g. Lucide) with uniform stroke width (`1.75px–2px`) and matching sizing (`16px`/`20px`).
- **Tactile Buttons**: Subtle hover lift (`translateY(-1px)`), active click press (`scale(0.98)`), accessible focus rings (`focus-visible:ring-2`).
- **Realistic UI Only**: Never use abstract floating 3D shapes. Show realistic dashboard cards, code windows, or interactive sliders.
- **Restrained Palettes**: Ban radioactive neon-purple gradient overload. Use deep charcoal/slate, editorial warm light, or tech minimal with 1 functional accent (emerald, amber, cyan).
- **Rock-Solid Responsive**: Zero horizontal scroll (`overflow-x: clip`), mobile touch targets ≥ `44px x 44px`.

---

# AI-Native Engineering & Security Rules

Security and AI product robustness are built into every output by default.

## 1. AI-Native UX Patterns
- **Streaming First**: Stream LLM responses progressively (Server-Sent Events / ReadableStream); never freeze the UI on a 10s spinner.
- **Abortable Operations**: Support instant user cancellation on all LLM calls using `AbortController` without token/memory leaks.
- **Optimistic UI**: Update UI instantly on user action with automatic state rollback on failure.

## 2. Core Security & Access Control
- **Zero Client Trust**: Treat all external input (params, cookies, headers, uploads, LLM output) as untrusted. Validate on entry, encode on exit.
- **Access Control & IDOR**: Server-side authorization on every endpoint; derive owner from session/token. Client auth is UX only. Enable RLS on DB tables.
- **Secrets Management**: Secrets in `.env` / secret manager only; `.env` in `.gitignore`. Never in client code or repos.
- **Auth & Sessions**: Hash passwords with `bcrypt`/`argon2`. Use `httpOnly`, `secure`, `sameSite` cookies; rotate session ID on login. Verify JWT signature & `exp`. Rate-limit auth endpoints.
- **Cryptography**: Use CSPRNG (`crypto.randomBytes`, `crypto.randomUUID`). Enforce TLS & HSTS. Never invent custom crypto.

## 3. Injection, SSRF & Supply Chain Defense
- **Injection Prevention**: Parameterized DB queries only (no string concatenation). Avoid shell commands (`shell=False`, argument arrays). Sanitize and contextually encode output against XSS; enforce strict CSP. Normalize paths against path traversal.
- **Input & File Uploads**: Validate type, size, and format server-side. Bind allowed fields only. Store uploads outside web root with randomized filenames.
- **Headers & Config**: Disable debug mode in production. Set headers (`CSP`, `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `HSTS`). Strict CORS (explicit origins, no `*` with credentials). CSRF tokens for state-changing requests.
- **SSRF & Deserialization**: Allowlist outbound URLs. Block private IP ranges and cloud metadata (`169.254.169.254`). Never use `pickle.loads`, `yaml.load`, or `unserialize` on untrusted data.
- **AI Safety**: Treat LLM output as untrusted (never execute via `eval` or raw SQL). Keep provider API keys server-side only. Isolate system prompts and validate model tool arguments.

---

## Pre-Release Self-Check Checklist
- [ ] Minimal diff maintained; no unnecessary file rewrites or formatting shifts
- [ ] No generic 3x3 icon grids; Bento / asymmetric hierarchy used
- [ ] 5 UI States handled: Ideal, Empty, Loading/Skeleton, Error/Retry, Overflow
- [ ] Restrained color palette; surfaces have crisp 1px borders; headings have tight tracking and `text-wrap: balance`
- [ ] Mobile responsive: zero horizontal scroll, touch targets ≥ 44px, explicit `aspect-ratio` on media (CLS = 0)
- [ ] Zero secrets in client code; `.env` in `.gitignore`; dependencies pinned and verified
- [ ] Server-side access control (IDOR prevented, RLS on); DB queries parameterized; passwords hashed with `bcrypt`/`argon2`
- [ ] AI calls are streamable, abortable with `AbortController`, with API keys kept strictly server-side
