import { readFileSync } from 'fs';
import { join } from 'path';

import { PoreMat } from '../porousmaterial';

describe('test PoreMat', () => {
  const cif = readFileSync(
    join(__dirname, '../__tests__/data/cubtc.cif'),
    'utf8',
  ).toString();
  const cubtc = new PoreMat(cif);
  // const comof74 = new PoreMat(
  //   join(__dirname, '../__tests__/data/OXIDIZED_phase_1.cif'),
  // );
  it('test attributes', () => {
    const volumeEpsilon = cubtc.volume - 18280.821833;
    expect(volumeEpsilon).toBeLessThan(0.1);

    const massEpsilon = cubtc.mass - 9677.93664;
    expect(massEpsilon).toBeLessThan(0.1);

    const atomsVolume = cubtc.atomsVolume;
    expect(atomsVolume).toBeCloseTo(10746.72069, 4);

    expect(cubtc.overlapVolume).toBeLessThan(atomsVolume);

    expect(cubtc.porosity).toBeCloseTo(0.7, 1); // 68% in D. Ongari, P. G. Boyd, S. Barthel, M. Witman, M. Haranczyk,and B. Smit, “Accurate Characterization of the Pore Volume inMicroporous Crystalline Materials,” Langmuir33, 14529–14538(2017)
  });
});
