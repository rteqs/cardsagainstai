module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['ws'] },
    ],
    'consistent-return': 'off',
    'no-use-before-define': ['error', { functions: false, classes: true }],
  },
  plugins: ['prettier'],
};
