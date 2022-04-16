import { Authereum } from "authereum/dist";
import { ProviderType, ConnectorOptions } from "@/types";
import { AuthereumLogo } from "@/providers/logos";
import ExternalProvider from "@/providers/models/externalProvider";

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

export default class AuthereumProvider extends ExternalProvider {
    constructor(options: ConnectorOptions) {
        super("Authereum", AuthereumLogo, ProviderType.WEB, options);
    }

    async connect() {
        const authereumOptions: AuthereumOptionsType = {
            apiKey: this.options.authereum.key,
            networkName: this.options.networkName,
            rpcUri: this.options.rpcUri,
            webUri: this.options.webUri,
            xsUri: this.options.webUri,
            blockedPopupRedirect: this.options.authereum.blockedPopupRedirect,
            forceRedirect: this.options.authereum.forceRedirect,
            disableNotifications: this.options.authereum.disableNotifications,
            disableGoogleAnalytics:
                this.options.authereum.disableGoogleAnalytics,
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
    }
}
