import { IProvider, ProviderType } from "@/types";
import BaseProvider from "@/providers/models/baseProvider";

export default class InjectedProvider
    extends BaseProvider
    implements IProvider
{
    constructor(name: string, logo: string) {
        super(name, logo, ProviderType.INJECTED);
    }

    async connect() {
        let provider = null;
        if (typeof window.ethereum !== "undefined") {
            provider = window.ethereum;
            try {
                await provider.request({ method: "eth_requestAccounts" });
            } catch (error) {
                throw new Error("User Rejected");
            }
        } else if (window?.web3) {
            provider = window.web3.currentProvider;
        } else if (window?.celo) {
            provider = window.celo;
        } else {
            throw new Error("No Web3 Provider found");
        }
        return provider;
    }
}
