import ethProvider from "eth-provider";
import { ProviderType } from "../../types";
import FrameLogo from "./frame.svg";
import { ExternalProvider } from "../../core/ExternalProvider";

async function onConnect() {
  return ethProvider("frame");
}

export const FrameProvider = new ExternalProvider(
  "Frame",
  FrameLogo,
  ProviderType.WEB,
  onConnect
);
