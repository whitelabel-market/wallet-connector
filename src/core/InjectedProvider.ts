import { ProviderType } from "../types";
import { BaseProvider } from "./BaseProvider";

export class InjectedProvider extends BaseProvider {
    constructor(name: string, logo: string) {
        super(name, logo, ProviderType.INJECTED);
    }

    protected async onConnect() {
        const provider = await getProvider(this.id);

        if (provider) {
            await provider?.request({ method: "eth_requestAccounts" });
            return provider;
        } else {
            window.addEventListener(
                "ethereum#initialized",
                async () => await getProvider(this.id),
                {
                    once: true,
                }
            );

            if (this.id === "metamask") {
                const metaMaskDeeplink = "https://metamask.app.link/dapp/";
                const { host, pathname } = window.location;
                const url = `${metaMaskDeeplink}${host + pathname}`;
                window.open(url, "_blank");
            }

            return;
        }

        function getProvider(id: string) {
            const { ethereum, web3 }: any = window;

            if (ethereum) {
                if (ethereum?.providers?.length) {
                    switch (id) {
                        case "metamask":
                            return ethereum.providers.find(
                                (provider: any) => provider?.isMetaMask
                            );
                        case "coinbaseWallet":
                            return ethereum.providers.find(
                                (provider: any) => provider?.isCoinbaseWallet
                            );
                        default:
                            break;
                    }
                }
                return ethereum;
            } else if (web3?.currentProvider) {
                return web3.currentProvider;
            }

            return;
        }
    }
}
