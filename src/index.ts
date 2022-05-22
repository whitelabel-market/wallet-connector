import Core from "./core";
import Providers from "./providers";
import type {
    IProvider,
    ConnectorUserOptions,
    ConnectorOptions,
    ProviderType,
    ConnectFn,
    ConnectResult,
} from "./types";

const { Connector } = Core;

export type {
    IProvider,
    ConnectorUserOptions,
    ProviderType,
    ConnectorOptions,
    ConnectFn,
    ConnectResult,
};
export { Connector, Providers };
