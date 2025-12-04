import { supabase } from '@/lib/supabase';
import type { Account, Transaction, Budget, Goal, RecurringPattern } from '@/types';

export interface SyncConfig {
  enabled: boolean;
  lastSyncAt: string | null;
}

export interface SyncData {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurringPatterns: RecurringPattern[];
  syncedAt: string;
}

const SYNC_CONFIG_KEY = 'cashflow_sync_config';
const SYNC_TABLE = 'user_finance_data';

export function getSyncConfig(): SyncConfig {
  try {
    const stored = localStorage.getItem(SYNC_CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { enabled: false, lastSyncAt: null };
}

export function saveSyncConfig(config: SyncConfig): void {
  localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
}

export async function checkSupabaseConnection(): Promise<{ connected: boolean; userId?: string; error?: string }> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      return { connected: false, error: error.message };
    }
    if (!user) {
      return { connected: false, error: 'Not authenticated. Please sign in first.' };
    }
    return { connected: true, userId: user.id };
  } catch (err) {
    return { connected: false, error: err instanceof Error ? err.message : 'Connection failed' };
  }
}

export async function uploadToSupabase(data: Omit<SyncData, 'syncedAt'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated. Please sign in first.' };
    }

    const syncData: SyncData = {
      ...data,
      syncedAt: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(SYNC_TABLE)
      .upsert({
        user_id: user.id,
        data: syncData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      return { success: false, error: error.message };
    }

    saveSyncConfig({ enabled: true, lastSyncAt: syncData.syncedAt });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}

export async function downloadFromSupabase(): Promise<{ success: boolean; data?: SyncData; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated. Please sign in first.' };
    }

    const { data, error } = await supabase
      .from(SYNC_TABLE)
      .select('data')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'No cloud data found. Upload your data first.' };
      }
      return { success: false, error: error.message };
    }

    if (!data?.data) {
      return { success: false, error: 'No data found in cloud storage.' };
    }

    return { success: true, data: data.data as SyncData };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Download failed' };
  }
}
