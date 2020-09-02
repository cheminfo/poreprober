import { join } from 'path';

import { PoreMat } from '../porousmaterial';

describe('test PoreMat', () => {
  const cubtc = new PoreMat(join(__dirname, '../__tests__/data/cubtc.cif'));
  // const comof74 = new PoreMat(
  //   join(__dirname, '../__tests__/data/OXIDIZED_phase_1.cif'),
  // );
  it('test attributes', () => {
    const volumeEpsilon = cubtc.volume - 18280.821833;
    expect(volumeEpsilon).toBeLessThan(0.1);

    const massEpsilon = cubtc.mass - 9677.93664;
    expect(massEpsilon).toBeLessThan(0.1);
  });
});
