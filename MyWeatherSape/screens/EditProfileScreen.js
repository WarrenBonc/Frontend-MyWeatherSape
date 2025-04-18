import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { updatePreferences } from "../reducers/user";

const EditProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.value);
  const preferences = useSelector((state) => state.user.preferences);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("http://192.168.1.45:3000/api/users/preferences", {
          credentials: 'include',
        });
        const data = await response.json();
        dispatch(updatePreferences(data));
      } catch (error) {
        console.error("Erreur lors du chargement des préférences :", error);
      }
    };

    fetchPreferences();
  }, []);

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

      {user && (
        <Text style={styles.userInfo}>
          Bonjour {user.firstName} {user.lastName}
        </Text>
      )}

      {preferences && (
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('TemperaturePreferenceScreen')} style={styles.button}>
            <LinearGradient colors={['#34C8E8', '#4E4AF2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Modifier la sensibilité</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AccessoryPreferenceScreen')} style={styles.button}>
            <LinearGradient colors={['#34C8E8', '#4E4AF2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Modifier mes accessoires</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('GenderPreferenceScreen')} style={styles.button}>
            <LinearGradient colors={['#34C8E8', '#4E4AF2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Modifier le genre</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('RecommendationPreferenceScreen')} style={styles.button}>
            <LinearGradient colors={['#34C8E8', '#4E4AF2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Modifier la fréquence des recommandations</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

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
  userInfo: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
    textAlign: 'center',
    color: '#444',
  },
});

export default EditProfileScreen;
