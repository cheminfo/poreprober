import { overlap } from '../utils';

describe('test utils', () => {
  it('test overlap', () => {
    const o = overlap(0.5, 0.5, 1);
    expect(o).toStrictEqual(0);
  });
});
