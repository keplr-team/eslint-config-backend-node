import { ESLint, Linter } from 'eslint';
import * as _ from 'lodash';
import { rules as tsRules } from '@typescript-eslint/eslint-plugin';
//@ts-expect-error
import { rules as importRules } from 'eslint-plugin-import';
//@ts-expect-error
import { rules as jestRules } from 'eslint-plugin-jest';

describe('ESLint rules', () => {
  it.each(['js', 'ts', 'test.js', 'test.ts', 'e2e.js', 'e2e.ts'])(
    'should match defined rules for %s',
    async ext => {
      const engine = new ESLint({ cwd: `${__dirname}/..` });
      const fileConfig = await engine.calculateConfigForFile(`index.${ext}`);
      expect(fileConfig).toMatchSnapshot(
        {
          parser: expect.stringMatching(
            'node_modules/@typescript-eslint/parser/dist/index.js',
          ),
        },
        'Applied rules',
      );
      const rulesList = [
        Array.from(new Linter().getRules().keys()),
        Object.keys(tsRules).map(r => `@typescript-eslint/${r}`),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.keys(importRules).map(r => `import/${r}`),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.keys(jestRules).map(r => `jest/${r}`),
      ].flat(1);

      expect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        _.difference(rulesList, Object.keys(fileConfig.rules!)),
      ).toMatchSnapshot('Ignored rules');
    },
  );
});
