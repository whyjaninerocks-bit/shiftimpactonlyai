export type DataMode = "confirmed" | "indexed" | "proxied";
export type IndexedDirection = "up" | "flat" | "down";

export type Campaign = {
  id: string;
  name: string;
  client_name: string | null;
  brand_name: string | null;
  status: string | null;
  created_at: string;
};

export type Signal = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  proxy_source: string | null;
  allows_confirmed: boolean | null;
  allows_indexed: boolean | null;
  allows_proxied: boolean | null;
  sort_order: number | null;
};

export type SignalConfig = {
  mode: DataMode;
  direction: IndexedDirection | null;
  pct: number | null;
  sourceUrl?: string | null;
};

export type SignalConfigs = Record<string, SignalConfig>;

export type DataPreferences = {
  id: string;
  campaign_id: string;
  signal_configs: SignalConfigs;
  setup_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DataPreferencesPayload = {
  campaign_id: string;
  signal_configs: SignalConfigs;
  setup_notes?: string | null;
};
