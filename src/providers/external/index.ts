import walletconnect from "./walletconnect";
import fortmatic from "./fortmatic";
import authereum from "./authereum";
import frame from "./frame";
import binancechainwallet from "./binancechainwallet";
import walletlink from "./walletlink";
import type {IProvider} from "../../types";

export default [
    walletlink,
    walletconnect,
    fortmatic,
    authereum,
    frame,
    binancechainwallet,
] as IProvider[];
