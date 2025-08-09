import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { RootTabParamList } from "@/types/navigation";

// Screens
import HomeScreen from "@/screens/HomeScreen";
import RecordScreen from "@/screens/RecordScreen";
import ProfileScreen from "@/screens/ProfileScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();

function AppContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Record") {
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
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: "ホーム", headerShown: false }}
        />
        <Tab.Screen
          name="Record"
          component={RecordScreen}
          options={{ tabBarLabel: "記録", headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarLabel: "プロフィール", headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;
