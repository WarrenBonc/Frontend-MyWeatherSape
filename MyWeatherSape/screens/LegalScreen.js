import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LegalScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mentions légales</Text>

      <Text style={styles.sectionTitle}>Éditeur de l’application</Text>
      <Text style={styles.text}>
        MyWeatherSape est éditée par KWP, situé en France.
      </Text>

      <Text style={styles.sectionTitle}>Hébergement</Text>
      <Text style={styles.text}>
        L’application est hébergée par [Nom de l’hébergeur], situé à [Adresse de l’hébergeur].
      </Text>

      <Text style={styles.sectionTitle}>Collecte des données</Text>
      <Text style={styles.text}>
        Aucune donnée personnelle n’est collectée sans votre consentement. Les informations recueillies servent uniquement au bon fonctionnement de l’application.
      </Text>

      <Text style={styles.sectionTitle}>Propriété intellectuelle</Text>
      <Text style={styles.text}>
        Tous les contenus présents dans MyWeatherSape sont la propriété de leurs auteurs respectifs et ne peuvent être reproduits sans autorisation.
      </Text>

      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.text}>
        Pour toute question, veuillez nous contacter à : contact@myweathersape.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backButton: {
    backgroundColor: '#4B6EF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginTop: 30,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
});