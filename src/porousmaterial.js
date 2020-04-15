import { readFileSync } from 'fs';

import { Atoms } from 'crystcif-parse';
import { unit, dot, cross, divide } from 'mathjs';

import { Sphere, randomPointIntersect } from './utils';

let async = require('async');

const massDict = require('./data/mass.json');
const radiiDict = require('./data/radii.json');

function voidFraction(cycles = 1000, probeAtom = 'Gm') {
  const spheres = [];

  for (let index = 0; index < this.positions.length; index++) {
    spheres.push(
      new Sphere(this.positions[index], this.radii[this.symbols[index]]),
    );
  }

  const cell = this.cell;

  let hitPromises = [];
  // eslint-disable-next-line no-unused-vars
  async.times(cycles, function (n, next) {
    hitPromises.push(randomPointIntersect(cell, spheres, probeAtom));
  });

  return 1 - hitPromises.filter((v) => v).length / hitPromises.length;
}

function poreVolume(cycles = 1000, probeAtom = 'Gm') {
  const voidFraction = this.voidFraction(cycles, probeAtom);
  return divide(voidFraction, this.density);
}

export class PoreMat {
  constructor(cifFile) {
    const cifText = readFileSync(cifFile, 'utf8').toString();
    const cif = Atoms.readCif(cifText);
    const atoms = cif[Object.keys(cif)[0]];
    this.cell = atoms.get_cell();
    this.volume = unit(
      dot(cross(this.cell[0], this.cell[1]), this.cell[2]),
      'angstrom^3',
    );
    this.symbols = atoms.get_chemical_symbols();
    let elementCounts = {};
    this.symbols.forEach(
      (number) => (elementCounts[number] = (elementCounts[number] || 0) + 1),
    );
    this.elementCounts = elementCounts;
    this.positions = atoms.get_positions();

    this.radii = {};
    this.symbolSet = new Set(this.symbols);

    this.symbolSet.forEach((symbol) => {
      this.radii[symbol] = radiiDict[symbol];
    });

    let mass = 0;
    for (let [symbol, count] of Object.entries(elementCounts)) {
      mass += massDict[symbol] * count;
    }

    this.mass = unit(mass, 'g/mole');
    mass = unit(mass * 1.66053907 * 10 ** -24, 'g');
    this.density = divide(mass, this.volume);

    this.voidFraction = voidFraction;

    // ToDo: I'm not sure if we should make this an attribute or a function
    this.poreVolume = poreVolume;
  }
}
