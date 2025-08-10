import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { RootTabParamList } from "@/types/Navigation";
import { useState } from "react";

// Screens
import Home from "@/screens/Home";
import Map from "@/screens/Map";
import Notifications from "@/screens/Notifications";
import Profile from "@/screens/Profile";

const Tab = createBottomTabNavigator<RootTabParamList>();

function AppContainer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // ログインしていない場合はログイン画面を表示
  if (!isLoggedIn) {
    return <Home onLogin={handleLogin} />;
  }

  // ログイン済みの場合はメインアプリを表示
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Map"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            if (route.name === "Map") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Notifications") {
              iconName = focused ? "add" : "add-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0a7ea4ff",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: { padding: 10, height: 70 },
        })}
      >
        <Tab.Screen
          name="Map"
          component={Map}
          options={{ tabBarLabel: "マップ", headerShown: false }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{ tabBarLabel: "通知", headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ tabBarLabel: "プロフィール", headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;
