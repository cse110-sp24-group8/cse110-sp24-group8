import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      "prettier/prettier": "error",
    },
    rules: {
      "consistent-return": 2,
      indent: [1, 4],
      "no-else-return": 1,
      semi: [1, "always"],
      "space-unary-ops": 2,
    },
  },
];
