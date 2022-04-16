import ethProvider from "eth-provider";
import { ProviderType, ConnectorOptions } from "@/types";
import { FrameLogo } from "@/providers/logos";
import ExternalProvider from "@/providers/models/externalProvider";

export default class FrameProvider extends ExternalProvider {
    constructor(options: ConnectorOptions) {
        super("Frame", FrameLogo, ProviderType.WEB, options);
    }

    connect() {
        return ethProvider("frame");
    }
}
