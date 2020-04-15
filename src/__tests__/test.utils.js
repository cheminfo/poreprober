import { Sphere } from '../utils';

describe('test sphere', () => {
  const sphere1 = new Sphere([1, 2, 1], 3);
  const sphere2 = new Sphere([0, 0, 0], 1);
  const farSpheres = [new Sphere([10, 10, 10], 1), new Sphere([8, 10, 10], 1)];
  it('make sure we can create a sphere object with attributes', () => {
    expect(sphere1.center).toStrictEqual([1, 2, 1]);
    expect(sphere1.radius).toStrictEqual(3);
  });

  it('make sure the distance calculation works', () => {
    expect(sphere1.distanceToSquared(sphere1)).toStrictEqual(0);
    expect(sphere1.distanceToSquared(sphere2)).toStrictEqual(6);
  });

  it('make sure the intersection works', () => {
    expect(sphere1.isIntersectionSphere(sphere1)).toStrictEqual(true);
    expect(sphere1.isIntersectionSphere(sphere2)).toStrictEqual(true);
  });

  it('make sure the intersection any works', () => {
    expect(sphere1.isIntersectAny(farSpheres)).toStrictEqual(false);
    expect(sphere1.isIntersectAny([sphere2, sphere2])).toStrictEqual(true);
  });
});
