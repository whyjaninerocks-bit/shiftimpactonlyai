import { NextResponse } from "next/server";
import {
  getDataPreferences,
  getSignals,
  upsertDataPreferences,
} from "@/lib/data";
import { buildDefaultConfigs, normalizeConfigs } from "@/lib/preferences";
import type { DataPreferencesPayload } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign_id");

  if (!campaignId) {
    return NextResponse.json(
      { error: "campaign_id is required" },
      { status: 400 },
    );
  }

  try {
    const [signals, preferences] = await Promise.all([
      getSignals(),
      getDataPreferences(campaignId),
    ]);
    const signal_configs = normalizeConfigs(
      signals,
      preferences?.signal_configs ?? buildDefaultConfigs(signals),
    );

    return NextResponse.json({
      preferences: preferences
        ? { ...preferences, signal_configs }
        : {
            id: null,
            campaign_id: campaignId,
            signal_configs,
            setup_notes: "",
            created_at: null,
            updated_at: null,
          },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DataPreferencesPayload;

    if (!body.campaign_id) {
      return NextResponse.json(
        { error: "campaign_id is required" },
        { status: 400 },
      );
    }

    const signals = await getSignals();
    const signal_configs = normalizeConfigs(signals, body.signal_configs);
    const preferences = await upsertDataPreferences({
      campaign_id: body.campaign_id,
      signal_configs,
      setup_notes: body.setup_notes ?? "",
    });

    return NextResponse.json({
      preferences: {
        ...preferences,
        signal_configs: normalizeConfigs(signals, preferences.signal_configs),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save data" },
      { status: 500 },
    );
  }
}
