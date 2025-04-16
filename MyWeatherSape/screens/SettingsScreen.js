import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/user';
import LegalScreen from './LegalScreen';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // ← vide le store utilisateur
    navigation.navigate('SignIn'); // ← redirige vers la connexion
  };

  return (
    <View style={styles.container}>
      {/* Arrière-plan bleu */}
      <Image source={require('../assets/Ellipse.png')} style={styles.background} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NotificationSettings')}>
          <Text style={styles.buttonText}>Notifications</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Legal')}>
          <Text style={styles.buttonText}>Mentions légales</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Déconnexion</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    backgroundColor: '#4B6EF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginTop: 0,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});