import { multiply } from 'mathjs';

const radiiDict = require('./data/radii.json');

function distanceToSquared(other) {
  const dx = this.center[0] - other.center[0];
  const dy = this.center[1] - other.center[1];
  const dz = this.center[2] - other.center[2];
  return dx * dx + dy * dy + dz * dz;
}

function isIntersectionSphere(other) {
  let radiusSum = this.radius + other.radius;
  return this.distanceToSquared(other) <= radiusSum * radiusSum;
}

function isIntersectAny(others) {
  for (let i = 0; i < others.length; i++) {
    if (this.isIntersectionSphere(others[i])) {
      return true;
    }
  }
  return false;
}

export class Sphere {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
    this.distanceToSquared = distanceToSquared;
    this.isIntersectionSphere = isIntersectionSphere;
    this.isIntersectAny = isIntersectAny;
  }
}

export function randomPointIntersect(cell, spheres, probeAtom = 'He') {
  const randomPoint = multiply(
    [Math.random(), Math.random(), Math.random()],
    cell,
  );

  let probeSphere = new Sphere(randomPoint, radiiDict[probeAtom]);
  return probeSphere.isIntersectAny(spheres);
}
