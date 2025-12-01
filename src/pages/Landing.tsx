import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChartPieIcon,
  WalletIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const services = [
    {
      icon: WalletIcon,
      title: 'Account Management',
      description: 'Track all your accounts in one place with real-time balance updates.',
    },
    {
      icon: BanknotesIcon,
      title: 'Transaction Tracking',
      description: 'Categorize and monitor every transaction automatically.',
    },
    {
      icon: ChartBarIcon,
      title: 'Budget Planning',
      description: 'Set spending limits and stay on track with your financial goals.',
    },
    {
      icon: ArrowTrendingUpIcon,
      title: 'Financial Analytics',
      description: 'Visualize trends and insights with powerful charts and reports.',
    },
    {
      icon: CalendarIcon,
      title: 'Recurring Transactions',
      description: 'Automate regular income and expenses for better planning.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy First',
      description: 'Your data stays local - no cloud storage, complete privacy.',
    },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-background border-b border-gray-200 dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-teal-700 p-2 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                cashflow.pilot
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                Home
              </button>
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                About
              </button>
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                Services
              </button>
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                Contact
              </button>
            </nav>
            <Button
              onClick={handleGetStarted}
              className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-6 text-sm"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-background pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              The Future of Personal Finance
              <br />
              with Latest Technology
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Take control of your finances with powerful tools for budgeting, tracking, and planning. All your data stays private and secure.
            </p>
            <div className="flex gap-4 justify-center items-center mb-8">
              <Button
                onClick={handleGetStarted}
                className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 text-base rounded-full"
              >
                Get Started
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="px-8 py-3 text-base rounded-full border-gray-300 dark:border-gray-600"
              >
                Explore
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">5.0</span>
              <span className="text-gray-500 dark:text-gray-400">from 200+ reviews</span>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 max-w-6xl mx-auto">
            {/* Chart Visualization Card */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 p-6">
              <div className="w-full h-full flex items-end justify-center">
                <div className="w-full flex items-end gap-2 h-40">
                  {[65, 45, 75, 55, 85, 70, 90].map((height, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-orange-500 dark:bg-orange-600 rounded-t-lg transition-all hover:bg-orange-600" 
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Users Count Card */}
            <div className="lg:col-span-2 bg-teal-800 dark:bg-teal-900 rounded-2xl p-6 flex flex-col justify-center text-white">
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-sm opacity-90 leading-relaxed">Active Users Managing Their Finances</div>
            </div>

            {/* Transactions Stats Card */}
            <div className="lg:col-span-3 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Total Transactions <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs ml-1">+15%</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">1951+</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">
                Increase of <span className="font-semibold">12%</span> this month
              </div>
            </div>

            {/* Privacy Badge Card */}
            <div className="lg:col-span-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl p-6 flex flex-col justify-center">
              <div className="text-5xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">6+</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Core Features to Manage Your Money</div>
            </div>

            {/* Productivity Card */}
            <div className="lg:col-span-2 bg-teal-800 dark:bg-teal-900 rounded-2xl p-6 flex flex-col justify-center text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <ChartPieIcon className="h-5 w-5" />
              </div>
              <div className="text-sm leading-relaxed">Achieve Financial Goals with Smart Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 sm:py-24 bg-teal-800 dark:bg-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Efficient and Integrated
              <br />
              Financial Management
            </h2>
            <p className="text-base text-teal-100 max-w-2xl mx-auto">
              Everything you need to take control of your finances in one powerful, privacy-focused platform
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service.title} 
                className="group bg-teal-700/40 dark:bg-teal-800/40 border border-teal-600/30 rounded-2xl p-8 hover:bg-teal-700/60 dark:hover:bg-teal-800/60 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-teal-600/50 p-3 rounded-xl">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-teal-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-sm text-teal-100 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Chart Visualization */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 sm:p-10">
              <div className="mb-8">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Statistics</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">185+</div>
              </div>
              <div className="flex items-end gap-3 h-48 mb-6">
                {[40, 60, 45, 70, 55, 85, 65].map((height, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-t-lg transition-all hover:opacity-80 ${i === 5 ? 'bg-teal-600' : 'bg-orange-400'}`} 
                    style={{ height: `${height}%` }} 
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">1951+ Transactions</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">↑ 12% this month</span>
              </div>
            </div>

            {/* Benefits List */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
                Key Benefits of Our System for
                <br />
                Your Financial Efficiency
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Our comprehensive platform helps you track spending, plan budgets, and achieve your financial goals with ease.
              </p>
              <div className="space-y-5">
                {[
                  { title: 'Streamlined Budget Management', color: 'bg-emerald-500' },
                  { title: 'Optimization of Spending Patterns', color: 'bg-orange-400' },
                  { title: 'AI-Driven Financial Insights', color: 'bg-teal-600' },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${benefit.color}`} />
                    <span className="text-base font-medium text-gray-800 dark:text-gray-200">{benefit.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-24 bg-gray-900 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tailored Plans for Your
              <br />
              Financial Journey
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include complete privacy and local data storage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-gray-800 dark:bg-gray-900 border border-gray-700 rounded-3xl p-8 sm:p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-3">Basic</h3>
                <p className="text-base text-gray-400 mb-6">Essential features for personal finance tracking</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-white">$29</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <Button 
                onClick={handleGetStarted} 
                variant="outline" 
                className="w-full border-gray-600 text-white hover:bg-gray-700 py-6 rounded-full mb-8 text-base"
              >
                Get Started
              </Button>
              <div className="space-y-4">
                {[
                  'Up to 5 accounts',
                  'Basic reporting & charts',
                  'Budget tracking',
                  'Transaction categorization',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-base text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-gray-800 dark:bg-gray-900 border border-gray-700 rounded-3xl p-8 sm:p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-3">Professional</h3>
                <p className="text-base text-gray-400 mb-6">Advanced features for comprehensive financial management</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-white">$99</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <Button 
                onClick={handleGetStarted} 
                variant="outline" 
                className="w-full border-gray-600 text-white hover:bg-gray-700 py-6 rounded-full mb-8 text-base"
              >
                Get Started
              </Button>
              <div className="space-y-4">
                {[
                  'Unlimited accounts',
                  'Advanced analytics & insights',
                  'Goal tracking & forecasting',
                  'Recurring transactions',
                  'Export & import data',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-base text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enterprise CTA */}
          <div className="mt-10 bg-teal-700 dark:bg-teal-800 rounded-3xl p-8 sm:p-10 text-center max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">Professional</h3>
            <p className="text-base text-teal-50 mb-6 max-w-2xl mx-auto">
              Actually, cashflow.pilot is completely free and open source! All features are available to everyone.
            </p>
            <Button 
              onClick={handleGetStarted} 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-3 rounded-full text-base"
            >
              Start Using Free
            </Button>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 sm:py-24 bg-emerald-50 dark:bg-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
                Empowering Users
                <br />
                with Seamless Technology
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Built with modern web technologies for a fast, reliable, and privacy-focused experience. Your data never leaves your device.
              </p>
              <Button 
                onClick={handleGetStarted} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full text-base"
              >
                Learn More
              </Button>
            </div>
            
            {/* Tech Stack Visualization */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl blur-3xl opacity-50" />
              <div className="relative grid grid-cols-3 gap-4">
                {[
                  { name: 'React', color: 'bg-blue-500', icon: '⚛️' },
                  { name: 'TypeScript', color: 'bg-blue-600', icon: 'TS' },
                  { name: 'Tailwind', color: 'bg-teal-500', icon: '🎨' },
                  { name: 'Vite', color: 'bg-purple-500', icon: '⚡' },
                  { name: 'Recharts', color: 'bg-emerald-500', icon: '📊' },
                  { name: 'Radix UI', color: 'bg-gray-700', icon: '🎯' },
                ].map((tech) => (
                  <div 
                    key={tech.name} 
                    className="bg-white dark:bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-200 dark:border-border hover:shadow-lg transition-shadow"
                  >
                    <div className={`w-14 h-14 rounded-xl ${tech.color} flex items-center justify-center text-2xl`}>
                      {tech.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-teal-800 dark:bg-teal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
            From Idea to Financial Control in Minutes
          </h2>
          <p className="text-base text-teal-50 mb-8 max-w-2xl mx-auto">
            Start managing your finances today with our powerful, privacy-focused platform. No signup required.
          </p>
          <Button 
            onClick={handleGetStarted} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-3 rounded-full text-base"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-teal-700 p-2 rounded-lg">
                  <CurrencyDollarIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-base font-bold text-white">cashflow.pilot</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your privacy-focused personal finance companion. All data stays local.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Analytics', 'Budgeting', 'Goals'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                {['Documentation', 'Help Center', 'Privacy', 'Terms'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Other Links</h3>
              <ul className="space-y-3">
                {['About', 'GitHub', 'Contact', 'Blog'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2025 cashflow.pilot. Open source and free forever.
            </p>
            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
