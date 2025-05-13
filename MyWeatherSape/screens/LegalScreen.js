import React from "react";
import { Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function LegalScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      accessible={true}
      accessibilityLabel="Mentions légales de l'application"
    >
      {/* Bouton retour */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        accessibilityLabel="Retour"
        accessibilityRole="button"
        accessibilityHint="Revenir à l'écran précédent"
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

      {/* Titre principal */}
      <Text
        style={styles.title}
        accessibilityRole="header"
        accessibilityLabel="Mentions légales"
      >
        Mentions légales
      </Text>

      {/* Section : Éditeur */}
      <Text
        style={styles.sectionTitle}
        accessibilityRole="header"
        accessibilityLabel="Éditeur de l'application"
      >
        Éditeur de l’application
      </Text>
      <Text style={styles.text}>
        MyWeatherSape est éditée par KWP, situé en France.
      </Text>

      {/* Section : Hébergement */}
      <Text
        style={styles.sectionTitle}
        accessibilityRole="header"
        accessibilityLabel="Hébergement"
      >
        Hébergement
      </Text>
      <Text style={styles.text}>
        L’application est hébergée par Chuck Norris, situé au Texas.
      </Text>

      {/* Section : Données */}
      <Text
        style={styles.sectionTitle}
        accessibilityRole="header"
        accessibilityLabel="Collecte des données"
      >
        Collecte des données
      </Text>
      <Text style={styles.text}>
        Aucune donnée personnelle n’est collectée sans votre consentement. Les
        informations recueillies servent uniquement au bon fonctionnement de
        l’application.
      </Text>

      {/* Section : Propriété */}
      <Text
        style={styles.sectionTitle}
        accessibilityRole="header"
        accessibilityLabel="Propriété intellectuelle"
      >
        Propriété intellectuelle
      </Text>
      <Text style={styles.text}>
        Tous les contenus présents dans MyWeatherSape sont la propriété de leurs
        auteurs respectifs et ne peuvent être reproduits sans autorisation.
      </Text>

      {/* Section : Contact */}
      <Text
        style={styles.sectionTitle}
        accessibilityRole="header"
        accessibilityLabel="Contact"
      >
        Contact
      </Text>
      <Text style={styles.text}>
        Pour toute question, veuillez nous contacter à : myweathersape@gmail.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
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
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 30,
    color: "222",
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333",
    marginBottom: 10,
  },
});
