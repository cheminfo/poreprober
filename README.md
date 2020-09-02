# poreprober

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

Getting basic structural descriptors for porous materials.

The current version implements the overlapping spheres (OSA) approach, using atomic radii from the universal force field (UFF).

The calculated descriptors are defined as follows:

- The porosity we return is the fraction between the void volume and the total volume

  <img src="https://tex.cheminfo.org/?tex=%5CPhi_%5Cmathrm%7Bvoid%7D%20%3D%20%5Cfrac%7BV_%5Cmathrm%7Bvoid%7D%7D%7BV_%5Cmathrm%7Btotal%7D%7D%20%20%20"/>

with the total volume given by the cell vectors

<img src="https://tex.cheminfo.org/?tex=V_%5Cmathrm%7Btotal%7D%20%3D%20%5Cmathbf%7Ba%7D%5Ccdot%20%5Cleft(%5Cmathbf%7Bb%7D%20%5Ctimes%20%5Cmathbf%7Bc%7D%5Cright)"/>

and the void volume as

<img src="https://tex.cheminfo.org/?tex=V_%5Cmathrm%7Bvoid%7D%20%3D%20V_%5Cmathrm%7Btotal%7D%20-%20V_%5Cmathrm%7Bocc%7D"/>

where the occupied volume is given as the sum of the radii of the atoms, substracting overlaps between the atoms and periodic boundary conditions (PBC)

<img src="https://tex.cheminfo.org/?tex=V_%5Cmathrm%7Bocc%7D%20%3D%20%5Csum_%7Bi%7D%5EN%20V_%5Cmathrm%7BUFF%2Ci%7D%20-%20%5Csum_%7Bi%2C%20j%3Ei%7D%5EN%20V_%7Bi%2Cj%2C%5Ctext%7BUFF%7D%2C%20%5Ctext%7Boverlap%7D%7D"/>

## Installation

`$ npm i poreprober`

## Usage

```js
import PoreMat from 'poreprober';

let mof = PoreMat(<ciffile>);

const density = mof.density;
const volume = mof.volume;
const porosity = mof.porosity;
```

## [API Documentation](https://cheminfo.github.io/poreprober/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/poreprober.svg
[npm-url]: https://www.npmjs.com/package/poreprober
[ci-image]: https://github.com/cheminfo/poreprober/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/poreprober/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/poreprober.svg
[download-url]: https://www.npmjs.com/package/poreprober
