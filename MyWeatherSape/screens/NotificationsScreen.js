import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function NotificationsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const [evening, setEvening] = useState(false);

  const toggleSwitch = () => setNotificationsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Notifications</Text>

      <View style={styles.option}>
        <Text>Activer les notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleSwitch} />
      </View>

      {notificationsEnabled && (
        <View style={styles.freqSection}>
          <Text style={styles.subtitle}>Fréquence des notifications :</Text>
          <View style={styles.option}>
            <Text>Le matin</Text>
            <Switch value={morning} onValueChange={setMorning} />
          </View>
          <View style={styles.option}>
            <Text>À midi</Text>
            <Switch value={noon} onValueChange={setNoon} />
          </View>
          <View style={styles.option}>
            <Text>Le soir</Text>
            <Switch value={evening} onValueChange={setEvening} />
          </View>
        </View>
      )}
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
    backgroundColor: '#4B6EF6',
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
});