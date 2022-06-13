## [2.1.5](https://github.com/whitelabel-market/wallet-connector/compare/v2.1.4...v2.1.5) (2022-06-13)


### Bug Fixes

* provider libs in connector call ([53313a2](https://github.com/whitelabel-market/wallet-connector/commit/53313a2450878a5d7bb33afd9c63c792425359db))

## [2.1.4](https://github.com/whitelabel-market/wallet-connector/compare/v2.1.3...v2.1.4) (2022-06-11)


### Bug Fixes

* remove dist from git assets ([5fb8bfc](https://github.com/whitelabel-market/wallet-connector/commit/5fb8bfc73b8fe470358773470c66a01840e2b505))

## [2.1.3](https://github.com/whitelabel-market/wallet-connector/compare/v2.1.2...v2.1.3) (2022-06-11)


### Bug Fixes

* release dist ([607f512](https://github.com/whitelabel-market/wallet-connector/commit/607f5123da976c679025c5ffa89ebe5c06814076))

## [2.1.2](https://github.com/whitelabel-market/wallet-connector/compare/v2.1.1...v2.1.2) (2022-06-11)


### Bug Fixes

* peer dependencies import statement ([c999e57](https://github.com/whitelabel-market/wallet-connector/commit/c999e57c89c1721e8280a8cb4585e6f418da8ee2))

## [2.1.1](https://github.com/whitelabel-market/wallet-connector/compare/v2.1.0...v2.1.1) (2022-06-11)


### Bug Fixes

* dependencies version ([0663a6a](https://github.com/whitelabel-market/wallet-connector/commit/0663a6ae28bbb36d6c014f1b831becdec28a0f1e))
* walletconnect import as promise ([028de1c](https://github.com/whitelabel-market/wallet-connector/commit/028de1c0b28d42fc37221a634b098d1194d817a5))

# [2.1.0](https://github.com/whitelabel-market/wallet-connector/compare/v2.0.0...v2.1.0) (2022-06-10)


### Bug Fixes

* handle edge case when multiple injected providers are installed ([fd0e5ba](https://github.com/whitelabel-market/wallet-connector/commit/fd0e5ba30181c142930c265417b97ee3b3c1f7fb))
* rename coinbase wallet ([95b5be9](https://github.com/whitelabel-market/wallet-connector/commit/95b5be9c1f58f6c4dc54cd91b72d791bf2a29c9f))


### Features

* use peer dependencies ([ec15121](https://github.com/whitelabel-market/wallet-connector/commit/ec1512190864ac2b8d683f57e97457d2e7d5ac73))

# [2.0.0](https://github.com/whitelabel-market/wallet-connector/compare/v1.0.6...v2.0.0) (2022-06-09)


### Bug Fixes

* error reporting on chain switch request ([1a86c4a](https://github.com/whitelabel-market/wallet-connector/commit/1a86c4a8602763588a6adb687922c6a8ab32a205))


### chore

* merge branch 'main' into feature/multi_provider ([6b070a9](https://github.com/whitelabel-market/wallet-connector/commit/6b070a92364b4637efdac40dc83d8bc8e6bfbada))


### Code Refactoring

* move external class into wrapper and refactor exports ([743c89c](https://github.com/whitelabel-market/wallet-connector/commit/743c89c9accb9524e3611c4782c63df65fa1de05))


### Features

* introduce provider details in base ([ad771c5](https://github.com/whitelabel-market/wallet-connector/commit/ad771c536b5f35ad312c4e3e2f3f0af41ddf0731))
* switch or add chain if wrong network ([eecf439](https://github.com/whitelabel-market/wallet-connector/commit/eecf439789f62f232a9ea6e4da684970d7433fd1))


### Reverts

* path alias ([96770b7](https://github.com/whitelabel-market/wallet-connector/commit/96770b7106a29d8271e3c5442c30ae1a77a31822))


### BREAKING CHANGES

* instantiate by passing the specific options to the connector
* connection is initialized by calling initConnection and connectors can be accessed
at top level

## [1.0.6](https://github.com/whitelabel-market/wallet-connector/compare/v1.0.5...v1.0.6) (2022-06-02)


### Bug Fixes

* missing provider for mobile wallets ([77cf738](https://github.com/whitelabel-market/wallet-connector/commit/77cf73813f1a53bf9218c365d585978b451c98c7))

## [1.0.5](https://github.com/whitelabel-market/wallet-connector/compare/v1.0.4...v1.0.5) (2022-06-02)


### Bug Fixes

* wallet connection in metamask app ([d57cba4](https://github.com/whitelabel-market/wallet-connector/commit/d57cba40531ba3df4f4764fa6abfadfa12304325))

## [1.0.4](https://github.com/whitelabel-market/wallet-connector/compare/v1.0.3...v1.0.4) (2022-05-30)


### Bug Fixes

* conflicting metamask and coinbase wallet in browser ([21df7d0](https://github.com/whitelabel-market/wallet-connector/commit/21df7d0a51ad9cb8a1cab6a7f77cbb8d09c7978a))

## [1.0.3](https://github.com/whitelabel-market/wallet-connector/compare/v1.0.2...v1.0.3) (2022-05-29)


### Bug Fixes

* mobile metamask open app ([ef8ee52](https://github.com/whitelabel-market/wallet-connector/commit/ef8ee528563ea15be31504f4dded08ba52ce6432))

## [1.0.2](https://github.com/whitelabel-market/wallet-connector/compare/v1.0.1...v1.0.2) (2022-05-29)


### Bug Fixes

* authereum and fortmatic option types ([656f820](https://github.com/whitelabel-market/wallet-connector/commit/656f8203e571005649aba60a8d02518e277b936c))
* **connector.ts:** duplicated wrong type imports ([b6ce8be](https://github.com/whitelabel-market/wallet-connector/commit/b6ce8bedc47bd22e6d718c711e6014ec6714993e))
* parse and validate chainid if not available ([24c0efa](https://github.com/whitelabel-market/wallet-connector/commit/24c0efaac0371044660cd72b01b10bb42f5a1ddd))
* switch coinbase sdk to module import ([532a914](https://github.com/whitelabel-market/wallet-connector/commit/532a914b4036e145cbdbf3cec361913bbc7f7608))
* walletconnect provide rpc options. Metamask open link if not exists ([4bfad83](https://github.com/whitelabel-market/wallet-connector/commit/4bfad8318b18bbb3e156028ae56f65412e81f727))

## [1.0.1](https://github.com/whitelabel-market/wallet-connector/compare/v1.0.0...v1.0.1) (2022-05-12)


### Bug Fixes

* **injectedprovider.ts:** use metamask provider from multiple providers on metamask wallet selection ([39a4f7a](https://github.com/whitelabel-market/wallet-connector/commit/39a4f7a03f24286964afcc22b35638320e9ba126))

# 1.0.0 (2022-05-12)


### Bug Fixes

* add --ignore-engines to avoid failing installs during ci ([1e19cdc](https://github.com/whitelabel-market/wallet-connector/commit/1e19cdc22ad8501cd00b3b483c97bbfcc976bdb0))
* add --ignore-engines to avoid failing installs during ci ([8cec2d4](https://github.com/whitelabel-market/wallet-connector/commit/8cec2d4007702214ba887f80508c496d01c03bbe))
* fix eslint ([b84dd28](https://github.com/whitelabel-market/wallet-connector/commit/b84dd287ee8994d9b9a07069b57f41f3a163380b))
* fix lint and tests ([97f4525](https://github.com/whitelabel-market/wallet-connector/commit/97f452557cf7a38fe6bf6ec7a19e8fd711154355))
* replace pnpm commands with yarn ([5dc3ff9](https://github.com/whitelabel-market/wallet-connector/commit/5dc3ff98dfcf2debe887a2d83d991b9fea00c56c))
* rewrite connector import to lowercase ([9989f9c](https://github.com/whitelabel-market/wallet-connector/commit/9989f9c717da3df00494d79e598596dbc04ded6c))
* try adding extensions to node-resolve to fix tests on ubuntu ([de29ac1](https://github.com/whitelabel-market/wallet-connector/commit/de29ac1031060bce6c64b846953e98bdd82fe073))
* try adding node-resolve rollup plugin to fix tests on ubuntu ([e781ab8](https://github.com/whitelabel-market/wallet-connector/commit/e781ab80153da750b53a003676af32e836e78f39))
* try changing import to fix tests on ubuntu ([fdee4cf](https://github.com/whitelabel-market/wallet-connector/commit/fdee4cfa6ae40d579ca0ef5fbfcf3f13138da1e4))
* try different rollup config ([4c84137](https://github.com/whitelabel-market/wallet-connector/commit/4c841372e9a8c97cd9395d08d815ea7b74922da1))
* try different tsconfig to fix tests on ubuntu ([7d61cb5](https://github.com/whitelabel-market/wallet-connector/commit/7d61cb506bb254dfc95041aa48cf7fa628ab7dce))
* try named export ([76178e6](https://github.com/whitelabel-market/wallet-connector/commit/76178e6e3a5476650de39e8c23dc1552e7fef272))
* try npm run instead of yarn ([0a06a4d](https://github.com/whitelabel-market/wallet-connector/commit/0a06a4d22717a314dce8044ecd10e6bf66e3458a))
* try removing index again from imports ([51318ea](https://github.com/whitelabel-market/wallet-connector/commit/51318ea0bf60a6c63cd0b3fbba2e3159ce24c39e))
