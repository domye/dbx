import { describe, expect, it } from "vitest";
import { DEFAULT_APP_CUSTOM_UI_COLORS, DEFAULT_APP_CUSTOM_UI_COLORS_DARK, appCustomUiColorValue, customUiAppearance, hexRelativeLuminance, normalizeAppCustomUiColors, wcagContrastRatio } from "@/lib/app/appTheme";

describe("appTheme custom UI colors", () => {
  it("falls back to defaults for missing or invalid values and keeps valid hex", () => {
    expect(normalizeAppCustomUiColors(null)).toEqual(DEFAULT_APP_CUSTOM_UI_COLORS);
    expect(normalizeAppCustomUiColors({ background: "red", primary: "#2b63b7" }).background).toBe(DEFAULT_APP_CUSTOM_UI_COLORS.background);
    expect(normalizeAppCustomUiColors({ background: "red", primary: "#2b63b7" }).primary).toBe("#2b63b7");
    expect(normalizeAppCustomUiColors({ background: "#fff" }).background).toBe(DEFAULT_APP_CUSTOM_UI_COLORS.background);
  });

  it("converts hex to space-separated rgb and comma-separated triplet", () => {
    expect(appCustomUiColorValue("#2b63b7")).toEqual({ color: "rgb(43 99 183)", rgbTriplet: "43, 99, 183" });
  });

  it("computes WCAG luminance and contrast ratio", () => {
    expect(hexRelativeLuminance("#000000")).toBeCloseTo(0, 5);
    expect(hexRelativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(wcagContrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(wcagContrastRatio("#000000", "#000000")).toBeCloseTo(1, 5);
  });

  it("ships distinct dark defaults and normalizes them like the light set", () => {
    expect(DEFAULT_APP_CUSTOM_UI_COLORS_DARK.background).toBe("#131416");
    expect(DEFAULT_APP_CUSTOM_UI_COLORS_DARK.background).not.toBe(DEFAULT_APP_CUSTOM_UI_COLORS.background);
    expect(normalizeAppCustomUiColors(DEFAULT_APP_CUSTOM_UI_COLORS_DARK)).toEqual(DEFAULT_APP_CUSTOM_UI_COLORS_DARK);
  });

  it("derives light/dark appearance from the custom background luminance at both extremes", () => {
    expect(customUiAppearance({ ...DEFAULT_APP_CUSTOM_UI_COLORS, background: "#000000" })).toBe("dark");
    expect(customUiAppearance({ ...DEFAULT_APP_CUSTOM_UI_COLORS, background: "#ffffff" })).toBe("light");
    expect(customUiAppearance({ ...DEFAULT_APP_CUSTOM_UI_COLORS, background: "#123456" })).toBe("dark");
    expect(customUiAppearance({ ...DEFAULT_APP_CUSTOM_UI_COLORS, background: "#e8f0fa" })).toBe("light");
  });
});
