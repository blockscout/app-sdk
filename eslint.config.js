import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const SPDX_HEADER = "// SPDX-License-Identifier: LicenseRef-Blockscout";

const spdxLicenseRule = {
  meta: {
    type: "layout",
    fixable: "code",
    messages: { missing: `File must start with: ${SPDX_HEADER}` },
    schema: [],
  },
  create(context) {
    return {
      Program() {
        const src = context.sourceCode.getText();
        if (src.startsWith(SPDX_HEADER + "\n")) {
          return;
        }
        context.report({
          loc: { line: 1, column: 0 },
          messageId: "missing",
          fix: (fixer) => fixer.replaceTextRange([0, 0], SPDX_HEADER + "\n\n"),
        });
      },
    };
  },
};

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    plugins: { "spdx-license": { rules: { header: spdxLicenseRule } } },
    files: ["src/**/*.{ts,tsx,js}"],
    ignores: ["**/*.d.ts"],
    rules: {
      "spdx-license/header": "error",
    },
  },
);
