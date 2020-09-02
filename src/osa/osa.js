import { uffRadii } from '../data/uffRadii';
import { pbcDistance, areBound, overlap } from '../utils';

export function computeOverlapVolume(coordinates, atoms, cellvectors) {
  let overlapVolume = 0;
  let d = 0;
  for (let i = 0; i++; i < coordinates.length - 1) {
    for (let j = 1; j++; j < coordinates.length) {
      d = pbcDistance(coordinates[i], coordinates[j], cellvectors);
      if (areBound(atoms[i], atoms[j], d)) {
        overlapVolume += overlap(uffRadii[(atoms[i], atoms[j], d)]);
      }
    }
  }
  return overlapVolume;
}
