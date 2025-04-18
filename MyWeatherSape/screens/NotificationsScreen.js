import React, { useState, useEffect } from 'react'; // Import des hooks React
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native'; // Composants natifs
import { LinearGradient } from 'expo-linear-gradient'; // Pour le dégradé du bouton retour
import * as Notifications from 'expo-notifications'; // Pour gérer les notifications
import { useSelector } from 'react-redux';
import config from '../config';
import { useIsFocused } from '@react-navigation/native'; // pour re-fetcher les données quand l'écran est actif

export default function NotificationsScreen({ navigation }) {
  // États pour gérer si les notifications sont activées et à quels moments de la journée
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const isFocused = useIsFocused();

  // Active/désactive les notifications
  const toggleSwitch = () => setNotificationsEnabled(previousState => !previousState);

  // Demande la permission d'envoyer des notifications lors du premier rendu du composant
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Les notifications ne sont pas autorisées');
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/notifications/preferences`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (data) {
          setNotificationsEnabled(data.notificationsEnabled);
          setMorning(data.preferences.includes("matin"));
          setNoon(data.preferences.includes("midi"));
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des préférences :", error);
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

      // Crée une liste d'heures selon les préférences
      const times = [];
      if (morning) times.push({ hour: 8, minute: 0 });
      if (noon) times.push({ hour: 12, minute: 0 });

      // Planifie une notification pour chaque moment choisi
      for (const time of times) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🌤️ MyWeatherSape",
            body: "Voici vos prévisions météo personnalisées !",
          },
          trigger: {
            hour: time.hour,
            minute: time.minute,
            repeats: true,
          },
        });
      }
    };

    scheduleNotifications();
  }, [notificationsEnabled, morning, noon]); // Re-déclenche à chaque changement

  const handleSavePreferences = async () => {
    try {
      const selectedPreferences = [];
      if (morning) selectedPreferences.push("matin");
      if (noon) selectedPreferences.push("midi");
      const response = await fetch(`${config.API_BASE_URL}/api/notifications/save-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: selectedPreferences,
          notificationsEnabled,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('✅ Préférences sauvegardées via bouton :', data);
      Alert.alert("✅ Préférences enregistrées !");
    } catch (error) {
      console.error('❌ Erreur bouton Enregistrer :', error);
    }
  };

  console.log('🔔 Notifications :', { morning, noon });

  return (
    <View style={styles.container}>
      {/* Bouton retour avec dégradé */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <LinearGradient
          colors={['#34C8E8', '#4E4AF2']}
          style={styles.backButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.backButtonText}>←</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Titre de la page */}
      <Text style={styles.title}>Notifications</Text>

      {/* Switch principal pour activer ou non les notifications */}
      <View style={styles.option}>
        <Text>Activer les notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleSwitch} />
      </View>

      {/* Section des fréquences visibles uniquement si notifications activées */}
      {notificationsEnabled && (
        <View style={styles.freqSection}>
          <Text style={styles.subtitle}>Fréquence des notifications :</Text>

          {/* Switch pour chaque moment de la journée */}
          <View style={styles.option}>
            <Text>Le matin</Text>
            <Switch value={morning} onValueChange={setMorning} />
          </View>
          <View style={styles.option}>
            <Text>Une fois par semaine</Text>
            <Switch value={noon} onValueChange={setNoon} />
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
        <LinearGradient
          colors={['#34C8E8', '#4E4AF2']}
          style={styles.saveButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 0,
    marginTop: -50,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  freqSection: {
    marginTop: 20,
  },
  saveButton: {
    marginTop: 30,
    alignSelf: 'center',
    width: '60%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});