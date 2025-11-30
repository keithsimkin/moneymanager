import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type AIProvider = 'openai' | 'anthropic' | 'google' | 'local';

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  enabled: boolean;
}

interface AIContextType {
  config: AIConfig;
  updateConfig: (updates: Partial<AIConfig>) => void;
  testConnection: () => Promise<boolean>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

const DEFAULT_CONFIG: AIConfig = {
  provider: 'openai',
  apiKey: '',
  model: 'gpt-4',
  enabled: false,
};

export function AIProvider({ children }: AIProviderProps) {
  const [config, setConfig] = useState<AIConfig>(() => {
    const stored = localStorage.getItem('ai-config');
    if (stored) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
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

  const testConnection = async (): Promise<boolean> => {
    if (!config.apiKey) return false;
    
    // This is a placeholder - implement actual API testing based on provider
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  return (
    <AIContext.Provider value={{ config, updateConfig, testConnection }}>
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
