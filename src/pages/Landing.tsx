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
      title: 'Multi-Account Dashboard',
      description: 'See all your checking, savings, credit cards, and investments in one unified view.',
    },
    {
      icon: BanknotesIcon,
      title: 'Smart Transaction Tracking',
      description: 'Automatically categorize expenses and income to understand where your money goes.',
    },
    {
      icon: ChartBarIcon,
      title: 'Flexible Budget Planning',
      description: 'Create custom budgets by category with weekly, monthly, or yearly tracking.',
    },
    {
      icon: ArrowTrendingUpIcon,
      title: 'Visual Analytics',
      description: 'Beautiful charts and insights reveal spending patterns and help you make better decisions.',
    },
    {
      icon: CalendarIcon,
      title: 'Recurring Transactions',
      description: 'Set up automatic entries for bills, subscriptions, and regular income.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy by Design',
      description: 'All data stored locally on your device. No servers, no tracking, no compromises.',
    },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-gray-200 dark:border-border shadow-sm">
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
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('technology')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                Technology
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
      <section id="hero" className="bg-white dark:bg-background pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Master Your Money,
              <br />
              Own Your Future
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              A powerful, privacy-first finance tracker that helps you budget smarter, save faster, and achieve your financial goals—all without leaving your device.
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
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-sm opacity-90 leading-relaxed">Privacy Guaranteed - Your Data Never Leaves</div>
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
              <div className="text-5xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">$0</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Free Forever - All Features Unlocked</div>
            </div>

            {/* Productivity Card */}
            <div className="lg:col-span-2 bg-teal-800 dark:bg-teal-900 rounded-2xl p-6 flex flex-col justify-center text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <ChartPieIcon className="h-5 w-5" />
              </div>
              <div className="text-sm leading-relaxed">Smart Insights Drive Better Decisions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="features" className="py-20 sm:py-24 bg-teal-800 dark:bg-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to
              <br />
              Take Control of Your Money
            </h2>
            <p className="text-base text-teal-100 max-w-2xl mx-auto">
              From tracking daily expenses to planning long-term goals, cashflow.pilot gives you the tools to build lasting financial wellness
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
                Why People Love
                <br />
                cashflow.pilot
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Simple enough for everyday use, powerful enough for serious financial planning. Get clarity on your money without the complexity.
              </p>
              <div className="space-y-5">
                {[
                  { title: 'Set budgets and actually stick to them', color: 'bg-emerald-500' },
                  { title: 'Spot spending patterns before they become problems', color: 'bg-orange-400' },
                  { title: 'Track progress toward your financial goals', color: 'bg-teal-600' },
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
      <section id="pricing" className="py-20 sm:py-24 bg-gray-900 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Free & Open Source
              <br />
              Forever
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              cashflow.pilot is completely free with all features unlocked. No subscriptions, no hidden costs, just powerful financial management.
            </p>
          </div>
          
          {/* Single Free Plan Card */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-teal-700 to-emerald-600 dark:from-teal-800 dark:to-emerald-700 border-2 border-emerald-400/50 rounded-3xl p-10 sm:p-12 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
              
              <div className="relative">
                <div className="flex items-center justify-center mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-400/20 text-emerald-100 text-sm font-semibold">
                    ⭐ 100% Free
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-3">Complete Access</h3>
                  <p className="text-base text-teal-50 mb-6">
                    All features included, no limitations
                  </p>
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className="text-6xl font-bold text-white">$0</span>
                    <span className="text-teal-100 text-xl">/forever</span>
                  </div>
                  <p className="text-sm text-teal-100/80">Open source & privacy-focused</p>
                </div>

                <Button 
                  onClick={handleGetStarted} 
                  className="w-full bg-white hover:bg-gray-100 text-teal-800 py-6 rounded-full mb-10 text-lg font-semibold shadow-xl"
                >
                  Start Using Now
                </Button>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    'Unlimited accounts',
                    'Advanced analytics & insights',
                    'Budget tracking & planning',
                    'Goal tracking & forecasting',
                    'Transaction categorization',
                    'Recurring transactions',
                    'Export & import data',
                    'Complete privacy (local storage)',
                    'Dark mode support',
                    'Keyboard shortcuts',
                    'No ads, ever',
                    'Open source code',
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-300 flex-shrink-0" />
                      <span className="text-sm text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/20 text-center">
                  <p className="text-teal-50 text-sm">
                    💚 Built with love for the community. No tracking, no data collection, just pure financial management.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optional: Cloud Sync Info */}
          <div className="mt-12 text-center max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              Want to sync across devices? You can optionally configure your own Supabase instance for free cloud sync.
              <br />
              <button 
                onClick={() => window.open('https://supabase.com', '_blank')}
                className="text-teal-400 hover:text-teal-300 underline mt-2 inline-block"
              >
                Learn about Supabase integration →
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="technology" className="py-20 sm:py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Built with Modern
                <br />
                Web Technology
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Lightning-fast performance, beautiful design, and rock-solid reliability. Built with the same tools used by the world's best apps.
              </p>
              <Button 
                onClick={handleGetStarted} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full text-base shadow-lg shadow-emerald-500/30"
              >
                Learn More
              </Button>
            </div>
            
            {/* Right - Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Row 1 */}
              <div className="bg-white dark:bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">React</span>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">TS</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">TypeScript</span>
              </div>

              {/* Row 2 */}
              <div className="bg-white dark:bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Tailwind</span>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-purple-500 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.257 3.955c-1.46-2.013-4.054-2.013-5.514 0L.53 17.05c-1.46 2.013-.365 4.95 1.757 4.95h16.426c2.122 0 3.217-2.937 1.757-4.95L14.257 3.955zm-2.757 14.045a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-4a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0v5z"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Vite</span>
              </div>

              {/* Row 3 */}
              <div className="bg-white dark:bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Recharts</span>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-gray-700 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Radix UI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-teal-800 dark:bg-teal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-base text-teal-50 mb-8 max-w-2xl mx-auto">
            Start tracking, budgeting, and planning today. No signup, no credit card, no strings attached.
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
