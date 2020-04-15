import { readFileSync } from 'fs';
import { join } from 'path';

import { blub } from '..';

describe('test myModule', () => {
  const data = readFileSync(
    join(__dirname, '../__tests__/data/cubtc.cif'),
    'utf8',
  ).toString();
  it('should return 42', () => {
    expect(blub(data)).toStrictEqual(42);
  });
});
