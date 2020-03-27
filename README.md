# Keplr ESLint configuration

## Use the rules in your project

1. In the project's `devDependencies` in `package.json`:

    - remove `prettier`
    - remove all the eslint rules packages
    - keep `eslint`
    - run  `npm install @keplr/eslint-config-backend-node`

2. Add `"prettier": "@keplr/eslint-config-backend-node/prettierrc.json"` to package.json

3. Remove the prettierrc

4. Replace the .eslintrc file by :

    ```json
    {
        "root": true,
        "parserOptions": { "project": "./tsconfig.json" },
        "extends": ["@keplr/eslint-config-backend-node"],
        "rules": {}
    }
    ```

## Fix the problems

This package will likely highlight many problems in your project that may take a long time to fix.

We recommend that you proceed in steps:

1. Fix the autofixable problems and check that the fixes are right
2. Set the rules that have errors to 'warning' in your local eslintrc (see below for an automated way)
3. For each rule, fix the errors then remove it from your eslintrc

Note : you can run this command to get all the rules 

```sh
yarn lint |egrep '[0-9]:[0-9]'|egrep -o '[^ ]*$'|sort -u|xargs -IX echo '"X":"warn",'
```