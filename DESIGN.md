---
version: alpha
name: Akita
description: Design system for Akita, a collaborative design editor. Quiet zinc chrome, one persimmon accent, dense but calm editor surfaces, and type that covers Vietnamese, Chinese, Japanese and Korean.
colors:
  primary: "#C2410C"
  on-primary: "#FFFFFF"
  primary-container: "#FFF1EA"
  on-primary-container: "#9A3412"
  background: "#FAFAFA"
  on-background: "#18181B"
  surface: "#FFFFFF"
  on-surface: "#18181B"
  surface-sunken: "#F4F4F5"
  on-surface-muted: "#52525B"
  outline: "#E4E4E7"
  outline-strong: "#D4D4D8"
  error: "#B91C1C"
  on-error: "#FFFFFF"
  success: "#15803D"
  on-success: "#FFFFFF"
  warning: "#A16207"
  on-warning: "#FFFFFF"
  dark-background: "#111113"
  dark-on-background: "#FAFAFA"
  dark-surface: "#18181B"
  dark-on-surface-muted: "#A1A1AA"
  dark-outline: "#27272A"
  dark-primary: "#FB923C"
  dark-on-primary: "#1C0A03"
  presence-1: "#2563EB"
  presence-2: "#0F766E"
  presence-3: "#BE185D"
  presence-4: "#A16207"
  presence-5: "#4D7C0F"
  presence-6: "#475569"
typography:
  display:
    fontFamily: "Be Vietnam Pro, Noto Sans JP, Noto Sans SC, Noto Sans TC, Noto Sans KR, sans-serif"
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline:
    fontFamily: "Be Vietnam Pro, Noto Sans JP, Noto Sans SC, Noto Sans TC, Noto Sans KR, sans-serif"
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  title:
    fontFamily: "Be Vietnam Pro, Noto Sans JP, Noto Sans SC, Noto Sans TC, Noto Sans KR, sans-serif"
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Be Vietnam Pro, Noto Sans JP, Noto Sans SC, Noto Sans TC, Noto Sans KR, sans-serif"
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Be Vietnam Pro, Noto Sans JP, Noto Sans SC, Noto Sans TC, Noto Sans KR, sans-serif"
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "\"tnum\" 1"
rounded:
  sm: 4px
  md: 6px
  lg: 10px
  xl: 16px
  full: 9999px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "6": 24px
  "8": 32px
  "12": 48px
  "16": 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 8px 14px
    height: 36px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 8px 14px
    height: 36px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 32px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    height: 36px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  editor-toolbar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    height: 48px
    padding: 0 8px
  editor-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    width: 288px
    padding: 12px
  editor-stage:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.on-surface-muted}"
  layer-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: 32px
    padding: 0 8px
  layer-row-selected:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: 32px
  selection-handle:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 10px
  badge-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    typography: "{typography.mono}"
    rounded: "{rounded.full}"
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-success}"
    typography: "{typography.mono}"
    rounded: "{rounded.full}"
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-warning}"
    typography: "{typography.mono}"
    rounded: "{rounded.full}"
  app-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-on-background}"
  panel-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-on-surface-muted}"
  button-primary-dark:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
    rounded: "{rounded.md}"
  presence-cursor:
    backgroundColor: "{colors.presence-1}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
---

# Akita

## Overview

Akita's chrome steps back so the user's Design is the loudest thing on screen. The interface is neutral zinc with one warm persimmon accent, used only for primary actions, selection and focus.

- **Editor:** balanced density (about 6 of 10). It has thin toolbars, a 288px side panel and a sunken grey stage around the Page.
- **Public pages** (home, product, about) are rendered on the server and use more air (density about 3). They use left-aligned, asymmetric layouts, never a centred hero.
- **Motion:** restrained and functional, about 4 of 10. It confirms actions and never decorates.

## Colors

