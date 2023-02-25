module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        paths: ['./tsconfig.json'],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-target-blank': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
};
