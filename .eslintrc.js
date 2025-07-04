module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'prettier', 'eslint-plugin-prettier'],
  parser: '@typescript-eslint/parser',
  env: {
    jest: true,
    browser: true,
    node: true,
    es2021: true,
    es6: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-use-before-define': [
      'error',
      {
        functions: true,
        classes: true,
        variables: true,
        allowNamedExports: false
      }
    ],
    radix: 'off',
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要显式导入 React
    'no-shadow': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-console': 'off',
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true
      }
    ],
    'react/display-name': 'off',
    'no-unused-vars': 'off',
    // jsx 单引号
    'jsx-quotes': [2, 'prefer-single'],
    'import/no-cycle': 'off', // TODO: remove
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // 关闭variable必须全部大写规则
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        modifiers: ['const'],
        format: null
      }
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off', // 允许使用下划线开头的变量
    'no-void': 'off', // 允许使用 void 操作符
    'no-continue': 'off',
    'no-bitwise': 'off', // 允许使用位运算符
    'no-param-reassign': 'off',
    'consistent-return': 'off', // 允许函数不返回值
    'array-callback-return': 'off', // 允许数组方法的回调函数不返回值
    // 统一eslint prettier配置
    'prettier/prettier': [
      'warn',
      {},
      {
        usePrettierrc: true
      }
    ]
  }
}
