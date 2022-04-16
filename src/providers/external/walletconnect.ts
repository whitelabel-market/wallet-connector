import _WalletConnectProvider from "@walletconnect/web3-provider";
import { ProviderType, ConnectorOptions } from "@/types";
import { WalletConnectLogo } from "@/providers/logos";
import ExternalProvider from "@/providers/models/externalProvider";

export default class WalletConnectProvider extends ExternalProvider {
    constructor(options: ConnectorOptions) {
        super("WalletConnect", WalletConnectLogo, ProviderType.QRCODE, options);
    }

    connect() {
        return new Promise((resolve, reject) => {
            const provider = new _WalletConnectProvider({
                bridge: this.options.walletconnect?.bridge,
                qrcode: this.options.walletconnect?.qrcode,
                infuraId: this.options.infuraId,
                rpc: this.options.rpcUri,
                chainId: this.options.chainId,
                qrcodeModalOptions:
                    this.options.walletconnect?.qrcodeModalOptions,
            });
            try {
                resolve(provider.enable());
            } catch (e) {
                reject(e);
            }
        });
    }
}
