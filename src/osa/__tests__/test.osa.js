import { computeOverlapVolume } from '../osa';

describe('test OSA', () => {
  it('Hypothetical crystal', () => {
    let atoms = ['H', 'H'];
    let positions = [
      [0, 0, 0],
      [1, 1, 1],
    ];
    let cell = [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
    ];
    let ov = computeOverlapVolume(positions, atoms, cell);
    expect(ov).toBe(0);

    // overlapping atoms
    atoms = ['H', 'H'];
    positions = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    cell = [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
    ];
    ov = computeOverlapVolume(positions, atoms, cell);

    expect(ov).toBeCloseTo((4 / 3) * Math.PI * 1.286 ** 3, 3);
  });
});
