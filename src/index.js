import { Atoms } from 'crystcif-parse';
import { dot, cross } from 'mathjs';
import { Sphere, randomPointIntersect } from './utils';

/**
 * Returns a very important number
 * @return {number}
 */
export function blub(ciftext) {
  const radiiDict = require('./data/radii.json');
  const cycles = 10000;
  const cif = Atoms.readCif(ciftext);
  const atoms = cif[Object.keys(cif)[0]];
  const cell = atoms.get_cell();
  const volume = dot(cross(cell[0], cell[1]), cell[2]);
  const symbols = atoms.get_chemical_symbols();
  let elementCounts = {};
  symbols.forEach(
    (number) => (elementCounts[number] = (elementCounts[number] || 0) + 1),
  );
  console.log(volume);
  const radii = {};
  const symbolSet = new Set(symbols);

  symbolSet.forEach((symbol) => {
    radii[symbol] = radiiDict[symbol];
  });

  const positions = atoms.get_positions();

  const spheres = [];

  for (let index = 0; index < positions.length; index++) {
    spheres.push(new Sphere(positions[index], radii[symbols[index]]));
  }

  let async = require('async');

  let hitPromises = [];
  async.times(cycles, function (n, next) {
    hitPromises.push(randomPointIntersect(cell, spheres));
  });

  console.log(hitPromises.filter((v) => v).length / hitPromises.length);

  return 42;
}
