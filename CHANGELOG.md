# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.1.1]
### Fixed
- Add a ponyfill for `replaceChildren`, so that the call to it does not break on old browsers ([#81](https://github.com/MetaMask/logo/pull/81))

## [3.1.0]
### Added
- Add `mask` support ([#76](https://github.com/MetaMask/logo/pull/76))
- Add gradient support ([#71](https://github.com/MetaMask/logo/pull/71))
- Add `@lavamoat/allow-scripts` ([#58](https://github.com/MetaMask/logo/pull/58))

## [3.0.1] - 2021-06-08
### Fixed
- Provides missing util.js when used as dependency ([#54](https://github.com/MetaMask/logo/pull/54))

### Security
- Bump glob-parent from 5.1.1 to 5.1.2 to fix security vulnerability ([#53](https://github.com/MetaMask/logo/pull/53))

## [3.0.0] - 2021-06-08 [DEPRECATED]
### Changed
- **BREAKING**: Update minimum Node version to 12 ([#46](https://github.com/MetaMask/logo/pull/46))
- Provide beta fox assets, demo, and meshJson option ([#50](https://github.com/MetaMask/logo/pull/50))

### Security
- Bump hosted-git-info from 2.8.8 to 2.8.9 to fix security vulnerability ([#48](https://github.com/MetaMask/logo/pull/48))
- Bump lodash from 4.17.20 to 4.17.21 to fix security vulnerability ([#47](https://github.com/MetaMask/logo/pull/47))
- Bump elliptic from 6.5.3 to 6.5.4 to fix security vulnerability ([#41](https://github.com/MetaMask/logo/pull/41))

## [2.5.0] - 2020-08-19
### Changed
- Removed unnecessary files from published package
  - Node and browser consumers should be unaffected

[Unreleased]: https://github.com/MetaMask/logo/compare/v3.1.1...HEAD
[3.1.1]: https://github.com/MetaMask/logo/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/MetaMask/logo/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/MetaMask/logo/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/MetaMask/logo/compare/v2.5.0...v3.0.0
[2.5.0]: https://github.com/MetaMask/logo/releases/tag/v2.5.0
