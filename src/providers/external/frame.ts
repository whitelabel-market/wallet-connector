import ethProvider from "eth-provider";
import { ProviderType, type IProvider, ConnectorOptions } from "@/types";
import { FrameLogo } from "@/providers/logos";

const ConnectToFrame = async (options: ConnectorOptions) => {
    return ethProvider("frame");
};

const FRAME: IProvider = {
    id: "frame",
    name: "Frame",
    logo: FrameLogo,
    type: ProviderType.WEB,
    connect: ConnectToFrame,
};

export default FRAME;
