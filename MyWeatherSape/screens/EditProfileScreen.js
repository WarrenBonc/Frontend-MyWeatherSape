import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const EditProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Bouton retour comme dans Settings */}
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

      <Text style={styles.title}>Mes préférences</Text>

      <TouchableOpacity onPress={() => navigation.navigate('PreferenceScreen')} style={styles.button}>
        <LinearGradient
          colors={['#34C8E8', '#4E4AF2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Modifier</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
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
    fontFamily: 'Poppins',
    color: '#222',
  },
  button: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default EditProfileScreen;
