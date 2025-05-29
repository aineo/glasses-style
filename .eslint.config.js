import tsEslint from 'typescript-eslint'

export default [
  ...tsEslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    }
  }
]
