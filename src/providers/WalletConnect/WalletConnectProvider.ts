import _WalletConnectProvider from "@walletconnect/web3-provider";
import { ProviderType, ConnectorOptions } from "../../types";
import WalletConnectLogo from "./walletconnect-circle.svg";
import { ExternalProvider } from "../../core/ExternalProvider";

function onConnect(options: ConnectorOptions) {
    const provider = new _WalletConnectProvider({
        bridge: options.walletconnect?.bridge,
        qrcode: options.walletconnect?.qrcode,
        infuraId: options.infuraId,
        rpc: options.rpcUri,
        chainId: options.chainId,
        qrcodeModalOptions: options.walletconnect?.qrcodeModalOptions,
    });

    return provider.enable();
}

export const WalletConnectProvider = new ExternalProvider(
    "WalletConnect",
    WalletConnectLogo,
    ProviderType.QRCODE,
    onConnect
);
