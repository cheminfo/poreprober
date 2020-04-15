import { PoreMat } from '../porousmaterial';
import { join } from 'path';
import { unit, subtract } from 'mathjs';

describe('test PoreMat', () => {
  const cubtc = new PoreMat(join(__dirname, '../__tests__/data/cubtc.cif'));
  const comof74 = new PoreMat(
    join(__dirname, '../__tests__/data/OXIDIZED_phase_1.cif'),
  );
  it('test attributes', () => {
    // todo: tolerances are currently a bit high ...
    const volumeEpsilon = subtract(
      cubtc.volume,
      unit(18280.821833, 'angstrom^3'),
    );
    expect(volumeEpsilon.toNumber('angstrom^3')).toBeLessThan(0.1);

    const massEpsilon = subtract(cubtc.mass, unit(9677.93664, 'g/mole'));
    expect(massEpsilon.toNumber('g/mole')).toBeLessThan(0.1);

    const voidFraction = cubtc.voidFraction();
    expect(voidFraction).toBeLessThan(0.75);
    expect(voidFraction).toBeGreaterThan(0.67);

    const voidFractionCoMOF74 = comof74.voidFraction(1000, 'Gm');
    expect(voidFractionCoMOF74).toBeLessThan(0.63);
    expect(voidFractionCoMOF74).toBeGreaterThan(0.52);

    const voidFractionHeCoMOF74 = comof74.voidFraction(1000, 'He');
    expect(voidFractionHeCoMOF74).toBeLessThan(0.31);
    expect(voidFractionHeCoMOF74).toBeGreaterThan(0.26);

    const specificVolume = cubtc.poreVolume();
    expect(specificVolume.toNumber('cm^3/g')).toBeLessThan(0.83);
    expect(specificVolume.toNumber('cm^3/g')).toBeGreaterThan(0.77);
  });
});
