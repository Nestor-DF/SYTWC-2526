module.exports = {
    root: true,
    parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
    env: { browser: true, es2022: true, node: true },
    plugins: ['react', 'react-hooks', 'jsx-a11y'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    settings: { react: { version: 'detect' } },
    rules: {
        // Reglas de accesibilidad destacadas:
        'jsx-a11y/alt-text': 'error',                 // <img> sin alt
        'jsx-a11y/aria-role': 'error',                // roles no válidos
        'jsx-a11y/no-redundant-roles': 'error',        // roles redundantes (p.ej. <nav role="navigation">)
        'react/jsx-no-duplicate-props': 'error',
        'jsx-a11y/label-has-associated-control': 'error',
        "react/prop-types": "off",
    },
};
