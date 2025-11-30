# Tech Stack

## Core Technologies

- **React 19.2** with TypeScript
- **Vite** (rolldown-vite variant) for build tooling
- **React Router DOM** for client-side routing
- **pnpm** as package manager

## UI Framework

- **Tailwind CSS 4.1** for styling
- **Radix UI** for accessible component primitives
- **shadcn/ui** component patterns (customized in `src/components/ui/`)
- **Lucide React** for icons
- **Recharts** for data visualization

## Utilities

- **date-fns** for date manipulation
- **clsx** + **tailwind-merge** for className management (via `cn()` utility)
- **class-variance-authority** for component variants

## Testing

- **Vitest** as test runner
- **Testing Library** (React + Jest DOM) for component testing
- **jsdom** for DOM simulation
- **fast-check** for property-based testing

## Code Quality

- **ESLint** with TypeScript support
- **TypeScript 5.9** with strict mode

## Common Commands

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Type check + build for production
pnpm preview          # Preview production build

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Run tests with UI

# Linting
pnpm lint             # Run ESLint
```

## Path Aliases

The project uses `@/` as an alias for `./src/` in imports.
