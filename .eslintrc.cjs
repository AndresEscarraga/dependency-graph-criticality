module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    project: ['./tsconfig.base.json'],
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ['dist', 'node_modules']
};
