import { readFileSync } from 'fs';

import { Atoms } from 'crystcif-parse';
import { dot, cross } from 'mathjs';

import { atomicMasses } from './data/atomicMasses';
import { uffRadii } from './data/uffRadii';

const radiiDict = uffRadii;
const massDict = atomicMasses;

export class PoreMat {
  constructor(cifFile) {
    const cifText = readFileSync(cifFile, 'utf8').toString();
    const cif = Atoms.readCif(cifText);
    const atoms = cif[Object.keys(cif)[0]];
    this.cell = atoms.get_cell();
    this.volume = dot(cross(this.cell[0], this.cell[1]), this.cell[2]);

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
    this.mass = mass; // g/mol
    mass = mass * 1.66053907 * 10 ** -24; // g
    this.density = mass / this.volume;
  }
}

Object.defineProperty(PoreMat.prototype, 'atomsVolume', {
  get: function () {
    let occupiedVolume = 0;
    for (let [symbol, count] of Object.entries(this.elementCounts)) {
      occupiedVolume += (4 / 3) * this.radii[symbol] ** 3 * count;
    }
    return occupiedVolume; // A^3
  },
});

Object.defineProperty(PoreMat.prototype, 'occupiedVolume', {
  // This is the atomsVolume - overlapVolume
  get: function () {
    return this.atomsVolume - this.overlapVolume; // A^3
  },
});

Object.defineProperty(PoreMat.prototype, 'voidVolume', {
  get: function () {
    return this.volume - this.occupiedVolume; // A^3
  },
});

Object.defineProperty(PoreMat.prototype, 'porosity', {
  get: function () {
    return this.occupiedVolume / this.volume; // unitless
  },
});
