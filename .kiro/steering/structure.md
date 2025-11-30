# Project Structure

## Directory Organization

```
src/
├── components/       # React components
│   ├── ui/          # shadcn/ui components (Radix UI wrappers)
│   └── *.tsx        # App-specific components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions (e.g., cn())
├── pages/           # Route page components
├── types/           # TypeScript type definitions
├── utils/           # Business logic utilities
├── assets/          # Static assets (images, etc.)
├── App.tsx          # Main app component with routing
├── main.tsx         # App entry point with providers
└── index.css        # Global styles
```

## Key Conventions

### Component Structure

- **Pages**: Top-level route components in `src/pages/`
- **Layout**: `AppLayout` wraps all pages with `Header` and `Sidebar`
- **UI Components**: Reusable primitives in `src/components/ui/`
- **Feature Components**: App-specific components in `src/components/`

### State Management

- **Context API**: Used for global state (FinanceContext, ThemeContext)
- **Provider Hierarchy**: Defined in `main.tsx` (Theme → Finance → App)
- **Custom Hooks**: Context consumers exported as hooks (e.g., `useFinance()`)

### Data Layer

- **Types**: All data models defined in `src/types/index.ts`
- **Storage**: localStorage operations in `src/utils/storage.ts`
- **Categories**: Category definitions in `src/utils/categories.ts`

### Routing

- React Router DOM with declarative routes in `App.tsx`
- Root path (`/`) redirects to `/dashboard`
- 404 handling via catch-all route

### Styling

- Tailwind utility classes for styling
- `cn()` helper from `src/lib/utils.ts` for conditional classes
- Theme support via CSS variables (light/dark mode)

### Testing

- Test files colocated with source files (`.test.ts` or `.test.tsx`)
- Test setup in `src/test/setup.ts`
- Vitest configuration in `vitest.config.ts`

### ID Generation

- Use `crypto.randomUUID()` for generating unique IDs
- Timestamps use ISO format via `new Date().toISOString()`

### TypeScript

- Strict mode enabled
- Explicit types for props and function returns
- Type imports use `import type` syntax
