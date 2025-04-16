import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import config from "./config";
import CookieManager from "@react-native-cookies/cookies";

import User from "./reducers/user";
import Weather from "./reducers/weather";

//creation du store
const store = configureStore({
  reducer: {
    user: User,
    weather: Weather,
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
import LegalScreen from "./screens/LegalScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import EditProfileScreen from "./screens/EditProfileScreen";

// Simuler un token (à remplacer avec un vrai AsyncStorage ou contexte plus tard)
const token = null;

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dressing" component={DressingScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si le token est valide au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const cookies = await CookieManager.get("http://localhost:3000"); // Remplacez par l'URL de votre backend
        if (cookies.token) {
          console.log("Token trouvé dans les cookies :", cookies.token.value);

          // Optionnel : Valider le token avec le backend
          const response = await fetch(
            `${config.API_BASE_URL}/api/users/verify-token`,
            {
              method: "GET",
              credentials: "include", // Inclure les cookies dans la requête
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.valid) {
              setIsAuthenticated(true); // Le token est valide
            } else {
              setIsAuthenticated(false); // Le token est invalide
            }
          } else {
            setIsAuthenticated(false); // Erreur dans la requête
          }
        } else {
          console.log("Aucun token trouvé dans les cookies");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des cookies :", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Chargement terminé
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    // Afficher un écran de chargement pendant la vérification
    return null;
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={isAuthenticated ? "MainTabs" : "Welcome"}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SigninScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Preference" component={PreferenceScreen} />
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="Legal" component={LegalScreen} />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationsScreen}
          />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
