/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended", "prettier"],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: { "@typescript-eslint/ban-ts-comment": "off" },
};
