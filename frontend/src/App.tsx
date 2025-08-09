import { registerRootComponent } from "expo";
import AppContainer from "./navigation/AppContainer";
import { PortalProvider, TamaguiProvider } from "tamagui";
import { config } from "tamagui.config";

export default function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <PortalProvider shouldAddRootHost>
        <AppContainer />
      </PortalProvider>
    </TamaguiProvider>
  );
}
registerRootComponent(App);
