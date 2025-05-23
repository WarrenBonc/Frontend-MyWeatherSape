import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { updatePreferences } from "../reducers/user";
import config from "../config";

const EditProfileScreen = ({ navigation }) => {
  const preferences = useSelector((state) => state.user.preferences);
  const dispatch = useDispatch();
  const selectedAccessory = preferences.accessories?.find((a) => a) || "aucune";
  const gender = preferences.gender || "aucune";
  const sensitivity = preferences.sensitivity || "aucune";
  const recommendationFrequency =
    preferences.recommendationFrequency || "aucune";
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isSensitivityModalVisible, setSensitivityModalVisible] =
    useState(false);
  const [isAccessoryModalVisible, setAccessoryModalVisible] = useState(false);
  const [isFrequencyModalVisible, setFrequencyModalVisible] = useState(false);

  // Fonction pour sauvegarder les préférences de l'utilisateur
  const savePreferences = async (updatedPreferences) => {
    try {
      await fetch(`${config.API_BASE_URL}/api/users/update-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedPreferences),
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences :", error);
    }
  };

  // Fonction pour récupérer les préférences de l'utilisateur
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/users/preferences`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        dispatch(updatePreferences(data));
      } catch (error) {
        console.error("Erreur lors du chargement des préférences :", error);
      }
    };

    fetchPreferences();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Bouton retour comme dans Settings */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        accessibilityLabel="Retour"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={["#34C8E8", "#4E4AF2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backGradient}
        >
          <Text style={styles.backButtonText}>←</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.title}>Mes préférences</Text>

      {preferences && (
        <>
          <View style={styles.pickerContainer}>
            <Text style={styles.preferenceText}>Genre :</Text>
            <TouchableOpacity onPress={() => setGenderModalVisible(true)}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                accessibilityLabel="Genre"
                accessibilityRole="button"
              >
                <Text style={styles.preferenceText}>
                  {gender === "aucune"
                    ? "Aucune"
                    : gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
                <Text style={{ fontSize: 16, color: "#888" }}>⌄</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Modal
            transparent
            animationType="slide"
            visible={isGenderModalVisible}
            onRequestClose={() => setGenderModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  margin: 20,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  Choisir un genre
                </Text>
                {["homme", "femme"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      dispatch(
                        updatePreferences({
                          ...preferences,
                          gender: item === "aucune" ? null : item,
                        })
                      );
                      savePreferences({
                        preferences: {
                          ...preferences,
                          gender: item === "aucune" ? null : item,
                        },
                      });
                      setGenderModalVisible(false);
                    }}
                    style={{ paddingVertical: 10 }}
                    accessibilityLabel={`Sexe : ${item}`}
                    accessibilityRole="button"
                  >
                    <Text style={{ fontSize: 16 }}>
                      {item === "aucune"
                        ? "Aucune"
                        : item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setGenderModalVisible(false)}
                  style={styles.cancelButton}
                  accessibilityLabel="Annuler"
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.pickerContainer}>
            <Text style={styles.preferenceText}>Sensibilité au froid :</Text>
            <TouchableOpacity
              onPress={() => setSensitivityModalVisible(true)}
              accessibilityLabel="Sensibilité au froid"
              accessibilityRole="button"
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.preferenceText}>
                  {sensitivity === "aucune"
                    ? "Aucune"
                    : sensitivity.charAt(0).toUpperCase() +
                      sensitivity.slice(1)}
                </Text>
                <Text style={{ fontSize: 16, color: "#888" }}>⌄</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Modal
            transparent
            animationType="slide"
            visible={isSensitivityModalVisible}
            onRequestClose={() => setSensitivityModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  margin: 20,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <Text style={styles.modalTitle}>Choisir la sensibilité</Text>
                {[
                  "aucune",
                  "frileux",
                  "frileuse",
                  "peu frileux",
                  "peu frileuse",
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      dispatch(
                        updatePreferences({
                          ...preferences,
                          sensitivity: item === "aucune" ? null : item,
                        })
                      );
                      savePreferences({
                        preferences: {
                          ...preferences,
                          sensitivity: item === "aucune" ? null : item,
                        },
                      });
                      setSensitivityModalVisible(false);
                    }}
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionText}>
                      {item === "aucune"
                        ? "Aucune"
                        : item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setSensitivityModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.pickerContainer}>
            <Text style={styles.preferenceText}>Accessoires préférés :</Text>
            <TouchableOpacity
              onPress={() => setAccessoryModalVisible(true)}
              accessibilityLabel="Accessoires préférés"
              accessibilityRole="button"
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.preferenceText}>
                  {selectedAccessory === "aucune"
                    ? "Aucun"
                    : selectedAccessory.charAt(0).toUpperCase() +
                      selectedAccessory.slice(1)}
                </Text>
                <Text style={{ fontSize: 16, color: "#888" }}>⌄</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Modal
            transparent
            animationType="slide"
            visible={isAccessoryModalVisible}
            onRequestClose={() => setAccessoryModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  margin: 20,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <Text style={styles.modalTitle}>Choisir un accessoire</Text>
                {[
                  "aucune",
                  "bonnet",
                  "écharpe",
                  "gants",
                  "parapluie",
                  "casquette",
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      dispatch(
                        updatePreferences({
                          ...preferences,
                          accessories: item === "aucune" ? [] : [item],
                        })
                      );
                      savePreferences({
                        preferences: {
                          ...preferences,
                          accessories: item === "aucune" ? [] : [item],
                        },
                      });
                      setAccessoryModalVisible(false);
                    }}
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionText}>
                      {item === "aucune"
                        ? "Aucun"
                        : item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setAccessoryModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.pickerContainer}>
            <Text style={styles.preferenceText}>
              Fréquence des recommandations :
            </Text>
            <TouchableOpacity onPress={() => setFrequencyModalVisible(true)}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.preferenceText}>
                  {recommendationFrequency === "aucune"
                    ? "Aucune"
                    : recommendationFrequency.charAt(0).toUpperCase() +
                      recommendationFrequency.slice(1)}
                </Text>
                <Text style={{ fontSize: 16, color: "#888" }}>⌄</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Modal
            transparent
            animationType="slide"
            visible={isFrequencyModalVisible}
            onRequestClose={() => setFrequencyModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  margin: 20,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <Text style={styles.modalTitle}>Choisir la fréquence</Text>
                {["aucune", "matin"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      dispatch(
                        updatePreferences({
                          ...preferences,
                          recommendationFrequency:
                            item === "aucune" ? null : item,
                        })
                      );
                      savePreferences({
                        preferences: {
                          ...preferences,
                          recommendationFrequency:
                            item === "aucune" ? null : item,
                        },
                      });
                      setFrequencyModalVisible(false);
                    }}
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionText}>
                      {item === "aucune"
                        ? "Aucune"
                        : item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setFrequencyModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  backGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
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
    fontFamily: "Poppins",
    color: "#222",
  },
  preferenceText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#222",
    marginBottom: 8,
    textAlign: "left",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 5,
    paddingVertical: Platform.OS === "ios" ? 2 : 8,
    height: Platform.OS === "ios" ? 60 : "auto",
    justifyContent: "center",
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#222",
    fontFamily: "Poppins-SemiBold",
  },
  modalOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#444",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: "#555",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});

export default EditProfileScreen;
