import type { IProvider } from "@/types";
import external from "./external";
import injected from "./injected";

export default [...injected, ...external] as IProvider[];
