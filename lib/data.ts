import { createClient } from "@/lib/supabase/server";
import type {
  Campaign,
  DataPreferences,
  DataPreferencesPayload,
  Signal,
} from "@/lib/types";

export async function getCampaigns() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id,name,client_name,brand_name,status,created_at")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Campaign[];
}

export async function getCampaign(campaignId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id,name,client_name,brand_name,status,created_at")
    .eq("id", campaignId)
    .single();

  if (error) throw error;
  return data as Campaign;
}

export async function getSignals() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signals")
    .select(
      "id,key,name,description,proxy_source,allows_confirmed,allows_indexed,allows_proxied,sort_order",
    )
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Signal[];
}

export async function getDataPreferences(campaignId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaign_data_preferences")
    .select("id,campaign_id,signal_configs,setup_notes,created_at,updated_at")
    .eq("campaign_id", campaignId)
    .maybeSingle();

  if (error) throw error;
  return data as DataPreferences | null;
}

export async function upsertDataPreferences(payload: DataPreferencesPayload) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaign_data_preferences")
    .upsert(
      {
        campaign_id: payload.campaign_id,
        signal_configs: payload.signal_configs,
        setup_notes: payload.setup_notes ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "campaign_id" },
    )
    .select("id,campaign_id,signal_configs,setup_notes,created_at,updated_at")
    .single();

  if (error) throw error;
  return data as DataPreferences;
}
