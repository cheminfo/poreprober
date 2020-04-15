# poreprober

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

Getting basic structural descriptors for porous materials.

## Installation

`$ npm i poreprober`

## Notes

- using $\sigma/2$ from UFF for the radii
- pore volumes are the geometric ones with Monte Carlo integration
- Conolly surface area is maybe next

## Usage

```js
import PoreMat from 'poreprober';

let mof = PoreMat(<ciffile>);

const gmVoidFraction = mof.voidFraction(); // takes cycles and probe molecules
const gmPoreVolume = mof.poreVolume(); // takes cycles and probe molecules, returns math.js unit
const density = mof.density // returns math.js unit
const volume = mof.volume // returns math.js unit
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
