import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

type AIProvider = 'openrouter' | 'openai' | 'anthropic' | 'google' | 'local';

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  enabled: boolean;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIContextType {
  config: AIConfig;
  updateConfig: (updates: Partial<AIConfig>) => void;
  testConnection: () => Promise<boolean>;
  sendMessage: (messages: ChatMessage[], financialContext?: string) => Promise<string>;
  isConfigured: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

const DEFAULT_CONFIG: AIConfig = {
  provider: 'openrouter',
  apiKey: '',
  model: 'openai/gpt-4o-mini',
  enabled: false,
};

// OpenRouter models available
export const OPENROUTER_MODELS = [
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'Google' },
  { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', provider: 'Google' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'Meta' },
  { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', provider: 'Meta' },
  { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral' },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', provider: 'Mistral' },
];

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export function AIProvider({ children }: AIProviderProps) {
  const [config, setConfig] = useState<AIConfig>(() => {
    const stored = localStorage.getItem('ai-config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate old configs to use openrouter as default
        if (!parsed.provider || !['openrouter', 'local'].includes(parsed.provider)) {
          parsed.provider = 'openrouter';
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('ai-config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<AIConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const isConfigured = config.enabled && config.apiKey.length > 0 && config.provider === 'openrouter';

  const testConnection = async (): Promise<boolean> => {
    if (!config.apiKey) return false;
    
    if (config.provider === 'openrouter') {
      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'cashflow.pilot',
          },
          body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 5,
          }),
        });
        return response.ok;
      } catch {
        return false;
      }
    }
    
    return false;
  };

  const sendMessage = useCallback(async (messages: ChatMessage[], financialContext?: string): Promise<string> => {
    if (!isConfigured) {
      throw new Error('AI is not configured. Please add your OpenRouter API key in Settings.');
    }

    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are a helpful financial assistant for cashflow.pilot, a personal finance management app. 
You help users understand their finances, provide insights, and answer questions about their accounts, transactions, budgets, and goals.
Be concise, friendly, and provide actionable advice when appropriate.
Format currency values nicely and use bullet points for lists.

${financialContext ? `Here is the user's current financial data:\n${financialContext}` : ''}`,
    };

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'cashflow.pilot',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [systemMessage, ...messages],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with AI service.');
    }
  }, [config.apiKey, config.model, isConfigured]);

  return (
    <AIContext.Provider value={{ config, updateConfig, testConnection, sendMessage, isConfigured }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
