import { MetaMaskLogo } from "@/providers/logos";
import InjectedProvider from "@/providers/models/injectedProvider";

/*[
    {
        name: "MetaMask",
        logo: MetaMaskLogo,
    },

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
];
*/

class MetaMaskProvider extends InjectedProvider {
    constructor() {
        super("MetaMask", MetaMaskLogo);
    }
}
export default MetaMaskProvider;
