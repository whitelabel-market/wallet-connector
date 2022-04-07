import WalletConnectProvider from "@walletconnect/web3-provider";
import { ProviderType, type IProvider, ConnectorOptions } from "@/types";
import { WalletConnectLogo } from "@/providers/logos";

const ConnectToWalletConnect = (options: ConnectorOptions) => {
    return new Promise((resolve, reject) => {
        const provider = new WalletConnectProvider({
            bridge: options.walletconnect?.bridge,
            qrcode: options.walletconnect?.qrcode,
            infuraId: options.infuraId,
            rpc: options.rpcUri,
            chainId: options.chainId,
            qrcodeModalOptions: options.walletconnect?.qrcodeModalOptions,
        });
        try {
            resolve(provider.enable());
        } catch (e) {
            reject(e);
        }
    });
};

const WALLETCONNECT: IProvider = {
    id: "walletconnect",
    name: "WalletConnect",
    logo: WalletConnectLogo,
    type: ProviderType.QRCODE,
    connect: ConnectToWalletConnect,
};

export default WALLETCONNECT;
