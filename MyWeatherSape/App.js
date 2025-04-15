import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import user from './reducers/user';

//creation du store
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});


// Import Screens
import WelcomeScreen from "./screens/WelcomeScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import PreferenceScreen from "./screens/PreferenceScreen";
import HomeScreen from "./screens/HomeScreen";
import DressingScreen from "./screens/DressingScreen";
import SettingsScreen from "./screens/SettingsScreen";

// Simuler un token (à remplacer avec un vrai AsyncStorage ou contexte plus tard)
const token = null;

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={!token ? "Welcome" : "MainTabs"}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Preference" component={PreferenceScreen} />
        <Stack.Screen name="Dressing" component={DressingScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
