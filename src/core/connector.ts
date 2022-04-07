import _providers from "@/providers";

import {
    IProvider,
    type ConnectorUserOptions,
    ConnectorOptions,
} from "@/types";

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

    private static initProviders(opts: ConnectorOptions): Array<IProvider> {
        return _providers.map(
            (p: IProvider): IProvider => ({
                ...p,
                connect: () => p.connect(opts),
            })
        );
    }
}
