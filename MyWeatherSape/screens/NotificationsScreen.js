import React, { useState, useEffect } from "react"; // Import des hooks React
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native"; // Composants natifs
import { LinearGradient } from "expo-linear-gradient"; // Pour le dégradé du bouton retour
import * as Notifications from "expo-notifications"; // Pour gérer les notifications
import config from "../config";
import { useIsFocused } from "@react-navigation/native"; // pour re-fetcher les données quand l'écran est actif

export default function NotificationsScreen({ navigation }) {
  // États pour gérer si les notifications sont activées
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasLoadedPreferences, setHasLoadedPreferences] = useState(false);
  const isFocused = useIsFocused();

  // Active/désactive les notifications
  const toggleSwitch = () =>
    setNotificationsEnabled((previousState) => !previousState);

  // Sauvegarde automatique des préférences à chaque changement
  useEffect(() => {
    // Fonction pour sauvegarder les préférences
    const savePref = async () => {
      try {
        await fetch(
          `${config.API_BASE_URL}/api/notifications/save-preferences`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preferences: { notificationsEnabled } }),
            credentials: "include",
          }
        );
      } catch (e) {
        console.error("❌ Erreur sauvegarde auto notif :", e);
      }
    };

    if (hasLoadedPreferences) {
      savePref();
    }
  }, [notificationsEnabled, hasLoadedPreferences]);

  // Demande la permission d'envoyer des notifications lors du premier rendu du composant
  useEffect(() => {
    // Fonction pour demander la permission d'envoyer des notifications
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Les notifications ne sont pas autorisées");
      }
    };
    requestPermissions();
  }, []);

  // Effect pour récupérer les préférences lorsque l'écran est actif
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/notifications/preferences`,
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data && typeof data.notificationsEnabled === "boolean") {
          setNotificationsEnabled(data.notificationsEnabled);
          setHasLoadedPreferences(true);
        }
      } catch (error) {
        console.error(
          "❌ Erreur lors de la récupération des préférences :",
          error
        );
      }
    };

    if (isFocused) {
      fetchPreferences();
    }
  }, [isFocused]);

  // Planifie ou annule les notifications en fonction des préférences utilisateur
  useEffect(() => {
    const scheduleNotifications = async () => {
      // Supprime toutes les notifications programmées auparavant
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Si les notifications sont désactivées, on arrête ici
      if (!notificationsEnabled) return;

      // Planifie une notification pour chaque moment choisi
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🌤️ MyWeatherSape",
          body: "Voici vos prévisions météo personnalisées !",
        },
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });
    };

    scheduleNotifications();
  }, [notificationsEnabled]); // Re-déclenche à chaque changement

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="Écran des paramètres de notifications"
    >
      {/* Bouton retour avec dégradé */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        accessibilityLabel="Retour à l'écran précédent"
        accessibilityRole="button"
        accessibilityHint="Revenir à la page précédente"
      >
        <LinearGradient
          colors={["#34C8E8", "#4E4AF2"]}
          style={styles.backButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.backButtonText}>←</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Titre de la page */}
      <Text style={styles.title} accessibilityRole="header">
        Notifications
      </Text>

      {/* Switch principal pour activer ou non les notifications */}
      <View style={styles.option}>
        <Text
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Activer les notifications"
        >
          Activer les notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleSwitch}
          accessibilityLabel="Bouton d'activation des notifications"
          accessibilityHint={
            notificationsEnabled
              ? "Désactiver les notifications"
              : "Activer les notifications"
          }
          accessibilityRole="switch"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 0,
    marginTop: -50,
    zIndex: 1,
  },
  backButtonText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 30,
    alignSelf: "center",
    width: "60%",
    borderRadius: 10,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});
