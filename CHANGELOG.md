# Changelog

## [2.1.3](https://github.com/wellwelwel/cl-orm/compare/v2.1.2...v2.1.3) (2026-02-02)


### Bug Fixes

* handle inconsistent columns ([8d211ad](https://github.com/wellwelwel/cl-orm/commit/8d211ad112d7becd16089719401a8778cd57c506))

## [2.1.2](https://github.com/wellwelwel/cl-orm/compare/v2.1.1...v2.1.2) (2026-02-01)


### Bug Fixes

* handle empty values ([9187f4a](https://github.com/wellwelwel/cl-orm/commit/9187f4a3207ffe03bcca7366a41ed29394065590))

## [2.1.1](https://github.com/wellwelwel/cl-orm/compare/v2.1.0...v2.1.1) (2026-02-01)


### Bug Fixes

* handle `null` values in shorthand conditions ([322067d](https://github.com/wellwelwel/cl-orm/commit/322067d413ac9e3059e5d51f0040179d8beb57e0))

## [2.1.0](https://github.com/wellwelwel/cl-orm/compare/v2.0.0...v2.1.0) (2026-02-01)


### Features

* expose `backtick` helper ([1ff1d27](https://github.com/wellwelwel/cl-orm/commit/1ff1d275fec7699fc7735f34b4cf896e2055ebf6))


### Bug Fixes

* ignore backticks for quoted table and columns ([84d9118](https://github.com/wellwelwel/cl-orm/commit/84d9118c0063440ebff1705b27c1c2a790d91b97))

## [2.0.0](https://github.com/wellwelwel/cl-orm/compare/v1.0.0...v2.0.0) (2026-01-31)


### ⚠ BREAKING CHANGES

* improve `insert` DX, add logical operators and object shorthand in `WHERE` clauses ([#5](https://github.com/wellwelwel/cl-orm/issues/5))
* rename `table` to `from` in `select` and `delete` options ([#3](https://github.com/wellwelwel/cl-orm/issues/3))

### Features

* improve `insert` DX, add logical operators and object shorthand in `WHERE` clauses ([#5](https://github.com/wellwelwel/cl-orm/issues/5)) ([92e8cc1](https://github.com/wellwelwel/cl-orm/commit/92e8cc1a1605040f961052d73aec98cb0ce721ce))


### Code Refactoring

* rename `table` to `from` in `select` and `delete` options ([#3](https://github.com/wellwelwel/cl-orm/issues/3)) ([cd25dc3](https://github.com/wellwelwel/cl-orm/commit/cd25dc33cf1765d938b1dbf9d6b1c2f43f294b8c))

## [1.0.0](https://github.com/wellwelwel/cl-orm/compare/v1.0.0...v1.0.0) (2026-01-31)


### Miscellaneous Chores

* release 1.0.0 ([1ab8377](https://github.com/wellwelwel/cl-orm/commit/1ab8377f7b54c959b2e5fd70857a147e383d2d77))
