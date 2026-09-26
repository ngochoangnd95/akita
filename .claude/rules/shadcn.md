---
paths:
  - "apps/akita-web/**"
---

## shadcn/ui components

- Build UI with shadcn/ui components from `~/components/ui`. Do not import Base UI primitives (`@base-ui/react`) directly in app code; only the generated files in `~/components/ui` may use them.
- If a component you need is missing, add it with the shadcn CLI, run from the `apps/akita-web` workspace:

  ```bash
  cd apps/akita-web && bunx shadcn add <component>
  ```

  Don't hand-write a component that shadcn provides, and don't install components with npm, npx or pnpm.
- Customise a component by editing its generated file in `~/components/ui`, or by composing it in a feature component. Styling follows the tokens in `DESIGN.md`.
- Only when shadcn has no suitable component, build one on Base UI inside `~/components/ui` in the same style, so the rest of the app still imports from `~/components/ui`.
