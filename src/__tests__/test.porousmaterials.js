import { PoreMat } from '../porousmaterial';
import { join } from 'path';
import { unit, subtract } from 'mathjs';

describe('test PoreMat', () => {
  const cubtc = new PoreMat(join(__dirname, '../__tests__/data/cubtc.cif'));
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

    const specificVolume = cubtc.poreVolume();
    expect(specificVolume.toNumber('cm^3/g')).toBeLessThan(0.83);
    expect(specificVolume.toNumber('cm^3/g')).toBeGreaterThan(0.77);
  });
});
