"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adjustedScore,
  confidenceMultiplier,
  normalizeConfigs,
} from "@/lib/preferences";
import { directionLabels, modeBadge, modeLabels } from "@/lib/labels";
import type {
  DataMode,
  IndexedDirection,
  Signal,
  SignalConfig,
  SignalConfigs,
} from "@/lib/types";

type PreferencesResponse = {
  preferences: {
    signal_configs: SignalConfigs;
    setup_notes: string | null;
  };
};

const dataModes: DataMode[] = ["confirmed", "indexed", "proxied"];

type Props = {
  campaignId: string;
  signals: Signal[];
};

export function DataSourceSetupSection({ campaignId, signals }: Props) {
  const [configs, setConfigs] = useState<SignalConfigs>(() =>
    normalizeConfigs(signals),
  );
  const [setupNotes, setSetupNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sortLowestFirst, setSortLowestFirst] = useState(false);

  async function loadPreferences() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/data-preferences?campaign_id=${campaignId}`,
        { cache: "no-store" },
      );
      const json = (await response.json()) as PreferencesResponse & {
        error?: string;
      };

      if (!response.ok) throw new Error(json.error ?? "Unable to load");

      setConfigs(normalizeConfigs(signals, json.preferences.signal_configs));
      setSetupNotes(json.preferences.setup_notes ?? "");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Preferences could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const displayedSignals = useMemo(() => {
    const ordered = [...signals];
    if (!sortLowestFirst) return ordered;

    return ordered.sort((a, b) => {
      const aMode = configs[a.key]?.mode ?? "proxied";
      const bMode = configs[b.key]?.mode ?? "proxied";
      return confidenceMultiplier(aMode) - confidenceMultiplier(bMode);
    });
  }, [configs, signals, sortLowestFirst]);

  const aggregateConfidence = useMemo(() => {
    if (!signals.length) return 0;
    const total = signals.reduce((sum, signal) => {
      return sum + confidenceMultiplier(configs[signal.key]?.mode ?? "proxied");
    }, 0);
    return total / signals.length;
  }, [configs, signals]);

  function updateSignal(signal: Signal, nextConfig: Partial<SignalConfig>) {
    if (
      typeof nextConfig.pct === "number" &&
      (nextConfig.pct < 0 || nextConfig.pct > 100)
    ) {
      setError("Approximate % must be between 0 and 100.");
    } else {
      setError("");
    }

    setConfigs((current) =>
      normalizeConfigs(signals, {
        ...current,
        [signal.key]: {
          ...current[signal.key],
          ...nextConfig,
        },
      }),
    );
    setMessage("");
  }

  async function savePreferences() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/data-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: campaignId,
          signal_configs: configs,
          setup_notes: setupNotes,
        }),
      });
      const json = (await response.json()) as PreferencesResponse & {
        error?: string;
      };

      if (!response.ok) throw new Error(json.error ?? "Unable to save");

      setConfigs(normalizeConfigs(signals, json.preferences.signal_configs));
      setSetupNotes(json.preferences.setup_notes ?? "");
      setMessage("Preferences saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Preferences could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  function exportPreferences() {
    const payload = {
      campaign_id: campaignId,
      aggregate_confidence: Number(aggregateConfidence.toFixed(2)),
      setup_notes: setupNotes,
      signal_configs: configs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `data-preferences-${campaignId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <section className="section">
        <SectionHeader
          aggregateConfidence={aggregateConfidence}
          sortLowestFirst={sortLowestFirst}
          setSortLowestFirst={setSortLowestFirst}
          exportPreferences={exportPreferences}
        />
        <div className="signal-list">
          {signals.map((signal) => (
            <div className="signal-row skeleton" key={signal.key}>
              <div />
              <div />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error && !Object.keys(configs).length) {
    return (
      <section className="section">
        <SectionHeader
          aggregateConfidence={aggregateConfidence}
          sortLowestFirst={sortLowestFirst}
          setSortLowestFirst={setSortLowestFirst}
          exportPreferences={exportPreferences}
        />
        <div className="notice error">
          <span>{error}</span>
          <button onClick={loadPreferences} type="button">
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <SectionHeader
        aggregateConfidence={aggregateConfidence}
        sortLowestFirst={sortLowestFirst}
        setSortLowestFirst={setSortLowestFirst}
        exportPreferences={exportPreferences}
      />

      <div className="signal-list">
        {displayedSignals.map((signal) => {
          const config = configs[signal.key];
          return (
            <SignalRow
              config={config}
              key={signal.key}
              signal={signal}
              updateSignal={updateSignal}
            />
          );
        })}
      </div>

      <label className="notes-field">
        <span>Setup notes</span>
        <textarea
          onChange={(event) => setSetupNotes(event.target.value)}
          placeholder="Client constraints, assumptions, or follow-up notes"
          value={setupNotes}
        />
      </label>

      {error ? (
        <div className="notice error">
          <span>{error}</span>
          <button onClick={loadPreferences} type="button">
            Retry
          </button>
        </div>
      ) : null}
      {message ? <div className="notice success">{message}</div> : null}

      <div className="action-row">
        <button disabled={saving} onClick={savePreferences} type="button">
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </section>
  );
}

function SectionHeader({
  aggregateConfidence,
  sortLowestFirst,
  setSortLowestFirst,
  exportPreferences,
}: {
  aggregateConfidence: number;
  sortLowestFirst: boolean;
  setSortLowestFirst: (value: boolean) => void;
  exportPreferences: () => void;
}) {
  const isLow = aggregateConfidence < 0.8;

  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">Data Source Configuration</p>
        <h2>Signal confidence setup</h2>
      </div>
      <div className="toolbar">
        <div className={isLow ? "aggregate warning" : "aggregate"}>
          <span>Aggregate</span>
          <strong>{Math.round(aggregateConfidence * 100)}%</strong>
        </div>
        <label className="toggle-control">
          <input
            checked={sortLowestFirst}
            onChange={(event) => setSortLowestFirst(event.target.checked)}
            type="checkbox"
          />
          Lowest first
        </label>
        <button onClick={exportPreferences} type="button">
          Export JSON
        </button>
      </div>
    </div>
  );
}

function SignalRow({
  signal,
  config,
  updateSignal,
}: {
  signal: Signal;
  config: SignalConfig;
  updateSignal: (signal: Signal, config: Partial<SignalConfig>) => void;
}) {
  const mode = config.mode;
  const locked =
    signal.allows_confirmed === false && signal.allows_indexed === false;
  const modeOptions = dataModes.filter((option) => {
      if (option === "confirmed") return signal.allows_confirmed !== false;
      if (option === "indexed") return signal.allows_indexed !== false;
      return signal.allows_proxied !== false;
    });
  const multiplier = confidenceMultiplier(mode);

  return (
    <article className="signal-row">
      <div className="signal-main">
        <div>
          <h3>{signal.name}</h3>
          <p>{signal.description}</p>
        </div>
        <div className="signal-controls">
          <span className={`mode-badge ${mode}`}>
            {mode === "confirmed" ? "✓" : mode === "indexed" ? "↕" : "◎"}
            {modeBadge(mode)} ({Math.round(multiplier * 100)}%)
          </span>
          <select
            disabled={locked}
            onChange={(event) =>
              updateSignal(signal, { mode: event.target.value as DataMode })
            }
            value={mode}
          >
            {modeOptions.map((option) => (
              <option key={option} value={option}>
                {modeLabels[option]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mode === "confirmed" ? (
        <div className="sub-panel">
          <label>
            <span>Source link</span>
            <input
              onChange={(event) =>
                updateSignal(signal, { sourceUrl: event.target.value })
              }
              placeholder="https://"
              type="url"
              value={config.sourceUrl ?? ""}
            />
          </label>
        </div>
      ) : null}

      {mode === "indexed" ? (
        <div className="sub-panel grid-panel">
          <label>
            <span>Direction</span>
            <select
              onChange={(event) =>
                updateSignal(signal, {
                  direction: event.target.value as IndexedDirection,
                })
              }
              value={config.direction ?? "flat"}
            >
              {Object.entries(directionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Approximate %</span>
            <input
              max={100}
              min={0}
              onChange={(event) =>
                updateSignal(signal, {
                  pct: Number(event.target.value),
                })
              }
              type="number"
              value={config.pct ?? 0}
            />
          </label>
        </div>
      ) : null}

      {mode === "proxied" ? (
        <div className="sub-panel">
          <span>Proxy source</span>
          <strong>{signal.proxy_source ?? "No proxy source available"}</strong>
        </div>
      ) : null}

      <div className="score-row">
        <span>Raw score 100</span>
        <span>Adjusted score {adjustedScore(mode)}</span>
      </div>
    </article>
  );
}
