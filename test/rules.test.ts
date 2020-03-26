import { CLIEngine } from 'eslint';
import * as _ from 'lodash';

const configPath = require.resolve('../');

describe('ESLint rules', () => {
  it.each(['js', 'ts', 'test.js', 'test.ts', 'e2e.js', 'e2e.ts'])(
    'should match defined rules for %s',
    ext => {
      const engine = new CLIEngine({ configFile: configPath });

      const fileConfig = engine.getConfigForFile(`index.${ext}`);
      expect(fileConfig).toMatchSnapshot(
        {
          parser: expect.stringMatching(
            'node_modules/@typescript-eslint/parser/dist/parser.js',
          ),
        },
        'Applied rules',
      );

      const rules = engine.getRules();
      expect(
        _.difference(Array.from(rules.keys()), Object.keys(fileConfig.rules!)),
      ).toMatchSnapshot('Ignored rules');
    },
  );
});
