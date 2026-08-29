---
name: Operational Calm
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded6ee'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f2ebff'
  surface-container-high: '#ece5fc'
  surface-container-highest: '#e6dff7'
  on-surface: '#1d192a'
  on-surface-variant: '#48454d'
  inverse-surface: '#322e40'
  inverse-on-surface: '#f5eeff'
  outline: '#79767d'
  outline-variant: '#cac5cd'
  surface-tint: '#625a77'
  primary: '#09041c'
  on-primary: '#ffffff'
  primary-container: '#221c35'
  on-primary-container: '#8b83a2'
  inverse-primary: '#cbc2e3'
  secondary: '#5d5d6a'
  on-secondary: '#ffffff'
  secondary-container: '#e0deed'
  on-secondary-container: '#62616e'
  tertiary: '#1c0002'
  on-tertiary: '#ffffff'
  tertiary-container: '#49000c'
  on-tertiary-container: '#ff3552'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e8ddff'
  primary-fixed-dim: '#cbc2e3'
  on-primary-fixed: '#1e1830'
  on-primary-fixed-variant: '#4a435e'
  secondary-fixed: '#e3e1f0'
  secondary-fixed-dim: '#c7c5d4'
  on-secondary-fixed: '#1a1b25'
  on-secondary-fixed-variant: '#464652'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#ffb3b3'
  on-tertiary-fixed: '#40000a'
  on-tertiary-fixed-variant: '#920023'
  background: '#fdf7ff'
  on-background: '#1d192a'
  surface-variant: '#e6dff7'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 64px
---

## Brand & Style

The brand identity centers on the concept of "Operational Calm," designed to act as a digital sanctuary for tattoo artists. The creative process is often intense and sensory; this design system provides an emotional counterweight—a space that feels highly organized, premium, and relieving.

The visual style is a hybrid of **Minimalism** and **Soft Creative Branding**. It borrows the structural clarity of modern productivity tools like Notion but softens the edges with a creative, editorial lens. The goal is to move away from industry clichés—no aggressive neon, no heavy black-work aesthetics, and no cyberpunk motifs. Instead, the UI emphasizes breathing room, sophisticated layering, and subtle organic shapes that reflect the flow of ink without being literal.

## Colors

The palette is anchored by **Deep Dark Purple**, which provides the structural weight and replaces traditional black for text and borders, creating a softer, more premium contrast. **Soft Lavender** serves as the primary canvas color for secondary backgrounds and container fills, establishing the "calm" atmosphere.

**Accent Red** is reserved strictly for high-priority actions, critical alerts, or "Inked" confirmation states, ensuring it retains its psychological impact without overwhelming the user. Neutral grays are tinted with cool violet undertones to ensure they feel cohesive with the purple and lavender tiers, maintaining a sophisticated readability throughout the interface.

## Typography

This design system utilizes **Manrope** for all typographic needs to maintain a modern, refined, and balanced feel. The typeface’s geometric foundations are softened by humanist details, making it ideal for both dense operational data and airy editorial headers.

The type scale is generous, prioritizing high-contrast headers and legible body copy with expanded line heights. This "editorial" approach ensures that even complex scheduling or client notes feel easy to digest. Upper-case labels with slight letter spacing are used for metadata and small UI anchors to provide clear categorization without adding visual bulk.

## Layout & Spacing

The layout follows a **Fluid Grid** system based on a 12-column structure for desktop and a single column for mobile. The rhythm is dictated by an 8px base unit, but the philosophy leans toward "intentional emptiness." Content is never cramped; margins are wide, and section gaps are significant (64px+) to prevent the user from feeling overwhelmed by tasks.

On desktop, the sidebar is persistent but minimalist, while the main content area utilizes large cards to group related information. Mobile layouts prioritize vertical stacking with increased touch targets and generous padding within cards to ensure clarity on the studio floor.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. Instead of traditional drop shadows, this system uses extra-diffused, low-opacity shadows tinted with the Deep Purple (#221C35) to create a soft, natural lift from the Lavender background.

Surfaces are categorized into three levels:
1.  **Base:** The Soft Lavender (#DCDAE9) background.
2.  **Surface:** White cards that sit directly on the base with subtle shadows.
3.  **Overlay:** Modals or floating menus with a slightly higher shadow spread and a very subtle background blur to maintain context without visual noise.

Ghost borders (1px, low-opacity purple) may be used on white cards to define edges in high-brightness environments without sacrificing the soft aesthetic.

## Shapes

The shape language is consistently **Rounded**, avoiding sharp corners to maintain the "emotionally relieving" tone. Elements like buttons and standard cards use a 0.5rem (8px) radius. Larger layout containers and primary cards use the `rounded-lg` (16px) or `rounded-xl` (24px) settings to emphasize a friendly, non-rigid structure.

Subtle experimental accents—such as organic, pebble-like abstract shapes—are used in the background or as decorative masks for imagery. These shapes should feel hand-drawn but refined, echoing the fluidity of the tattoo artist's craft.

## Components

### Buttons
Primary buttons are solid Deep Purple with white text, featuring a subtle hover lift. Secondary buttons use a lavender-tinted ghost style. The Accent Red is used exclusively for "destructive" or "urgent" actions like canceling a high-value appointment.

### Cards
Cards are the primary organizational unit. They are consistently white with rounded corners and soft ambient shadows. Internal padding should be generous (24px or 32px) to support the "breathing room" philosophy.

### Inputs
Fields should be minimal, using a light lavender background and a 1px bottom border or a very soft stroke. Focus states should transition the border to Deep Purple with a soft outer glow.

### Lists & Tables
Lists should avoid heavy dividers. Instead, use subtle background color changes on hover or generous vertical spacing to separate line items. Metadata within lists should use the `label-sm` typographic style in a muted gray-purple.

### Chips & Badges
Used for status tracking (e.g., "Deposit Paid," "Sketching," "Healed"). These feature a desaturated version of the status color with high-contrast text for maximum legibility at a glance.