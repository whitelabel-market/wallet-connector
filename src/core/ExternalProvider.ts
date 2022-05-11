import { ConnectFn, ProviderType } from "../types";
import { BaseProvider } from "./BaseProvider";

export class ExternalProvider extends BaseProvider {
    protected onConnect!: ConnectFn;

    constructor(
        name: string,
        logo: string,
        type: ProviderType,
        onConnect: ConnectFn
    ) {
        super(name, logo, type);
        this.onConnect = onConnect;
    }
}
