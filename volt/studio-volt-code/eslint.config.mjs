import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "__tests__/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "jest.setup.ts",
      "*.config.ts",
      "*.config.js",
      "*.config.mjs",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Prevent console.log in production (allow console.warn, console.error, console.info)
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      // Prevent debugger statements
      "no-debugger": "error",
      // Prevent alert/confirm/prompt
      "no-alert": "warn",
      // Force use of === instead of ==
      eqeqeq: ["error", "always"],
      // Prevent unused variables (except those starting with _)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Force explicit return types on exported functions
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Allow any in specific cases (can be more restrictive)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
