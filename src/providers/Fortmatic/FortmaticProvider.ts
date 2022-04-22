import Fortmatic from "fortmatic";
import { ProviderType, ConnectorOptions } from "../../types";
import FortmaticLogo from "./fortmatic.svg";
import { ExternalProvider } from "../../core/ExternalProvider";

async function onConnect(options: ConnectorOptions) {
  const key = options.fortmatic.key;
  const network = options.networkName;
  const fm = new Fortmatic(key, network);
  const provider = await fm.getProvider();
  // provider.fm = fm;
  await fm.user.login();
  const isLoggedIn = await fm.user.isLoggedIn();
  if (isLoggedIn) {
    return provider;
  } else {
    throw new Error("Failed to login to Fortmatic");
  }
}

export const FortmaticProvider = new ExternalProvider(
  "Fortmatic",
  FortmaticLogo,
  ProviderType.WEB,
  onConnect
);