- **Persimmon** (`primary`, #C2410C) is the only accent. It is used for primary buttons, selection outlines and handles, focus rings and the active tool. White text on it passes WCAG AA (5.2:1).
- **Persimmon Wash** (`primary-container`, #FFF1EA) with **Persimmon Deep** text (#9A3412) marks selected rows and the current Page thumbnail.
- **Zinc neutrals** carry everything else:
  - background #FAFAFA
  - surfaces #FFFFFF
  - stage #F4F4F5
  - text #18181B, and #52525B for secondary text
  - borders #E4E4E7
- **Status colors** (error, success, warning) appear only in feedback: toasts, inline errors, Export status. They are never decorative.
- **Presence colors** (`presence-1` to `presence-6`) belong to collaborators. They color live cursors, Soft lock outlines and name labels. Assign them per User in order, and never use them for UI actions.
- **Dark mode** uses the `dark-*` tokens. Persimmon lightens to #FB923C with near-black text on it (8.5:1).
- **Never** use pure black, purple or neon gradients, glows, or a second accent.

## Typography

- **Be Vietnam Pro** is the UI font, because it renders Vietnamese diacritics cleanly. For CJK text, the font stack falls back to Noto Sans JP, SC, TC or KR. Set the `lang` attribute from the UI language so the browser picks the right CJK font (Han unification).
- **JetBrains Mono** with tabular figures is used for numbers in the inspector (X, Y, W, H, rotation), zoom level, timestamps and badges.
- Hierarchy comes from weight and color, not size. The editor uses `title`, `body` and `label` only. `display` and `headline` are for public pages and empty states.
- Body text lines stay at 65 characters or fewer.
- These fonts are for Akita's own interface. Fonts inside a Design come from the Font library and are unrelated to them.

## Layout

- A **4px base grid**, using the `spacing` scale. Panels use 12px padding, and 8px between controls.
- **Editor layout:** a top toolbar (48px), a left rail of tool categories, a side panel for Assets, Templates and Layers (288px), the stage in the centre, and a right inspector. On tablets the panels become drawers. On phones, the editor shows one Page at a time with a bottom toolbar.
- **Public pages:** a maximum width of 1280px, built on a CSS grid. They collapse to one column below 768px, with no horizontal scrolling.
- Tap targets are at least 44px on touch devices, even where the visual control is smaller.

## Elevation & Depth

- The chrome is flat: separation comes from 1px `outline` hairlines, not shadows.
- Shadows are used only for floating layers: menus, popovers, dialogs and the Page on the stage. Use a soft, low-contrast shadow tinted with zinc. The Page shadow is the strongest shadow in the product, so the Design reads as paper.
- Soft lock and selection outlines are 1.5px strokes, drawn outside the Element.

## Shapes

- Corners: `md` (6px) for controls, `lg` (10px) for cards and dialogs, `full` for avatars, badges and handles.
- Selection handles are 10px circles: white fill, persimmon stroke.
- Never round the Page. It shows the exact Format.

## Components

- Build on **shadcn/ui on Base UI** and map these tokens to its CSS variables: `primary` → `--primary`, `outline` → `--border`, `surface-sunken` → `--muted`, and so on.
- **Buttons:** primary uses a persimmon fill, secondary a white fill with a hairline border, ghost has no fill. When pressed, a button moves down 1px. Only one primary button per view.
- **Inputs:** the label sits above the field and errors appear below it. Focus shows a 2px persimmon ring. No floating labels.
- **Layers panel rows:** 32px tall. Selected rows use the Persimmon Wash. Hidden Elements are dimmed to 50% and grouped under a "Hidden" header. Locked Elements show a lock icon.
- **Presence:** each cursor shows a name label in the collaborator's presence color. A Soft-locked Element gets an outline in the same color and a name tag at its top-left corner.
- **Loading:** skeletons that match the final layout. Export progress uses a thin progress bar, never a spinner.
- **Empty states:** a short instruction and one action, such as "Upload an image" or "Start from a Template".

## Do's and Don'ts

- **Do** keep persimmon rare. If more than one persimmon thing on screen asks for attention, one of them is wrong.
- **Do** test every screen in Vietnamese, Japanese and Korean. CJK labels are wider, and Vietnamese diacritics need taller line height.
- **Do** keep text contrast at 4.5:1 or more in both themes.
- **Don't** use emojis, purple or neon, glows, gradient text, or custom cursors.
- **Don't** use Inter, or serif fonts in the interface.
- **Don't** use generic three-equal-card feature rows or a centred hero on public pages.
- **Don't** use AI clichés such as "Elevate", "Seamless" or "Unleash" in copy.
- **Don't** animate layout properties. Animate only `transform` and `opacity`, for 150–250ms, with an ease-out curve.
