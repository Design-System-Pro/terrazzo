module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': ['error'],
    'no-shadow': ['error'],
    'no-prototype-builtins': 'off', // don’t tell me how to JS!
    'no-undef': 'off', // handled by TS
    'prefer-const': 'off',
    'prefer-template': ['error'], // "+" is for math; templates are for strings
    semi: 'error',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn'],
        '@typescript-eslint/indent': ['error', 2],
        indent: 'off',
      },
    },
  ],
};
