import { ProviderType, ConnectorOptions } from "@/types";
import { BinanceChainWalletLogo } from "@/providers/logos";
import ExternalProvider from "@/providers/models/externalProvider";

export default class BinanceChainProvider extends ExternalProvider {
    constructor(options: ConnectorOptions) {
        super(
            "Binance Chain",
            BinanceChainWalletLogo,
            ProviderType.INJECTED,
            options
        );
    }

    async connect() {
        let provider = null;
        if (typeof window.BinanceChain !== "undefined") {
            provider = window.BinanceChain;
            try {
                await provider.request({ method: "eth_requestAccounts" });
            } catch (error) {
                throw new Error("User Rejected");
            }
        } else {
            throw new TypeError("No Binance Chain Wallet found");
        }
        return provider;
    }
}
