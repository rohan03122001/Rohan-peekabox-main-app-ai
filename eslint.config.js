// eslint.config.js
const globals = require('globals');
const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Error Prevention
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],

      // Indentation & Formatting
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 1,
          outerIIFEBody: 1,
          MemberExpression: 1,
          FunctionDeclaration: {
            parameters: 1,
            body: 1,
          },
          FunctionExpression: {
            parameters: 1,
            body: 1,
          },
          CallExpression: {
            arguments: 1,
          },
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          flatTernaryExpressions: false,
          ignoreComments: false,
        },
      ],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      // Best Practices
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-expressions': 'error',

      // Function Rules
      'arrow-body-style': ['error', 'as-needed'],

      // Error Handling
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',

      // Async/Promise Rules
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'warn',
    },
  },
];
