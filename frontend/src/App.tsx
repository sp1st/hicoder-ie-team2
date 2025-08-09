import { registerRootComponent } from "expo";
import AppContainer from "./navigation/AppContainer";

export default function App() {
  return <AppContainer />;
}
registerRootComponent(App);
