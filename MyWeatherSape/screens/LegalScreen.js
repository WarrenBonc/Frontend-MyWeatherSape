import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LegalScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <LinearGradient
          colors={['#34C8E8', '#4E4AF2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backGradient}
        >
          <Text style={styles.backButtonText}>←</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.title}>Mentions légales</Text>

      <Text style={styles.sectionTitle}>Éditeur de l’application</Text>
      <Text style={styles.text}>
        MyWeatherSape est éditée par KWP, situé en France.
      </Text>

      <Text style={styles.sectionTitle}>Hébergement</Text>
      <Text style={styles.text}>
        L’application est hébergée par Chuck Norris, situé au Texas.
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
        Pour toute question, veuillez nous contacter à : myweathersape@gmail.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 15,
    marginTop: 0,
    zIndex: 1,
  },
  backGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 30,
    color : '222',
    textAlign: 'center',
    fontWeight : 'bold'
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
    marginBottom: 10,
  },
});