declare module 'eth-provider'
declare module 'web3-provider-engine'
declare module '@coinbase/wallet-sdk'
declare module '@walletconnect/web3-provider'
declare module 'authereum/dist'
declare module 'fortmatic'

declare module '*.svg' {
    const content: any
    export default content
}

declare enum ProviderType {
    INJECTED,
    QRCODE,
    WEB,
}
declare type ConnectResult = any | Promise<any>
declare type ConnectFn = (options: ConnectorOptions) => ConnectResult

declare interface IProvider {
    id: string
    name: string
    logo: string
    type: ProviderType
    connect: () => ConnectResult
}

declare type ConnectorUserOptions = {
    appName: string
    appLogoUrl?: string
    networkName?: string
    chainId?: number
    rpcUri?: string
    webUri?: string
    xsUri?: string
    infuraId: string
    infuraRpcUri?: string
    authereum: {
        key: string
        blockedPopupRedirect?: boolean
        forceRedirect?: boolean
        disableNotifications?: boolean
        disableGoogleAnalytics?: boolean
    }
    fortmatic: {
        key: string
    }
    walletconnect?: {
        bridge?: string
        qrcode?: boolean
        qrcodeModalOptions?: object
    }
    walletlink?: {
        darkMode?: boolean
    }
}

declare type ConnectorOptions = ConnectorUserOptions
