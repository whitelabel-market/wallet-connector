import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ProviderType, type IProvider, ConnectorOptions } from "@/types";
import { WalletLinkLogo } from "@/providers/logos";

const ConnectToWalletLink = (options: ConnectorOptions) => {
    return new Promise((resolve, reject) => {
        const chainId = options.chainId;
        const appName = options.appName;
        const appLogoUrl = options.appLogoUrl;
        const darkMode = options.walletlink?.darkMode;
        const rpc =
            options.rpcUri === "" ? options.infuraRpcUri : options.rpcUri;

        const walletLink = new CoinbaseWalletSDK({
            appName,
            appLogoUrl,
            darkMode,
        });

        try {
            const provider = walletLink.makeWeb3Provider(rpc, chainId);
            resolve(provider.send("eth_requestAccounts"));
        } catch (e) {
            reject(e);
        }
    });
};

const WALLETLINK: IProvider = {
    id: "walletlink",
    name: "Coinbase Wallet",
    logo: WalletLinkLogo,
    type: ProviderType.QRCODE,
    connect: ConnectToWalletLink,
};

export default WALLETLINK;
