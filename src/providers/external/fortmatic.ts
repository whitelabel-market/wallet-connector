import Fortmatic from "fortmatic";
import { ProviderType, type IProvider, ConnectorOptions } from "@/types";
import { FortmaticLogo } from "@/providers/logos";

const ConnectToFortmatic = async (options: ConnectorOptions) => {
    const key = options.fortmatic.key;
    const network = options.networkName;
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
};

const FORTMATIC: IProvider = {
    id: "fortmatic",
    name: "Fortmatic",
    logo: FortmaticLogo,
    type: ProviderType.WEB,
    connect: ConnectToFortmatic,
};

export default FORTMATIC;
