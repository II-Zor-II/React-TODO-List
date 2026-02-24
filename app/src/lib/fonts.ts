import {
  Source_Code_Pro,
  Montserrat,
  Cormorant_Garamond,
} from "next/font/google";

/* --------------------------------------------------------------------------
   Font instances (next/font/google – self-hosted, optimised)
   -------------------------------------------------------------------------- */

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-code-pro",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "500", "600", "700"],
});

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

export const FONTS = ["montserrat", "source-code-pro", "cormorant-garamond"] as const;
export type FontKey = (typeof FONTS)[number];
export const DEFAULT_FONT: FontKey = "montserrat";

/* --------------------------------------------------------------------------
   Font definitions (single source of truth for UI + CSS)
   --------------------------------------------------------------------------
   To add a new font:
   1. Import it from "next/font/google" and create an instance above.
   2. Add one entry to FONT_DEFINITIONS below.
   3. Add a matching [data-font="..."] rule in styles/fonts.css.
   -------------------------------------------------------------------------- */

interface FontDefinition {
  key: FontKey;
  label: string;
  icon: string;
  variable: string;
  fallback: string;
}

export const FONT_DEFINITIONS: FontDefinition[] = [
  {
    key: "montserrat",
    label: "Montserrat",
    icon: "M",
    variable: montserrat.variable,
    fallback: "sans-serif",
  },
  {
    key: "source-code-pro",
    label: "Source Code Pro",
    icon: "</>",
    variable: sourceCodePro.variable,
    fallback: "monospace",
  },
  {
    key: "cormorant-garamond",
    label: "Garamond",
    icon: "G",
    variable: cormorantGaramond.variable,
    fallback: "serif",
  },
];

/* --------------------------------------------------------------------------
   Utility: className string that registers all font CSS variables on <html>
   -------------------------------------------------------------------------- */

export const fontVariableClasses = [
  montserrat.variable,
  sourceCodePro.variable,
  cormorantGaramond.variable,
].join(" ");
