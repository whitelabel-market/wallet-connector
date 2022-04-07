import { MetaMaskLogo } from "@/providers/logos";
import { type ConnectorOptions, ProviderType } from "@/types";

const ConnectToInjected = async (options: ConnectorOptions) => {
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
};

const WALLETS = [
    {
        name: "MetaMask",
        logo: MetaMaskLogo,
    },
    /*
    {
      name: "Safe",
      logo: SafeLogo,
    },
    {
      name: "Nifty",
      logo: NiftyWalletLogo,
    },
    {
      name: "Dapper",
      logo: DapperLogo,
    },
    {
      name: "Opera",
      logo: OperaLogo,
    },
    {
      name: "Trust",
      logo: TrustLogo,
    },
    {
      name: "Coinbase",
      logo: CoinbaseLogo,
    },
    {
      name: "Cipher",
      logo: CipherLogo,
    },
    {
      name: "imToken",
      logo: imTokenLogo,
    },
    {
      name: "Status",
      logo: StatusLogo,
    },
    {
      name: "Coinbase",
      logo: CoinbaseLogo,
    },
    {
      name: "Tokenary",
      logo: TokenaryLogo,
    },
    {
      name: "Frame",
      logo: FrameLogo,
    },
    {
      name: "Liquality",
      logo: LiqualityLogo,
    },
    {
      name: "Math Wallet",
      logo: MathWalletLogo,
    },
    {
      name: "rWallet",
      logo: RWalletLogo,
    },
    {
      name: "XDEFI",
      logo: XDEFILogo,
    },
    {
      name: "Bitpie",
      logo: BitpieLogo,
    },
    {
      name: "Celo extension wallet",
      logo: CeloExtensionWalletLogo,
    },
  */
];

export default WALLETS.map((w) => ({
    name: w.name,
    logo: w.logo,
    type: ProviderType.INJECTED,
    connect: ConnectToInjected,
}));
