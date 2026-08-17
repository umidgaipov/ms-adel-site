---
name: Soft Premium
colors:
  surface: '#fcf9f6'
  surface-dim: '#dcdad7'
  surface-bright: '#fcf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f0'
  surface-container: '#f0edea'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e5e2df'
  on-surface: '#1c1c1a'
  on-surface-variant: '#4f4440'
  inverse-surface: '#31302f'
  inverse-on-surface: '#f3f0ed'
  outline: '#81746f'
  outline-variant: '#d3c3bd'
  surface-tint: '#74584d'
  primary: '#432d23'
  on-primary: '#ffffff'
  primary-container: '#5c4338'
  on-primary-container: '#d3b1a2'
  inverse-primary: '#e2bfb0'
  secondary: '#6b5a5f'
  on-secondary: '#ffffff'
  secondary-container: '#f4dde3'
  on-secondary-container: '#716065'
  tertiary: '#393128'
  on-tertiary: '#ffffff'
  tertiary-container: '#50473e'
  on-tertiary-container: '#c2b6a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#e2bfb0'
  on-primary-fixed: '#2a170e'
  on-primary-fixed-variant: '#5a4136'
  secondary-fixed: '#f4dde3'
  secondary-fixed-dim: '#d7c1c7'
  on-secondary-fixed: '#24181c'
  on-secondary-fixed-variant: '#524348'
  tertiary-fixed: '#eee0d3'
  tertiary-fixed-dim: '#d2c4b8'
  on-tertiary-fixed: '#211a13'
  on-tertiary-fixed-variant: '#4e453c'
  background: '#fcf9f6'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2df'
  accent-hover: '#DFA8B7'
  background-warm: '#F8F5F2'
  surface-pink: '#F4DDE3'
  surface-beige: '#EADCCF'
  chocolate-text: '#5C4338'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  section-margin-desktop: 120px
  section-margin-mobile: 64px
  gutter: 24px
  container-padding: 32px
  stack-gap: 16px
---

## Brand & Style

This design system embodies the "Soft Premium" aesthetic—a curated balance between professional authority and feminine approachability. It is designed for an expert-led beauty and education platform that prioritizes calm luxury over aggressive marketing. 

The visual narrative is defined by:
- **Calm Elegance:** Avoiding high-energy triggers like vibrant neons or stark blacks in favor of a muted, organic palette.
- **Modern Minimalism:** Utilizing generous whitespace (referred to as "air") to signal high-end positioning.
- **Feminine Trust:** Combining soft, rounded geometries with grounded, professional typography.
- **Authenticity:** Focusing on real skin textures, natural lighting, and a personal connection through the "Ms. Adel" mascot integration.

The style is **Corporate / Modern** with a **Minimalist** soul, ensuring that information density is kept low to reduce cognitive load, while maintaining high-quality details in typography and spacing.

## Colors

The color strategy is "Organic Luxury," completely omitting pure black or harsh greys. 

- **Primary (Chocolate):** Used for all primary text, headings, and high-priority call-to-action fills. It provides the grounding force of the design.
- **Secondary (Powder Pink):** Used for large section blocks to break up the neutral background and add a soft, feminine touch.
- **Tertiary (Warm Beige):** Dedicated to component surfaces like cards and decorative plates to create subtle layering.
- **Neutral (Warm Off-White):** The foundational canvas. It provides a warmer, more inviting experience than standard white.
- **Accent (Muted Rose):** Reserved strictly for interactive states, hover effects, and small status indicators to provide gentle feedback without disrupting the calm.

## Typography

Typography is the primary vehicle for the "Premium" feel. The system utilizes **Plus Jakarta Sans** for expressive headlines and **Manrope** for highly legible body text.

- **High Contrast:** Hero headlines use a significantly larger scale and tighter letter spacing to create visual impact.
- **Generous Leading:** A consistent `1.6` line-height for body text ensures an airy, comfortable reading experience, preventing the "cluttered" look of budget beauty sites.
- **Hierarchy:** Use the uppercase `label-lg` sparingly for overlines or category badges to add a touch of editorial structure.
- **Mobile Adaptation:** Headlines scale down aggressively for mobile (e.g., 72px to 40px) to ensure titles remain within the viewport and legible.

## Layout & Spacing

The layout philosophy is defined by **expansive vertical rhythm** and a **fixed-width container system** that allows content to "breathe."

- **The "Air" Principle:** Large section margins (100px+) are mandatory between major content blocks. This creates a psychological sense of calm and signals that the content is curated.
- **Grid:** A 12-column grid is used for desktop with wide 24px gutters. Elements should generally occupy 4, 6, or 8 columns to avoid overly dense layouts.
- **Responsive Behavior:** 
    - **Desktop:** Center-aligned containers with wide margins.
    - **Tablet:** Margin reduction to 48px, switching to a 2-column card layout.
    - **Mobile:** Single column stack with 20px-24px side margins.
- **Safe Zones:** Always maintain a minimum of 32px padding within cards and containers to prevent text from feeling cramped against the highly rounded corners.

## Elevation & Depth

This system avoids the "tech-heavy" look of glassmorphism or deep shadows. Instead, it uses **Tonal Layers** and **Tinted Ambient Shadows**.

- **Surface Tiering:** Depth is primarily created by placing `Surface/Beige` (`#EADCCF`) or `Secondary/Pink` (`#F4DDE3`) containers onto the `Background/Warm` (`#F8F5F2`) base.
- **Shadow Character:** When shadows are necessary for interaction (e.g., a card hover or a modal), they must be extremely soft and tinted with the primary chocolate color: `0 10px 30px rgba(92, 67, 56, 0.05)`.
- **Flat Clarity:** Most elements should appear flush with the surface or only slightly raised. Never use gold foils, metallic textures, or high-contrast shadows.

## Shapes

The shape language is "Organic Geometric." High-radius corners are essential to the brand's softness.

- **Cards:** Use `rounded-xl` (24px-28px) for all content containers and service cards.
- **Buttons:** Use `rounded-lg` (16px-20px) to create a friendly, "squishy" tactile feel without becoming fully pill-shaped.
- **Inputs:** Follow the button radius for consistency.
- **Mascot Integration:** The mascot should be framed within circular or organic "blob" shapes when used as an accent, never in sharp rectangular frames.

## Components

### Buttons
- **Primary:** Background in `#5C4338`, text in `#F8F5F2`. Height: 56px-60px.
- **Secondary:** Background in `#EADCCF`, text in `#5C4338`. 
- **Hover State:** Background shifts gently toward `#DFA8B7` with a subtle increase in shadow opacity.

### Cards
- **Service Cards:** Use `Surface/Beige` or `Secondary/Pink` backgrounds. Ensure internal padding is at least 32px. Headlines should be `headline-sm`.
- **Pricing Cards:** Keep minimalist. Use the primary chocolate color for prices to ensure they are the focal point without being aggressive.

### Lists & Trust Blocks
- **Checkboxes/Radios:** Rounded style, using `#5C4338` for the active state. 
- **Review Lists:** Use soft-lit photography of clients or macro work. Text should use `body-md` with `1.6` line-height.

### Input Fields
- **Style:** Subtle outlines using a 10% opacity of the chocolate color, or no outline with a slightly darker beige background. Focus state should highlight with a 1px chocolate border.

### Mascot Accents
- Use the mascot sparsely. Place her at the end of long text sections, as a small floating bubble in the footer, or as a decorative element in the "About" section. She should always be scaled smaller than the primary headings.