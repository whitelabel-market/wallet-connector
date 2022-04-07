/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module "eth-provider";
declare module "web3-provider-engine";
declare module "@coinbase/wallet-sdk";
declare module "@walletconnect/web3-provider";
declare module "authereum/dist";
declare module "fortmatic";
