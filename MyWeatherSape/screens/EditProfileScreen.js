import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { updatePreferences } from "../reducers/user";

const EditProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.value);
  const preferences = useSelector((state) => state.user.preferences);
  const dispatch = useDispatch();
  const selectedAccessory = preferences.accessories?.find((a) => a) || "aucune";
  
  const gender = preferences.gender || "aucune";
  const sensitivity = preferences.sensitivity || "aucune";
  const recommendationFrequency = preferences.recommendationFrequency || "aucune";

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
        <>
          <View style={styles.pickerContainer}>
            <Text style={styles.preferenceText}>Genre :</Text>
            <Picker
              mode="dropdown"
              selectedValue={gender}
              onValueChange={(value) => dispatch(updatePreferences({ ...preferences, gender: value === "aucune" ? null : value }))}
              style={styles.picker}
              enabled={true}
            >
              <Picker.Item label="Aucune" value="aucune" />
              <Picker.Item label="Homme" value="homme" />
              <Picker.Item label="Femme" value="femme" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.preferenceText}>Sensibilité au froid :</Text>
            <Picker
              mode="dropdown"
              selectedValue={sensitivity}
              onValueChange={(value) => dispatch(updatePreferences({ ...preferences, sensitivity: value === "aucune" ? null : value }))}
              style={styles.picker}
              enabled={true}
            >
              <Picker.Item label="Aucune" value="aucune" />
              <Picker.Item label="Frileux" value="frileux" />
              <Picker.Item label="Frileuse" value="frileuse" />
              <Picker.Item label="Peu frileux" value="peu frileux" />
              <Picker.Item label="Peu frileuse" value="peu frileuse" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.preferenceText}>Accessoires préférés :</Text>
            <Picker
              mode="dropdown"
              selectedValue={selectedAccessory}
              onValueChange={(value) =>
                dispatch(updatePreferences({
                  ...preferences,
                  accessories: value === "aucune" ? [] : [value],
                }))
              }
              style={styles.picker}
              enabled={true}
            >
             <Picker.Item label="Aucun" value="aucune" />
             <Picker.Item label="Bonnet" value="bonnet" />
             <Picker.Item label="Écharpe" value="écharpe" />
             <Picker.Item label="Gants" value="gants" />
             <Picker.Item label="Parapluie" value="parapluie" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.preferenceText}>Fréquence des recommandations :</Text>
            <Picker
              mode="dropdown"
              selectedValue={recommendationFrequency}
              onValueChange={(value) => dispatch(updatePreferences({ ...preferences, recommendationFrequency: value === "aucune" ? null : value }))}
              style={styles.picker}
              enabled={true}
            >
              <Picker.Item label="Aucune" value="aucune" />
              <Picker.Item label="Matin" value="matin" />
            </Picker>
          </View>
        </>
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
  userInfo: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
    textAlign: 'center',
    color: '#444',
  },
  preferenceText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'left',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 44,
    fontSize: 16,
    color: '#333',
  },
});

export default EditProfileScreen;
