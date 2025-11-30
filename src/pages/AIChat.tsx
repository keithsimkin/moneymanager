import { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon as Send,
  CpuChipIcon as Bot,
  UserIcon as User,
  ArrowPathIcon as Loader2
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: "Hi! I'm your financial assistant. I can help you analyze your spending, budgets, goals, and transactions. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { accounts, transactions, budgets, goals } = useFinance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Calculate financial metrics
    const totalBalance = accounts.reduce((sum, acc) => {
      const accountTransactions = transactions.filter(t => t.accountId === acc.id);
      const balance = acc.initialBalance + accountTransactions.reduce((s, t) => s + t.amount, 0);
      return sum + balance;
    }, 0);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Spending by category
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)[0];

    // Budget analysis
    const activeBudgets = budgets.length;
    const budgetStatus = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { category: budget.category, spent, limit: budget.amount, percentage: (spent / budget.amount) * 100 };
    });

    // Goals analysis
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const achievedGoals = goals.filter(g => g.status === 'achieved').length;

    // Response generation based on query
    if (lowerMessage.includes('balance') || lowerMessage.includes('total')) {
      return `Your total balance across all accounts is $${totalBalance.toFixed(2)}. You have ${accounts.length} account(s) set up.`;
    }

    if (lowerMessage.includes('spending') || lowerMessage.includes('spend') || lowerMessage.includes('expense')) {
      if (topCategory) {
        return `Your total expenses are $${totalExpenses.toFixed(2)}. Your highest spending category is "${topCategory[0]}" with $${topCategory[1].toFixed(2)} spent.`;
      }
      return `Your total expenses are $${totalExpenses.toFixed(2)}.`;
    }

    if (lowerMessage.includes('income')) {
      return `Your total income is $${totalIncome.toFixed(2)} from ${transactions.filter(t => t.type === 'income').length} transaction(s).`;
    }

    if (lowerMessage.includes('budget')) {
      if (activeBudgets === 0) {
        return "You don't have any budgets set up yet. Would you like to create one?";
      }
      const overBudget = budgetStatus.filter(b => b.percentage > 100);
      if (overBudget.length > 0) {
        return `You have ${activeBudgets} budget(s). Warning: You're over budget in ${overBudget.length} categor${overBudget.length === 1 ? 'y' : 'ies'}: ${overBudget.map(b => b.category).join(', ')}.`;
      }
      return `You have ${activeBudgets} budget(s) and you're staying within your limits. Great job!`;
    }

    if (lowerMessage.includes('goal')) {
      if (goals.length === 0) {
        return "You don't have any financial goals set up yet. Setting goals can help you stay motivated!";
      }
      return `You have ${activeGoals} active goal(s) and ${achievedGoals} achieved goal(s). Keep up the good work!`;
    }

    if (lowerMessage.includes('category') || lowerMessage.includes('categories')) {
      const categories = Object.entries(categorySpending)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
      if (categories.length === 0) {
        return "You don't have any expense transactions yet.";
      }
      return `Your top spending categories are:\n${categories.map(([cat, amt], i) => `${i + 1}. ${cat}: $${amt.toFixed(2)}`).join('\n')}`;
    }

    if (lowerMessage.includes('account')) {
      return `You have ${accounts.length} account(s): ${accounts.map(a => `${a.name} (${a.type})`).join(', ')}.`;
    }

    if (lowerMessage.includes('transaction')) {
      return `You have ${transactions.length} transaction(s) recorded. ${transactions.filter(t => t.type === 'income').length} income and ${transactions.filter(t => t.type === 'expense').length} expense transactions.`;
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
      return `Financial Summary:\n• Total Balance: $${totalBalance.toFixed(2)}\n• Total Income: $${totalIncome.toFixed(2)}\n• Total Expenses: $${totalExpenses.toFixed(2)}\n• Net: $${(totalIncome - totalExpenses).toFixed(2)}\n• Accounts: ${accounts.length}\n• Budgets: ${activeBudgets}\n• Active Goals: ${activeGoals}`;
    }

    // Default response
    return "I can help you with information about your balance, spending, income, budgets, goals, accounts, transactions, or give you a financial summary. What would you like to know?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Financial Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Ask questions about your finances and get instant insights
        </p>
      </div>

      <Card className="flex flex-col h-[calc(100vh-16rem)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  'rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your finances..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
