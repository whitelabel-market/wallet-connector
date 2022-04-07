import { Authereum } from "authereum/dist";
import { ProviderType, type IProvider, ConnectorOptions } from "@/types";
import { AuthereumLogo } from "@/providers/logos";

type AuthereumOptionsType = {
    apiKey?: string;
    networkName?: string;
    rpcUri?: string;
    webUri?: string;
    xsUri?: string;
    blockedPopupRedirect?: boolean;
    forceRedirect?: boolean;
    disableNotifications?: boolean;
    disableGoogleAnalytics?: boolean;
};

const ConnectToAuthereum = (options: ConnectorOptions) => {
    const authereumOptions: AuthereumOptionsType = {
        apiKey: options.authereum.key,
        networkName: options.networkName,
        rpcUri: options.rpcUri,
        webUri: options.webUri,
        xsUri: options.webUri,
        blockedPopupRedirect: options.authereum.blockedPopupRedirect,
        forceRedirect: options.authereum.forceRedirect,
        disableNotifications: options.authereum.disableNotifications,
        disableGoogleAnalytics: options.authereum.disableGoogleAnalytics,
    };

    return new Promise((resolve, reject) => {
        try {
            const authereum = new Authereum(authereumOptions);
            const provider = authereum.getProvider();
            provider.authereum = authereum;
            resolve(provider.enable());
        } catch (error) {
            return reject(error);
        }
    });
};

const AUTHEREUM: IProvider = {
    id: "authereum",
    name: "Authereum",
    logo: AuthereumLogo,
    type: ProviderType.WEB,
    connect: ConnectToAuthereum,
};

export default AUTHEREUM;
