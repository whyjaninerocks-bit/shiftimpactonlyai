import type { DataMode, IndexedDirection, Signal, SignalConfig, SignalConfigs } from "@/lib/types";

export const RAW_SCORE = 100;

export function confidenceMultiplier(mode: DataMode) {
  if (mode === "confirmed") return 1;
  if (mode === "indexed") return 0.85;
  return 0.7;
}

export function adjustedScore(mode: DataMode) {
  return Math.round(RAW_SCORE * confidenceMultiplier(mode));
}

export function defaultConfigForSignal(signal: Signal): SignalConfig {
  if (signal.key === "media_spend") {
    return { mode: "indexed", direction: "flat", pct: 0, sourceUrl: null };
  }

  return { mode: "proxied", direction: null, pct: null, sourceUrl: null };
}

export function buildDefaultConfigs(signals: Signal[]) {
  return signals.reduce<SignalConfigs>((configs, signal) => {
    configs[signal.key] = defaultConfigForSignal(signal);
    return configs;
  }, {});
}

export function normalizeSignalConfig(
  signal: Signal,
  config: Partial<SignalConfig> | undefined,
): SignalConfig {
  const fallback = defaultConfigForSignal(signal);
  const mode = isDataMode(config?.mode) ? config.mode : fallback.mode;
  const safeMode = modeAllowedForSignal(signal, mode) ? mode : fallback.mode;
  const direction = isIndexedDirection(config?.direction)
    ? config.direction
    : safeMode === "indexed"
      ? fallback.direction ?? "flat"
      : null;
  const rawPct = typeof config?.pct === "number" ? config.pct : fallback.pct;
  const pct =
    safeMode === "indexed" ? Math.min(100, Math.max(0, rawPct ?? 0)) : null;

  return {
    mode: safeMode,
    direction: safeMode === "indexed" ? direction : null,
    pct,
    sourceUrl:
      safeMode === "confirmed" && typeof config?.sourceUrl === "string"
        ? config.sourceUrl
        : null,
  };
}

export function normalizeConfigs(signals: Signal[], configs: SignalConfigs = {}) {
  return signals.reduce<SignalConfigs>((normalized, signal) => {
    normalized[signal.key] = normalizeSignalConfig(signal, configs[signal.key]);
    return normalized;
  }, {});
}

export function modeAllowedForSignal(signal: Signal, mode: DataMode) {
  if (mode === "confirmed") return signal.allows_confirmed !== false;
  if (mode === "indexed") return signal.allows_indexed !== false;
  return signal.allows_proxied !== false;
}

function isDataMode(value: unknown): value is DataMode {
  return value === "confirmed" || value === "indexed" || value === "proxied";
}

function isIndexedDirection(value: unknown): value is IndexedDirection {
  return value === "up" || value === "flat" || value === "down";
}
