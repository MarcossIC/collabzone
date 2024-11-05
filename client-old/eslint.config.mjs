import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    ...react.configs.recommended,
    ...reactHooks.configs.recommended,
  },
  allConfig: react.configs.all,
});

export default [
  {
    ignores: [
      '**/.vscode',
      '**/dist',
      '**/node_modules',
      '.github',
      'vite.config.js',
      'postcss.config.js',
      'tailwind.config.js',
      'setup-husky.js',
      'package.json',
      'public',
    ],
  },
  ...fixupConfigRules(
    compat.extends('eslint:recommended', 'plugin:tailwindcss/recommended')
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      'react-refresh': fixupPluginRules(reactRefresh),
    },
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    settings: {
      react: { version: '18.3' },
      'import/resolver': {
        node: {
          extensions: ['.js'],
          paths: ['src'],
        },
      },
    },

    rules: {
      ...js.configs.rules,
      ...react.configs['jsx-runtime'].rules,
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: false }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off',
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          printWidth: 85,
          tabWidth: 2,
          trailingComma: 'es5',
          arrowParens: 'avoid',
          proseWrap: 'preserve',
          htmlWhitespaceSensitivity: 'css',
          bracketSpacing: true,
          bracketSameLine: true,
          useTabs: false,
          endOfLine: 'auto',
          semi: true,
        },
        {
          usePrettierrc: true,
        },
      ],
      'react/jsx-no-target-blank': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-underscore-dangle': 'off',
      'no-console': 'off',
      'no-plusplus': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];
