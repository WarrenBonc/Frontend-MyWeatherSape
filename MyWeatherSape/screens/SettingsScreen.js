import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import config from "../config";
export default function SettingsScreen() {
  // Récupération de l'objet navigation pour naviguer entre les écrans
  const navigation = useNavigation();
  // Initialisation du dispatch pour envoyer des actions Redux

  // Fonction appelée quand l'utilisateur appuie sur "Déconnexion"
  const handleLogout = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users/logout`, {
        method: "GET",
        credentials: "include", // Inclure les cookies dans la requête
      });

      const data = await response.json();
      if (data.result) {
        console.log(data.message); // Afficher le message de succès
        // Rediriger l'utilisateur vers la page de connexion ou d'accueil
        navigation.navigate("Welcome");
      } else {
        console.error("Erreur lors de la déconnexion :", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    // Conteneur principal de l'écran
    <View style={styles.container}>
      {/* Image de fond bleue */}
      <Image
        source={require("../assets/Ellipse.png")}
        style={styles.background}
      />

      {/* Conteneur scrollable pour le contenu */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Paramètres</Text>

        {/* Bouton pour aller à la page Notifications */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NotificationSettings")}
        >
          <Text style={styles.buttonText}>Notifications</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Modifier mes préférences</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Bouton pour aller à la page des mentions légales */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Legal")}
        >
          <Text style={styles.buttonText}>Mentions légales</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Bouton pour se déconnecter */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Déconnexion</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Définition des styles pour tous les composants de la page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    zIndex: -1,
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  button: {
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  arrow: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#222",
    marginBottom: 20,
    marginTop: 10,
  },
});
