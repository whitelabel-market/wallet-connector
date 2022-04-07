declare global {
    interface Window {
        web3: any;
        BinanceChain: any;
        celo: any;
        Venly: any;
    }
}

type Complete<T> = {
    [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
        ? T[P]
        : T[P] | undefined;
};

export enum ProviderType {
    INJECTED,
    QRCODE,
    WEB,
}

interface IProviderBase<T> {
    name: string;
    logo: string;
    type: ProviderType;
    connect: (options: ConnectorOptions) => Promise<unknown>;
}

export interface IProvider<T = {}> extends IProviderBase<T> {
    id: string;
}

export type ConnectorUserOptions = {
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

export type ConnectorOptions = Complete<ConnectorUserOptions>;
