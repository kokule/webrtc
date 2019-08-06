module.exports = {
    root: true,
    env: {
        node: true,
    },
    globals: {
        _: true,
        Axios: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        'indent': ['error', 4],
        'no-unused-vars': 'off',
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'vue/no-unused-components': 'off'
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
