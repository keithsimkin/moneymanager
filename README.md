<div align="center">

# 💰 MoneyManager

### Modern Personal Finance Management

A powerful, privacy-focused finance tracker built with React and TypeScript. Manage your money with beautiful analytics, smart budgeting, and seamless cloud sync.

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Rolldown-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 💳 Core Functionality
- **Account Management** - Track checking, savings, credit, and investment accounts
- **Transaction Tracking** - Record and categorize income and expenses with smart filters
- **Budget Planning** - Set spending limits by category (weekly/monthly/yearly)
- **Goal Setting** - Monitor progress toward financial goals with deadlines
- **Recurring Transactions** - Automate regular income and expenses

### 📊 Analytics & Insights
- **Advanced Analytics** - Visualize spending patterns, trends, and category breakdowns
- **Financial Health Score** - Get an overview of your financial wellness
- **Cashflow Forecasting** - Predict future balances based on trends
- **Anomaly Detection** - Identify unusual spending patterns
- **Spending Heatmaps** - See when and where you spend the most

### 🔧 User Experience
- **Cloud Sync** - Optional Supabase integration for multi-device access
- **Data Portability** - Export and import your financial data in JSON format
- **Dark Mode** - Full theme support for comfortable viewing
- **Keyboard Shortcuts** - Navigate efficiently with keyboard commands
- **Accessibility** - WCAG 2.1 AA compliant interface

## 🛠️ Tech Stack

### Frontend
- **React 19.2** with TypeScript - Modern UI library
- **Vite** (rolldown-vite) - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library
- **Recharts** - Interactive data visualizations

### Backend & Storage
- **Supabase** - Optional cloud sync and authentication
- **localStorage** - Local-first data storage

### Development
- **TypeScript 5.9** - Type safety
- **Vitest** - Fast unit testing
- **ESLint** - Code quality
- **pnpm** - Fast package manager

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd moneymanager
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Configure environment (optional):**

Copy the example environment file:
```bash
cp .env.example .env
```

For **local-only mode** (no cloud sync), leave the Supabase variables empty or remove them.

For **Supabase integration**, add your credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server:**
```bash
pnpm dev
```

5. **Open your browser** to `http://localhost:5173`

### 🔐 Supabase Setup (Optional)

MoneyManager works perfectly without Supabase using local storage. However, if you want cloud sync and multi-device access:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database migrations** from `SUPABASE_SETUP.md`

3. **Add your credentials** to `.env`:
   - Find your project URL and anon key in Supabase Dashboard → Settings → API

4. **Enable authentication** (optional):
   - Configure email/password or social providers in Supabase Dashboard → Authentication

5. **Start using cloud sync** - Your data will automatically sync across devices when logged in

> 💡 **Tip:** The app gracefully falls back to localStorage if Supabase is not configured.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | 🚀 Start development server |
| `pnpm build` | 📦 Build for production |
| `pnpm preview` | 👀 Preview production build |
| `pnpm test` | ✅ Run tests once |
| `pnpm test:watch` | 🔄 Run tests in watch mode |
| `pnpm test:ui` | 🎨 Run tests with UI |
| `pnpm lint` | 🔍 Run ESLint |

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # 🎨 Reusable UI primitives (shadcn/ui + Radix)
│   └── *.tsx        # 🧩 Feature components (charts, forms, cards)
├── contexts/        # 🌐 React Context providers (Finance, Theme, Auth)
├── hooks/           # 🪝 Custom React hooks
├── pages/           # 📄 Route page components
├── types/           # 📝 TypeScript definitions
├── utils/           # 🔧 Business logic utilities
└── lib/             # 🛠️ Helper functions (cn, etc.)
```

## 💾 Data Storage

### Local-First Architecture

By default, all financial data is stored locally in your browser using **localStorage**. This means:

- ✅ **Complete Privacy** - Your data never leaves your device
- ✅ **No Account Required** - Start using immediately
- ✅ **Offline Access** - Works without internet connection
- ✅ **Fast Performance** - Instant data access

### Optional Cloud Sync with Supabase

Enable Supabase integration to unlock:

- ☁️ **Multi-Device Sync** - Access your data from any device
- 🔐 **Secure Authentication** - Email/password or social login
- 💾 **Automatic Backups** - Your data is safely stored in the cloud
- 🔄 **Real-time Updates** - Changes sync instantly across devices

> **Privacy Note:** Even with Supabase enabled, you maintain full control. Your data is encrypted in transit and you can export/delete it anytime.

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome/Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

## 📚 Documentation

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete Supabase configuration guide
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)** - Accessibility features and compliance
- **[PERFORMANCE_OPTIMIZATIONS.md](PERFORMANCE_OPTIMIZATIONS.md)** - Performance tips
- **[ADVANCED_ANALYTICS.md](ADVANCED_ANALYTICS.md)** - Analytics features guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Heroicons](https://heroicons.com/) and [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
- Backend by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**Made with ❤️ for better financial management**

[⬆ Back to Top](#-moneymanager)

</div>
