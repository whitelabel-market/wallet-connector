import { ProviderType, type IProvider, ConnectorOptions } from "@/types";
import { BinanceChainWalletLogo } from "@/providers/logos";

const ConnectToBinanceChainWallet = async (options?: ConnectorOptions) => {
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
};

const BINANCECHAINWALLET: IProvider = {
    id: "binancechainwallet",
    name: "Binance Chain",
    logo: BinanceChainWalletLogo,
    type: ProviderType.INJECTED,
    connect: ConnectToBinanceChainWallet,
};

export default BINANCECHAINWALLET;
