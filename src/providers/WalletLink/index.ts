import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ProviderType, ConnectorOptions } from "../../types";
import Logo from "./logo.svg";
import { ExternalProvider } from "../../core/ExternalProvider";

async function onConnect(options: ConnectorOptions) {
    const chainId = options.chainId;
    const appName = options.appName;
    const appLogoUrl = options.appLogoUrl;
    const darkMode = options.walletlink?.darkMode;
    const rpc = options.rpcUri === "" ? options.infuraRpcUri : options.rpcUri;

    const walletLink = new CoinbaseWalletSDK({
        appName,
        appLogoUrl,
        darkMode,
    });
    const provider = walletLink.makeWeb3Provider(rpc, chainId);
    await provider.send("eth_requestAccounts");
    return provider;
}

export default new ExternalProvider(
    "Coinbase Wallet",
    Logo,
    ProviderType.QRCODE,
    onConnect
);
