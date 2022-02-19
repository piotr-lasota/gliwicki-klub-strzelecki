module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    eqeqeq: ['error', 'always'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'no-param-reassign': [
      'error',
      {
        ignorePropertyModificationsFor: ['state'],
        props: true
      }
    ],
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'prettier/prettier': 'error',
    quotes: [
      2,
      'single',
      {
        avoidEscape: true
      }
    ],
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-filename-extension': 'off',
    'no-unused-vars': 'warn'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx']
      }
    }
  }
};
