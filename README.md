# @whitelabel-solutions/wallet-connector

[![NPM version](https://img.shields.io/npm/v/@whitelabel-solutions/wallet-connector?color=a1b858&label=)](https://www.npmjs.com/package/[name])
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

A Web3 Ethereum provider solution for multiple Wallets

## Introduction

@whitelabel-solutions/wallet-connector is an easy-to-use library to support Whitelabel Solutions providing wallet connect feature in their DApps.

It currently supports following providers (:ballot_box_with_check: = Working, :warning: = Not tested, :x: = Not working):

-   Metamask (injected) :ballot_box_with_check:
-   Coinbase Wallet :warning:
-   WalletConnect :warning:
-   Fortmatic :warning:
-   Authereum :x:
-   Frame :x:
-   BinanceChain :x:

## Usage

1. Install @whitelabel-solutions/wallet-connector NPM package

```bash
npm install --save @whitelabel-solutions/wallet-connector

# OR

yarn add @whitelabel-solutions/wallet-connector
```

2. Install Provider packages

```js
import Connector from "@whitelabel-solutions/wallet-connector";

const providers = Connector.init({
    appName: "",
    infuraId: "",
    authereum: { key: "" },
    fortmatic: { key: "" },
}).providers;
```

3. Then you can add @whitelabel-solutions/wallet-connector as follows

```vue
<template>
    <ul>
        <li v-for="provider of providers" :key="provider.name">
            <button @click.prevent="provider.connect">
                {{ provider.name }}
            </button>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import Connector from "@whitelabel-solutions/wallet-connector";

const providers = Connector.init({
    appName: "",
    infuraId: "",
    authereum: { key: "" },
    fortmatic: { key: "" },
}).providers;
</script>
```

## Options

These are all the options to configure the providers:

```ts
type ConnectorUserOptions = {
    appName: string;
    appLogoUrl?: string;
    networkName?: string;
    chainId?: number;
    rpcUri?: string;
    webUri?: string;
    xsUri?: string;
    infuraId: string;
    infuraRpcUri?: string;
    authereum: {
        key: string;
        blockedPopupRedirect?: boolean;
        forceRedirect?: boolean;
        disableNotifications?: boolean;
        disableGoogleAnalytics?: boolean;
    };
    fortmatic: {
        key: string;
    };
    walletconnect?: {
        bridge?: string;
        qrcode?: boolean;
        qrcodeModalOptions?: object;
    };
    walletlink?: {
        darkMode?: boolean;
    };
};
```

## License

MIT
