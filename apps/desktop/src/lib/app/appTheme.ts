import type { Theme } from "@tauri-apps/api/window";

export const APP_THEME_STORAGE_KEY = "dbx-theme";
export const APP_THEME_PALETTE_STORAGE_KEY = "dbx-theme-palette";
export const APP_CUSTOM_UI_STORAGE_KEY = "dbx-theme-custom-ui";
export const APP_CORNER_STYLE_STORAGE_KEY = "dbx-corner-style";

export type AppThemeMode = "light" | "dark" | "system";
export type AppThemeAppearance = "light" | "dark";
export type AppThemePalette = "pearl" | "mist" | "graphite" | "cobalt" | "sage" | "amber" | "blush" | "vscode" | "idea" | "xcode" | "jetbrains" | "cursor" | "claude" | "custom";
export type AppCornerStyle = "none" | "small" | "large";

export interface AppCustomUiColors {
  background: string;
  foreground: string;
  primary: string;
  border: string;
  sidebar: string;
}

export const DEFAULT_APP_CUSTOM_UI_COLORS: AppCustomUiColors = {
  background: "#ffffff",
  foreground: "#0a0a0a",
  primary: "#171717",
  border: "#e5e5e5",
  sidebar: "#fafafa",
};

export interface AppCustomUiColorDef {
  key: keyof AppCustomUiColors;
  varName: string;
  rgbVarName?: string;
  labelKey: string;
}

export const APP_CUSTOM_UI_COLOR_DEFS: readonly AppCustomUiColorDef[] = [
  { key: "background", varName: "--background", labelKey: "settings.customUiBackground" },
  { key: "foreground", varName: "--foreground", labelKey: "settings.customUiForeground" },
  { key: "primary", varName: "--primary", rgbVarName: "--dbx-primary-rgb", labelKey: "settings.customUiPrimary" },
  { key: "border", varName: "--border", labelKey: "settings.customUiBorder" },
  { key: "sidebar", varName: "--sidebar", labelKey: "settings.customUiSidebar" },
];

// The remaining neutral surfaces derive from the chosen colors as tints of
// background toward foreground, so the theme stays coherent in both light and
// dark without extra pickers.
export const APP_CUSTOM_UI_DERIVED_VARS: readonly { varName: string; value: string }[] = [
  { varName: "--card", value: "color-mix(in srgb, var(--background) 97%, var(--foreground))" },
  { varName: "--secondary", value: "color-mix(in srgb, var(--background) 94%, var(--foreground))" },
  { varName: "--muted", value: "color-mix(in srgb, var(--background) 94%, var(--foreground))" },
  { varName: "--accent", value: "color-mix(in srgb, var(--background) 88%, var(--foreground))" },
  { varName: "--muted-foreground", value: "color-mix(in srgb, var(--foreground) 58%, var(--background))" },
  { varName: "--sidebar-foreground", value: "var(--foreground)" },
];

export type AppThemePaletteOption = {
  value: AppThemePalette;
  labelKey: string;
  className: string | null;
  previewColor: string;
};

export const APP_THEME_PALETTES: AppThemePaletteOption[] = [
  { value: "pearl", labelKey: "settings.themePalettePearl", className: null, previewColor: "#ffffff" },
  { value: "mist", labelKey: "settings.themePaletteMist", className: "theme-soft", previewColor: "#e4eaf2" },
  { value: "graphite", labelKey: "settings.themePaletteGraphite", className: "theme-graphite", previewColor: "#d8dce4" },
  { value: "cobalt", labelKey: "settings.themePaletteCobalt", className: "theme-cobalt", previewColor: "#d8e6f7" },
  { value: "sage", labelKey: "settings.themePaletteSage", className: "theme-sage", previewColor: "#dbe9e2" },
  { value: "amber", labelKey: "settings.themePaletteAmber", className: "theme-amber", previewColor: "#f4e4b8" },
  { value: "blush", labelKey: "settings.themePaletteBlush", className: "theme-blush", previewColor: "#f4d9e6" },
  { value: "vscode", labelKey: "settings.themePaletteVscode", className: "theme-vscode", previewColor: "#007acc" },
  { value: "idea", labelKey: "settings.themePaletteIdea", className: "theme-idea", previewColor: "#4b6eaf" },
  { value: "xcode", labelKey: "settings.themePaletteXcode", className: "theme-xcode", previewColor: "#0a84ff" },
  { value: "jetbrains", labelKey: "settings.themePaletteJetbrains", className: "theme-jetbrains", previewColor: "#7b61ff" },
  { value: "cursor", labelKey: "settings.themePaletteCursor", className: "theme-cursor", previewColor: "#6ba4ff" },
  { value: "claude", labelKey: "settings.themePaletteClaude", className: "theme-claude", previewColor: "#c47a50" },
  { value: "custom", labelKey: "settings.themePaletteCustom", className: null, previewColor: "#171717" },
];

export const APP_THEME_PALETTE_CLASS_NAMES = APP_THEME_PALETTES.map((palette) => palette.className).filter((className): className is string => Boolean(className));

export function normalizeAppThemeMode(value: string | null): AppThemeMode {
  if (value === "soft-light") return "light";
  if (value === "soft-dark") return "dark";
  if (value === "soft-system") return "system";
  if (value === "dark" || value === "light" || value === "system") return value;
  return "light";
}

export function normalizeAppThemePalette(value: string | null): AppThemePalette {
  if (
    value === "mist" ||
    value === "graphite" ||
    value === "cobalt" ||
    value === "sage" ||
    value === "amber" ||
    value === "blush" ||
    value === "vscode" ||
    value === "idea" ||
    value === "xcode" ||
    value === "jetbrains" ||
    value === "cursor" ||
    value === "claude" ||
    value === "custom" ||
    value === "pearl"
  )
    return value;
  return "pearl";
}

export function normalizeAppCustomUiColors(value: unknown): AppCustomUiColors {
  const source = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const out = {} as AppCustomUiColors;
  for (const key of Object.keys(DEFAULT_APP_CUSTOM_UI_COLORS) as (keyof AppCustomUiColors)[]) {
    const candidate = source[key];
    out[key] = typeof candidate === "string" && /^#[0-9a-fA-F]{6}$/.test(candidate) ? candidate : DEFAULT_APP_CUSTOM_UI_COLORS[key];
  }
  return out;
}

export function appCustomUiColorValue(hex: string): { color: string; rgbTriplet: string } {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return { color: `rgb(${r} ${g} ${b})`, rgbTriplet: `${r}, ${g}, ${b}` };
}

export function normalizeAppCornerStyle(value: string | null): AppCornerStyle {
  if (value === "none" || value === "small") return value;
  return "large";
}

export function getAppThemePaletteClass(palette: AppThemePalette): string | null {
  return APP_THEME_PALETTES.find((option) => option.value === palette)?.className ?? null;
}

export function isSystemAppThemeMode(mode: AppThemeMode): boolean {
  return mode === "system";
}

export function resolveAppThemeAppearance(mode: AppThemeMode, systemPrefersDark: boolean): AppThemeAppearance {
  if (isSystemAppThemeMode(mode)) return systemPrefersDark ? "dark" : "light";
  return mode === "dark" ? "dark" : "light";
}

export function getTauriThemeForMode(mode: AppThemeMode): Theme | null {
  if (isSystemAppThemeMode(mode)) return null;
  return resolveAppThemeAppearance(mode, false);
}
