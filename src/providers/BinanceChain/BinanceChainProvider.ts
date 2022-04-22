import { ProviderType } from "../../types";
import BinanceChainWalletLogo from "./binancechainwallet.svg";
import { ExternalProvider } from "../../core/ExternalProvider";

const onConnect = async () => {
    let provider = null;
    if (typeof (window as any).BinanceChain !== "undefined") {
        provider = (window as any).BinanceChain;
        try {
            await provider.request({ method: "eth_requestAccounts" });
        } catch (error) {
            throw new Error("User Rejected");
        }
    } else {
        throw new TypeError("No Binance Chain Wallet found");
    }
    return provider;
};

export const BinanceChainProvider = new ExternalProvider(
    "Binance Chain",
    BinanceChainWalletLogo,
    ProviderType.INJECTED,
    onConnect
);
