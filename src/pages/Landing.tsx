import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckCircleIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: BanknotesIcon,
      title: 'Multi-Account Support',
      description: 'Manage checking, savings, credit cards, and investments seamlessly.',
    },
    {
      icon: ChartBarIcon,
      title: 'Smart Budgeting',
      description: 'Create flexible budgets and get real-time insights on your spending.',
    },
    {
      icon: TrophyIcon,
      title: 'Goal Tracking',
      description: 'Set financial goals and watch your progress with visual milestones.',
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and anomaly detection.',
    },
    {
      icon: ArrowTrendingUpIcon,
      title: 'Advanced Analytics',
      description: 'Beautiful charts and heatmaps to understand your financial patterns.',
    },
    {
      icon: ShieldCheckIcon,
      title: '100% Private',
      description: 'Your data never leaves your device. No servers, no tracking.',
    },
  ];

  const benefits = [
    'No subscription fees - completely free',
    'Works offline - no internet required',
    'Export your data anytime',
    'Dark mode support',
    'Keyboard shortcuts for power users',
    'Open source and transparent',
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
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                MoneyManager
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {user ? 'Dashboard' : 'Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 sm:mb-8">
              <CodeBracketIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                Open Source & Free Forever
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-4">
              Your Money,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Control
              </span>
            </h1>
            
            <p className="text-base sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 leading-relaxed px-4">
              A beautiful, privacy-focused personal finance app that helps you track expenses,
              manage budgets, and achieve your financial goals—all without compromising your data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 h-auto shadow-lg hover:shadow-xl transition-all"
              >
                Start Managing Money
                <ArrowTrendingUpIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 h-auto border-2"
              >
                Sign In
              </Button>
            </div>
            
            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-500 px-4">
              No credit card required • No data collection • No hidden fees
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed to simplify your financial life
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-8 bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 p-3 rounded-xl w-fit mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Why Choose MoneyManager?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                Built with privacy and simplicity in mind. Your financial data stays on your device,
                giving you complete control and peace of mind.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Total Balance</div>
                      <div className="text-4xl font-bold">$24,580.00</div>
                    </div>
                    <ArrowTrendingUpIcon className="h-12 w-12 opacity-50" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Income</div>
                      <div className="text-2xl font-semibold">$8,420</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Expenses</div>
                      <div className="text-2xl font-semibold">$3,280</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm opacity-80">Budget Progress</span>
                      <span className="text-sm font-semibold">68%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-10">
            Join thousands managing their finances smarter. Start your journey today.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 h-auto shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
          >
            Get Started for Free
          </Button>
          <p className="mt-4 sm:mt-6 text-blue-100 text-xs sm:text-sm">
            Open source • Privacy-focused • No signup required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">MoneyManager</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; 2025 MoneyManager. Open source and free forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
