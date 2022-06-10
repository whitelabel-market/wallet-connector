<a href="https://www.npmjs.com/package/@whitelabel-solutions/wallet-connector" target="__blank"><img src="https://img.shields.io/npm/v/@whitelabel-solutions/wallet-connector?color=a1b858&label=" alt="NPM version"></a>
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="meta/img/logo.svg" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">Wallet Connector</h1>

  <p align="center">
    A framework-agnostic Ethereum provider solution to enable wallet connection for dApps.
  </p>
</div>


## Introduction

`@whitelabel-solutions/wallet-connector` is an easy-to-use library to support integration of the most common providers for wallet connection to your dApp. Following features are currently available:
- Connect and Disconnect to a multitude of providers
- Handle error, loading and connect states
- Specify a limited number of allowed chains
- Specify a desired chain and trigger a switch/add chain request
- Switch Chain
- Add Chain
- Store the current provider in local storage to facilitate sign-in for returning users 

> The library is framework-agnostic, meaning it is developed entirely in Typescript without any reliance on frameworks like React or Vue. However, it may of course be used in React or Vue.

## Available connectors

More to come soon!

| Connector                                       | Docs                                                                                            |
|-------------------------------------------------|-------------------------------------------------------------------------------------------------|
| [MetaMask](/src/connectors/MetaMask)            | [www.docs.metamask.io/guide/](https://docs.metamask.io/guide/)                                  |
| [Coinbase Wallet](/src/connectors/WalletLink)   | [www.docs.cloud.coinbase.com/wallet-sdk/docs](https://docs.cloud.coinbase.com/wallet-sdk/docs)  |
| [Wallet Connect](/src/connectors/WalletConnect) | [www.docs.walletconnect.com](https://docs.walletconnect.com/)                                   |

## Usage

1. Install `@whitelabel-solutions/wallet-connector` npm package

```bash
npm install --save @whitelabel-solutions/wallet-connector

# OR

yarn add @whitelabel-solutions/wallet-connector
```

2. Setup Connectors
```js
import {
    MetaMask,
    WalletConnect,
    WalletLink,
} from "@whitelabel-solutions/wallet-connector"

const appName = "appName"
const infuraId = "infuraId"
const chainId = 1

const connectors = [
    MetaMask(),
    WalletConnect({infuraId}),
    WalletLink({
        appName,
        rpcUrl: "https://mainnet.infura.io/v3/" + infuraId,
        chainId
    })
]
```

3. Initialize Connection
```js
import { Connection } from "@whitelabel-solutions/wallet-connector"

const options = {
    allowedChainIds: [1, 3],
    desiredChainOrChainId: 1,
}

const connection = new Connection(options, connectors) // connectors from step 2

connection.loadFromCache() // use this to load the provider from local storage
```

4. Then you can add @whitelabel-solutions/wallet-connector as follows (e.g. in Vue)

```vue
<template>
    <ul>
        <li v-for="connector of connection.connector" :key="connector.id">
            <button @click.prevent="connector.connect">
                {{ connector.name }}
            </button>
        </li>
    </ul>
</template>
```

> You can find working examples in the [example folder](/example/example-vue).

## Options

The individual connectors are configured according to their respective package documentation.
To configure the connection instance, the following options are available:
```ts
type ConnectionOptions = {
    allowedChainIds?: number[] | null // default: null
    desiredChainOrChainId?: number | AddEthereumChainParameter | null // default: null
    cache?: {
        enabled?: boolean // default: true
        key?: string // default: 'cached-connector'
    }
}
```

- If `allowedChainIds` option is set, the connector will validate if the user is connected to a matching chain.
- If `desiredChainOrChainId` option is set, the connector will validate if the user is connected to the matching chain and instantiate a chain switch if not. If a chain switch fails because it's unknown to the provider and the option is passed as an object, the connector will try to add the chain to the wallet.

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.