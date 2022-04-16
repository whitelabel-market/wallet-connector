import Fortmatic from "fortmatic";
import { ProviderType, ConnectorOptions } from "@/types";
import { FortmaticLogo } from "@/providers/logos";
import ExternalProvider from "@/providers/models/externalProvider";

export default class FortmaticProvider extends ExternalProvider {
    constructor(options: ConnectorOptions) {
        super("Fortmatic", FortmaticLogo, ProviderType.WEB, options);
    }

    async connect() {
        const key = this.options.fortmatic.key;
        const network = this.options.networkName;
        const fm = new Fortmatic(key, network);
        const provider = await fm.getProvider();
        // provider.fm = fm;
        await fm.user.login();
        const isLoggedIn = await fm.user.isLoggedIn();
        if (isLoggedIn) {
            return provider;
        } else {
            throw new Error("Failed to login to Fortmatic");
        }
    }
}
