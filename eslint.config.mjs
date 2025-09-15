import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base Next.js configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Custom rules and disables
  {
    rules: {
      // Disable specific rules globally
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "warn",
      
      // Or use different severity levels
      "no-console": "warn",
      
      // Next.js specific rule disabling
      "@next/next/no-img-element": "off",
    },
  },
  
  // You can also create specific configs for different file types
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      // Disable rules only for test files
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;