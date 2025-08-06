import { TamaguiProvider } from "tamagui";
import { PortalProvider } from "@tamagui/portal";
import { config } from "./tamagui.config";
import Map from "./Map";

export default function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <PortalProvider shouldAddRootHost>
        <Map />
      </PortalProvider>
    </TamaguiProvider>
  );
}
