import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Disable inline styles rule - we need CSS custom properties for dynamic database colors
      "react/no-inline-styles": "off",
      "no-inline-styles": "off",
      // Disable Tailwind gradient class suggestions
      "suggestCanonicalClasses": "off",
    },
  },
]);

export default eslintConfig;
