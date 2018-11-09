{
    "parser": "babel-eslint",
    "parserOptions": {
      "sourceType": "module"
    },
    "extends": ["airbnb", "plugin:prettier/recommended"],
    "rules": {
      "no-plusplus": [0],
      "no-restricted-syntax": [0],
      "no-console": 0,
      "no-nested-ternary": 0,
      "max-len": 0,
      "no-unused-vars": 0,
      "guard-for-in": 0,
      "no-underscore-dangle": 0,
      "func-names": 0,
      "import/named": [1],
      "import/prefer-default-export": 0,
      "react/no-unused-prop-types": 0,
      "react/forbid-prop-types": 0,
      "react/jsx-filename-extension": [1, { "extensions": [".js"] }],
      "react/no-array-index-key": [0],
      "react/destructuring-assignment": 0,
      "react/jsx-closing-bracket-location": 0,
      "react/jsx-closing-tag-location": 0,
      "react/jsx-curly-spacing": 0,
      "react/jsx-equals-spacing": 0,
      "react/jsx-first-prop-new-line": 0,
      "react/jsx-indent": 0,
      "react/jsx-indent-props": 0,
      "react/jsx-max-props-per-line": 0,
      "react/jsx-one-expression-per-line": 0,
      "react/jsx-props-no-multi-spaces": 0,
      "react/jsx-tag-spacing": 0,
      "react/jsx-wrap-multilines": 0,
      "jsx-a11y/img-has-alt": [0],
      "jsx-a11y/alt-text": 0
    },
    "env": {
      "browser": true,
      "node": true,
      "es6": true
    },
    "plugins": ["react"]
  }