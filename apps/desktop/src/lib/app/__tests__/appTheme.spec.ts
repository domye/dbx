import { describe, expect, it } from "vitest";
import { DEFAULT_APP_CUSTOM_UI_COLORS, appCustomUiColorValue, normalizeAppCustomUiColors } from "@/lib/app/appTheme";

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
});
