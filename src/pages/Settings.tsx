import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useAI } from '@/contexts/AIContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { exportData, exportTransactionsCSV, importData } = useFinance();
  const { config, updateConfig, testConnection } = useAI();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moneymanager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const data = exportTransactionsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string;
            importData(data, 'merge');
            alert('Data imported successfully!');
          } catch (error) {
            alert('Failed to import data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (showDeleteConfirm) {
      localStorage.clear();
      window.location.reload();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your preferences and application data
        </p>
      </div>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            AI Assistant Configuration
          </CardTitle>
          <CardDescription>
            Connect your own AI API to enhance the financial assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="ai-provider" className="text-base">AI Provider</Label>
              <select
                id="ai-provider"
                value={config.provider}
                onChange={(e) => updateConfig({ provider: e.target.value as any })}
                className="mt-2 w-full rounded-md border border-gray-200 dark:border-border bg-white dark:bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="google">Google (Gemini)</option>
                <option value="local">Local/Custom Endpoint</option>
              </select>
            </div>

            <div>
              <Label htmlFor="api-key" className="text-base">API Key</Label>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="api-key"
                    type={showApiKey ? 'text' : 'password'}
                    value={config.apiKey}
                    onChange={(e) => updateConfig({ apiKey: e.target.value })}
                    placeholder="sk-..."
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showApiKey ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  onClick={async () => {
                    setTestingConnection(true);
                    setConnectionStatus('idle');
                    const success = await testConnection();
                    setConnectionStatus(success ? 'success' : 'error');
                    setTestingConnection(false);
                    setTimeout(() => setConnectionStatus('idle'), 3000);
                  }}
                  variant="outline"
                  disabled={!config.apiKey || testingConnection}
                >
                  {testingConnection ? 'Testing...' : 'Test'}
                </Button>
              </div>
              {connectionStatus === 'success' && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="h-4 w-4" />
                  Connection successful
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <XCircleIcon className="h-4 w-4" />
                  Connection failed
                </div>
              )}
            </div>

            {config.provider === 'openai' && (
              <div>
                <Label htmlFor="model" className="text-base">Model</Label>
                <select
                  id="model"
                  value={config.model}
                  onChange={(e) => updateConfig({ model: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-200 dark:border-border bg-white dark:bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
            )}

            {config.provider === 'anthropic' && (
              <div>
                <Label htmlFor="model" className="text-base">Model</Label>
                <select
                  id="model"
                  value={config.model}
                  onChange={(e) => updateConfig({ model: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-200 dark:border-border bg-white dark:bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </select>
              </div>
            )}

            {config.provider === 'google' && (
              <div>
                <Label htmlFor="model" className="text-base">Model</Label>
                <select
                  id="model"
                  value={config.model}
                  onChange={(e) => updateConfig({ model: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-200 dark:border-border bg-white dark:bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="gemini-ultra">Gemini Ultra</option>
                </select>
              </div>
            )}

            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Note:</strong> Your API key is stored locally in your browser and never sent to our servers. 
                API calls are made directly from your browser to the AI provider.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-base">Enable AI Features</Label>
                <p className="text-sm text-muted-foreground">
                  Use AI for enhanced financial insights and chat
                </p>
              </div>
              <Button
                onClick={() => updateConfig({ enabled: !config.enabled })}
                variant={config.enabled ? "default" : "outline"}
              >
                {config.enabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how MoneyManager looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base mb-3 block">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                  theme === 'light'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30'
                    : 'border-gray-200 dark:border-border hover:border-gray-300'
                )}
              >
                <SunIcon className="h-6 w-6" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                  theme === 'dark'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30'
                    : 'border-gray-200 dark:border-border hover:border-gray-300'
                )}
              >
                <MoonIcon className="h-6 w-6" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                  theme === 'system'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30'
                    : 'border-gray-200 dark:border-border hover:border-gray-300'
                )}
              >
                <ComputerDesktopIcon className="h-6 w-6" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export, import, or clear your financial data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Export Data (JSON)</Label>
                <p className="text-sm text-muted-foreground">
                  Download all your data as a JSON file
                </p>
              </div>
              <Button onClick={handleExportJSON} variant="outline">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Export Transactions (CSV)</Label>
                <p className="text-sm text-muted-foreground">
                  Download transactions as a CSV file
                </p>
              </div>
              <Button onClick={handleExportCSV} variant="outline">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Import Data</Label>
                <p className="text-sm text-muted-foreground">
                  Import data from a JSON backup file
                </p>
              </div>
              <Button onClick={handleImport} variant="outline">
                <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Storage</CardTitle>
          <CardDescription>
            Manage your local data storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              All your data is stored locally in your browser. No data is sent to any server.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <Label className="text-base text-red-600 dark:text-red-400">Clear All Data</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete all accounts, transactions, budgets, and goals
              </p>
            </div>
            <Button 
              onClick={handleClearData} 
              variant={showDeleteConfirm ? "destructive" : "outline"}
              className={showDeleteConfirm ? "" : "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {showDeleteConfirm ? 'Click Again to Confirm' : 'Clear Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>
            Application information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Build</span>
            <span className="font-medium">2024.11</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
