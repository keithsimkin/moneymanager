import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  RocketLaunchIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  KeyIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  articles: Array<{ title: string; content: string }>;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How do I add my first account?',
      answer: 'Navigate to the Accounts page from the sidebar, click "Add Account", fill in the account details (name, type, initial balance), and click "Add Account". Your account will appear in the list immediately.',
      category: 'Getting Started'
    },
    {
      question: 'Where is my data stored?',
      answer: 'All your data is stored locally in your browser using localStorage. No data is sent to any external server. This means your financial information stays completely private and secure on your device.',
      category: 'Privacy & Security'
    },
    {
      question: 'Can I use MoneyManager on multiple devices?',
      answer: 'Since data is stored locally in your browser, each device maintains its own separate data. To sync data between devices, export your data from one device (Settings > Export Data) and import it on another device.',
      category: 'Data Management'
    },
    {
      question: 'How do recurring transactions work?',
      answer: 'Recurring transactions automatically create new transactions based on a schedule (daily, weekly, monthly, or yearly). Set them up from the Transactions page by clicking "Add Recurring". The system will generate transactions on the specified dates.',
      category: 'Transactions'
    },
    {
      question: 'What\'s the difference between budgets and goals?',
      answer: 'Budgets help you control spending by setting limits for specific categories over a time period. Goals are savings targets you want to reach by a specific date. Budgets track expenses, while goals track progress toward a financial milestone.',
      category: 'Budgets & Goals'
    },
    {
      question: 'How do I backup my data?',
      answer: 'Go to Settings > Data Management and click "Export Data (JSON)". This downloads a complete backup of all your accounts, transactions, budgets, and goals. Store this file safely and use it to restore your data if needed.',
      category: 'Data Management'
    },
    {
      question: 'Can I import data from other apps?',
      answer: 'Currently, MoneyManager supports importing data from JSON backup files created by the app itself. If you have data from another app, you\'ll need to manually enter it or format it to match our JSON structure.',
      category: 'Data Management'
    },
    {
      question: 'What AI features are available?',
      answer: 'With an AI API key configured, you can chat with an AI assistant about your finances, get spending insights, receive budget recommendations, and ask questions about your financial data. Configure your API key in Settings > AI Assistant Configuration.',
      category: 'AI Features'
    },
    {
      question: 'How do I categorize transactions?',
      answer: 'When adding or editing a transaction, select a category from the dropdown menu. Categories include Housing, Transportation, Food, Entertainment, and more. Proper categorization helps with budget tracking and analytics.',
      category: 'Transactions'
    },
    {
      question: 'What keyboard shortcuts are available?',
      answer: 'Press "?" or Ctrl+/ to view all keyboard shortcuts. Common shortcuts include: Ctrl+K for quick search, N for new transaction, A for new account, B for new budget, and G for new goal.',
      category: 'Tips & Tricks'
    }
  ];

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: RocketLaunchIcon,
      description: 'Learn the basics of MoneyManager',
      articles: [
        {
          title: 'Welcome to MoneyManager',
          content: 'MoneyManager is a personal finance application that helps you track accounts, transactions, budgets, and financial goals. All data is stored locally in your browser for maximum privacy.'
        },
        {
          title: 'Setting Up Your First Account',
          content: '1. Click "Accounts" in the sidebar\n2. Click "Add Account"\n3. Enter account name, select type (Checking, Savings, Credit, Investment)\n4. Set initial balance\n5. Click "Add Account"'
        },
        {
          title: 'Adding Your First Transaction',
          content: '1. Go to "Transactions" page\n2. Click "Add Transaction"\n3. Select account, enter amount and description\n4. Choose category and date\n5. Click "Add Transaction"'
        }
      ]
    },
    {
      id: 'accounts',
      title: 'Managing Accounts',
      icon: CreditCardIcon,
      description: 'Learn about account types and management',
      articles: [
        {
          title: 'Account Types',
          content: 'MoneyManager supports four account types:\n\n• Checking: For everyday spending\n• Savings: For money you\'re setting aside\n• Credit: For credit cards (negative balances)\n• Investment: For investment accounts'
        },
        {
          title: 'Editing and Deleting Accounts',
          content: 'Click the edit icon next to any account to modify its details. To delete an account, click the delete icon. Note: Deleting an account will also remove all associated transactions.'
        }
      ]
    },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: BanknotesIcon,
      description: 'Track income and expenses',
      articles: [
        {
          title: 'Transaction Types',
          content: 'Transactions can be either Income or Expense. Income adds to your account balance, while expenses subtract from it. Select the appropriate type when creating a transaction.'
        },
        {
          title: 'Categories',
          content: 'Categorize transactions for better tracking:\n\n• Housing (rent, mortgage)\n• Transportation (gas, car payments)\n• Food (groceries, dining)\n• Entertainment\n• Healthcare\n• Shopping\n• Utilities\n• And more...'
        },
        {
          title: 'Recurring Transactions',
          content: 'Set up recurring transactions for regular income or expenses. Choose frequency (daily, weekly, monthly, yearly) and the system will automatically create transactions on schedule.'
        }
      ]
    },
    {
      id: 'budgets',
      title: 'Budgets & Goals',
      icon: ChartBarIcon,
      description: 'Plan and track your financial targets',
      articles: [
        {
          title: 'Creating Budgets',
          content: 'Budgets help control spending by category:\n\n1. Go to Budgets page\n2. Click "Add Budget"\n3. Select category and time period\n4. Set spending limit\n5. Track progress on the dashboard'
        },
        {
          title: 'Setting Financial Goals',
          content: 'Goals help you save for specific targets:\n\n1. Go to Goals page\n2. Click "Add Goal"\n3. Enter goal name and target amount\n4. Set target date\n5. Track progress and add contributions'
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Insights',
      icon: ChartBarIcon,
      description: 'Understand your financial patterns',
      articles: [
        {
          title: 'Dashboard Overview',
          content: 'The dashboard shows:\n\n• Total balance across all accounts\n• Recent transactions\n• Budget progress\n• Goal tracking\n• Quick action buttons'
        },
        {
          title: 'Analytics Page',
          content: 'View detailed charts and insights:\n\n• Spending by category\n• Income vs expenses over time\n• Balance trends\n• Budget performance\n• Monthly comparisons'
        },
        {
          title: 'Advanced Analytics',
          content: 'Access deeper insights:\n\n• Financial health score\n• Spending heatmaps\n• Anomaly detection\n• Cashflow forecasts\n• Savings opportunities\n• Category insights'
        }
      ]
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: ArrowDownTrayIcon,
      description: 'Export, import, and backup your data',
      articles: [
        {
          title: 'Exporting Data',
          content: 'Export your data in two formats:\n\n• JSON: Complete backup of all data\n• CSV: Transaction list for spreadsheets\n\nGo to Settings > Data Management to export.'
        },
        {
          title: 'Importing Data',
          content: 'Import previously exported JSON files:\n\n1. Go to Settings > Data Management\n2. Click "Import Data"\n3. Select your JSON backup file\n4. Data will be merged with existing data'
        },
        {
          title: 'Clearing Data',
          content: 'To start fresh, you can clear all data from Settings > Privacy & Storage. This action is permanent and cannot be undone. Export a backup first if you might need the data later.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      description: 'How your data is protected',
      articles: [
        {
          title: 'Local Storage',
          content: 'All your financial data is stored locally in your browser using localStorage. No data is transmitted to external servers, ensuring complete privacy and security.'
        },
        {
          title: 'AI Privacy',
          content: 'When using AI features, your API key is stored locally. API calls are made directly from your browser to the AI provider. We never see or store your API key or conversation data.'
        },
        {
          title: 'Data Portability',
          content: 'You own your data. Export it anytime in JSON or CSV format. There\'s no vendor lock-in - your data is always accessible and portable.'
        }
      ]
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      icon: KeyIcon,
      description: 'Work faster with keyboard shortcuts',
      articles: [
        {
          title: 'Essential Shortcuts',
          content: 'Press ? or Ctrl+/ to view all shortcuts:\n\n• Ctrl+K: Quick search\n• N: New transaction\n• A: New account\n• B: New budget\n• G: New goal\n• /: Focus search\n• Esc: Close dialogs'
        },
        {
          title: 'Navigation Shortcuts',
          content: 'Quickly navigate between pages:\n\n• G then D: Dashboard\n• G then A: Accounts\n• G then T: Transactions\n• G then B: Budgets\n• G then G: Goals'
        }
      ]
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.articles.some(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-muted-foreground mt-2">
          Find answers and learn how to use MoneyManager
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {!searchQuery && !selectedSection && (
        <>
          {/* Quick Links */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {helpSections.map((section) => (
              <Card
                key={section.id}
                className="cursor-pointer hover:border-blue-600 transition-colors"
                onClick={() => setSelectedSection(section.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/30">
                      <section.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QuestionMarkCircleIcon className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{faq.question}</p>
                      <p className="text-xs text-muted-foreground mt-1">{faq.category}</p>
                    </div>
                    {expandedFAQ === index ? (
                      <ChevronUpIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-gray-200 dark:border-border pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-6">
          {filteredFAQs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>FAQ Results ({filteredFAQs.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{faq.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">{faq.category}</p>
                      </div>
                      {expandedFAQ === index ? (
                        <ChevronUpIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-gray-200 dark:border-border pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {filteredSections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Help Articles ({filteredSections.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredSections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold">{section.title}</h3>
                    </div>
                    <div className="ml-6 space-y-2">
                      {section.articles.map((article, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSection(section.id)}
                          className="block text-sm text-blue-600 hover:underline"
                        >
                          {article.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {filteredFAQs.length === 0 && filteredSections.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <QuestionMarkCircleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or browse the help sections above
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Section Detail View */}
      {selectedSection && !searchQuery && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedSection(null)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back to Help Center
          </button>

          {helpSections
            .filter((s) => s.id === selectedSection)
            .map((section) => (
              <div key={section.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950/30">
                        <section.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {section.articles.map((article, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpenIcon className="h-5 w-5 text-blue-600" />
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {article.content.split('\n').map((line, lineIdx) => (
                          <p key={lineIdx} className="mb-2 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
        </div>
      )}

      {/* Contact Support */}
      {!selectedSection && (
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Additional resources and support options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border border-gray-200 dark:border-border rounded-lg">
                <KeyIcon className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-semibold mb-1">Keyboard Shortcuts</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn all available keyboard shortcuts
                </p>
                <button
                  onClick={() => window.location.href = '/keyboard-shortcuts'}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Shortcuts →
                </button>
              </div>

              <div className="p-4 border border-gray-200 dark:border-border rounded-lg">
                <Cog6ToothIcon className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-semibold mb-1">Settings</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Configure your preferences and data
                </p>
                <button
                  onClick={() => window.location.href = '/settings'}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Go to Settings →
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Tip:</strong> Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-xs">?</kbd> or <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-xs">Ctrl+/</kbd> anytime to view keyboard shortcuts
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
