export enum ProviderType {
    INJECTED,
    QRCODE,
    WEB,
}
export type ConnectResult = any | Promise<any>;
export type ConnectFn = (options: ConnectorOptions) => ConnectResult;

export interface IProvider {
    id: string;
    name: string;
    logo: string;
    type: ProviderType;
    connect: () => ConnectResult;
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

export type ConnectorOptions = ConnectorUserOptions;
