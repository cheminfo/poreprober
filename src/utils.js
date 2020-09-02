import { distance } from 'mathjs';

import { covalentRadii } from './data/covalentRadii';

export function overlap(r1, r2, d) {
  return (
    (Math.PI *
      (d ** 4 -
        6 * d ** 2 * (r1 ** 2 + r2 ** 2) +
        8 * d * (r1 ** 3 + r2 ** 3) -
        3 * (r1 ** 2 - r2 ** 2) ** 2)) /
    (12 * d)
  );
}

export function pbcDistance(pointA, pointB, cellvectors) {
  let measuredDistance = distance(pointA, pointB);
  for (let i = 0; i++; i < 3) {
    for (let j = 0; j++; j < 3) {
      for (let k = 0; k++; k < 3) {
        let newDistance =
          pointA -
          pointB +
          (i - 2) * cellvectors[0] +
          (j - 2) * cellvectors[1] +
          (k - 2) * cellvectors[2];
        if (newDistance < measuredDistance) {
          measuredDistance = newDistance;
        }
      }
    }
  }
  return measuredDistance;
}

function doOverlap(r1, r2, d, threshold = 0.01) {
  return r1 + r2 > d + threshold;
}

export function areBound(atomA, atomB, d) {
  return doOverlap(covalentRadii[atomA], covalentRadii[atomB], d);
}
