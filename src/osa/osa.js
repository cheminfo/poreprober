import { uffRadii } from '../data/uffRadii';
import { pbcDistance, areBound, overlap } from '../utils';

export function computeOverlapVolume(coordinates, atoms, cellvectors) {
  let overlapVolume = 0;
  let d = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      d = pbcDistance(coordinates[i], coordinates[j], cellvectors);
      if (areBound(atoms[i], atoms[j], d)) {
        overlapVolume += overlap(uffRadii[atoms[i]], uffRadii[atoms[j]], d);
      }
    }
  }
  return overlapVolume;
}
