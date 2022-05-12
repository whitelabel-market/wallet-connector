import Core from "./core/index";
import Providers from "./providers/index";
import type {
    IProvider,
    ConnectorUserOptions,
    ProviderType,
} from "./types/index";

const { Connector } = Core;

export type { IProvider, ConnectorUserOptions, ProviderType };
export { Connector, Providers };
