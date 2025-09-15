// eslint.config.js
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      // Disable specific rules
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn",
      
      // Enable rules
      "@next/next/no-html-link-for-pages": "error",
      
      // Custom rules
      "no-console": "warn",
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      // JavaScript specific rules
    },
  },
];