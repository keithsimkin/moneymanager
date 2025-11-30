# MoneyManager

A modern personal finance management application built with React and TypeScript. Track your accounts, transactions, budgets, and financial goals—all stored locally in your browser.

## Features

- **Account Management** - Track checking, savings, credit, and investment accounts
- **Transaction Tracking** - Record and categorize income and expenses
- **Budget Planning** - Set spending limits by category (weekly/monthly/yearly)
- **Goal Setting** - Monitor progress toward financial goals with deadlines
- **Recurring Transactions** - Automate regular income and expenses
- **Advanced Analytics** - Visualize spending patterns, trends, and insights
- **Data Portability** - Export and import your financial data in JSON format
- **Dark Mode** - Full theme support for comfortable viewing
- **Keyboard Shortcuts** - Navigate efficiently with keyboard commands
- **Accessibility** - WCAG 2.1 AA compliant interface

## Tech Stack

- **React 19.2** with TypeScript
- **Vite** (rolldown-vite) for blazing fast builds
- **React Router DOM** for routing
- **Tailwind CSS 4.1** for styling
- **Radix UI** for accessible components
- **Recharts** for data visualization
- **Vitest** for testing

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moneymanager
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser to `http://localhost:5173`

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests once
pnpm test:watch   # Run tests in watch mode
pnpm test:ui      # Run tests with UI
pnpm lint         # Run ESLint
```

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI primitives (shadcn/ui)
│   └── *.tsx        # Feature components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Route page components
├── types/           # TypeScript definitions
├── utils/           # Business logic utilities
└── lib/             # Helper functions
```

## Data Storage

All financial data is stored locally in your browser using localStorage. No data is sent to external servers, ensuring complete privacy and control over your information.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Heroicons](https://heroicons.com/)
- Charts powered by [Recharts](https://recharts.org/)
