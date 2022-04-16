import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ProviderType, ConnectorOptions } from "@/types";
import { WalletLinkLogo } from "@/providers/logos";
import ExternalProvider from "@/providers/models/externalProvider";

export default class WalletLinkProvider extends ExternalProvider {
    constructor(options: ConnectorOptions) {
        super("Coinbase Wallet", WalletLinkLogo, ProviderType.QRCODE, options);
    }

    async connect() {
        return new Promise((resolve, reject) => {
            const chainId = this.options.chainId;
            const appName = this.options.appName;
            const appLogoUrl = this.options.appLogoUrl;
            const darkMode = this.options.walletlink?.darkMode;
            const rpc =
                this.options.rpcUri === ""
                    ? this.options.infuraRpcUri
                    : this.options.rpcUri;

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
    }
}
