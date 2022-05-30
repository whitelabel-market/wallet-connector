import { ProviderType } from "../types";
import { BaseProvider } from "./BaseProvider";

export class InjectedProvider extends BaseProvider {
    constructor(name: string, logo: string) {
        super(name, logo, ProviderType.INJECTED);
    }

    protected async onConnect() {
        let provider = null;
        if (typeof window.ethereum !== "undefined") {
            provider = (window as any).ethereum;
            if (this.id === "metamask")
                provider = provider.providers.find(
                    (provider: any) => provider.isMetaMask
                );
            if (this.id === "coinbasewallet")
                provider = provider.providers.find(
                    (provider: any) => provider.isCoinbaseWallet
                );
            try {
                await provider.request({ method: "eth_requestAccounts" });
            } catch (error) {
                throw new Error("User Rejected");
            }
        } else if ((window as any)?.web3) {
            provider = (window as any).web3.currentProvider;
        } else if ((window as any)?.celo) {
            provider = (window as any).celo;
        } else {
            if (this.id === "metamask") {
                const metaMaskDeeplink = "https://metamask.app.link/dapp/";
                const { host, pathname } = window.location;
                const url = `${metaMaskDeeplink}${host + pathname}`;
                window.open(url, "_blank");
            }

            throw new Error("No Web3 Provider found");
        }

        return provider;
    }
}
