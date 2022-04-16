import { ProviderType } from "@/types";
import generateId from "@/helpers/generateId";

export default class BaseProvider {
    id: string;
    name: string;
    logo: string;
    type: ProviderType;

    constructor(name: string, logo: string, type: ProviderType) {
        this.id = generateId(name);
        this.name = name;
        this.logo = logo;
        this.type = type;
    }
}
