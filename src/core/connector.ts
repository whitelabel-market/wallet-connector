import {
    IProvider,
    type ConnectorUserOptions,
    type ConnectorOptions,
} from "@/types";
import AuthereumProvider from "@/providers/external/authereum";
import BinanceChainProvider from "@/providers/external/binancechainwallet";
import MetaMaskProvider from "@/providers/injected/metamask";
import FortmaticProvider from "@/providers/external/fortmatic";
import FrameProvider from "@/providers/external/frame";
import WalletConnectProvider from "@/providers/external/walletconnect";
import WalletLinkProvider from "@/providers/external/walletlink";

export default class Connector {
    private options: ConnectorOptions;
    public providers: IProvider[];

    constructor(options: ConnectorOptions, providers: IProvider[]) {
        this.options = options;
        this.providers = providers;
    }

    static init(userOptions: ConnectorUserOptions): Connector {
        const options = Connector.initOptions(userOptions);
        const providers = Connector.initProviders(options);
        return new Connector(options, providers);
    }

    private static initOptions(
        options: ConnectorUserOptions
    ): ConnectorOptions {
        return {
            appName: options.appName, // required
            appLogoUrl: options.appLogoUrl || undefined,
            networkName: options.networkName || "",
            chainId: options.chainId || 1,
            rpcUri: options.rpcUri || undefined,
            webUri: options.webUri || undefined,
            xsUri: options.xsUri || undefined,
            infuraId: options.infuraId, // required
            infuraRpcUri:
                options.infuraRpcUri ||
                `https://mainnet.infura.io/v3/${options.infuraId}`,
            authereum: {
                ...options.authereum,
                key: options.authereum.key, // required
            },
            fortmatic: {
                key: options.fortmatic.key, // required
            },
            walletconnect: {
                bridge:
                    options.walletconnect?.bridge ||
                    "https://bridge.walletconnect.org",
                qrcode: options.walletconnect?.qrcode || true,
                qrcodeModalOptions:
                    options.walletconnect?.qrcodeModalOptions || undefined,
            },
            walletlink: {
                darkMode: options.walletlink?.darkMode || false,
            },
        };
    }

    private static initProviders(options: ConnectorOptions): Array<IProvider> {
        return [
            new MetaMaskProvider(),
            new WalletLinkProvider(options),
            new WalletConnectProvider(options),
            new AuthereumProvider(options),
            new BinanceChainProvider(options),
            new FortmaticProvider(options),
            new FrameProvider(options),
        ];
    }
}
