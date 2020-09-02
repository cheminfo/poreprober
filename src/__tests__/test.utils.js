import { overlap, pbcDistance, areBound } from '../utils';

describe('test utils', () => {
  it('test overlap', () => {
    const o = overlap(0.5, 0.5, 1);
    expect(o).toStrictEqual(0);
  });

  it('test PBC distance', () => {
    // Cubic cell of length 1
    const cell = [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
    ];
    const pointA = [1, 0, 0];
    const pointB = [0.8, 0, 0];

    let distance = pbcDistance(pointA, pointB, cell);
    expect(distance).toBeCloseTo(0.2, 8);

    distance = pbcDistance(pointA, pointA, cell);
    expect(distance).toBeCloseTo(0, 8);

    distance = pbcDistance(pointA, [0.5, 0, 0], cell);
    expect(distance).toBeCloseTo(0.5, 8);
  });

  it('check bounding check', () => {
    let distantH = areBound('H', 'H', 4);
    expect(distantH).toBe(false);
  });
});
