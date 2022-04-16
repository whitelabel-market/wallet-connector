import { ConnectorOptions, IProvider, ProviderType } from "@/types";
import BaseProvider from "@/providers/models/baseProvider";

export default class ExternalProvider
    extends BaseProvider
    implements IProvider
{
    options: ConnectorOptions;

    constructor(
        name: string,
        logo: string,
        type: ProviderType,
        options: ConnectorOptions
    ) {
        super(name, logo, type);
        this.options = options;
    }

    connect() {
        return new Promise(() => {
            throw Error("Please set connect function");
        });
    }
}
