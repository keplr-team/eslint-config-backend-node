# Keplr ESLint configuration

## Use the rules in your project

1. In the project's `devDependencies` in `package.json`:

    - remove `prettier`
    - remove all the eslint rules packages
    - remove `eslint`
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

1. Fix the auto-fixable problems and check that the fixes are right
2. Ignore all the remaining errors with `// eslint-disable-next-line` (see below for an automated way)
3. As the code is changed, fix the remaining errors

Note: you can run these commands to ignore all the errors:

```sh
npm run lint -- -f json -o warnings.json
node fix.js
```

fix.js (very strongly inspired from https://stackoverflow.com/a/23930212):

```js
const json = require('./warnings.json');
const fs = require('fs');

json.forEach(({ filePath, messages, source }) => {
  // if there is no source we have nothing that needs to be eslint-ignore'd
  if (!source) {
    return;
  }

  const data = source.split('\n');

  // if the source has multiple lines which need to be eslint-ignored our offset changes per addition
  // offset is 1 because line numbers start at 1 but index numbers in an array start at 0
  let offset = 1;

  // group errors/warnings by line because we want to have one eslint disable comment with all the rules to disable
  const groupedMessages = messages.reduce((acc, next) => {
    const prevMessages = acc[next.line] ? acc[next.line] : [];
    // some lines may have the same rule twice
    const duplicateRuleForLine = prevMessages.find(
      message => message.ruleId === next.ruleId,
    );
    // ignore jsx and graphql lint rules
    const applicableRule =
      next.ruleId &&
      !next.ruleId.includes('jsx') &&
      !next.ruleId.includes('graphql');

    // ignore the eslint-ignore addition for duplicates and non applicable rules
    if (duplicateRuleForLine || !applicableRule) {
      return acc;
    }

    return {
      ...acc,
      [next.line]: [...prevMessages, next],
    };
  }, {});

  Object.entries(groupedMessages).forEach(([line, messages]) => {
    // grouped ignores
    const ignore = `// eslint-disable-next-line ${messages
      .map(({ ruleId }) => ruleId)
      .join(' ')}  -- auto-ignored when updating eslint`;
    data.splice(line - offset, 0, ignore);
    offset--;
  });

  const updated = data.join('\n');

  fs.writeFile(filePath, updated, function (err) {
    if (err) return console.log(err);
  });
});

```