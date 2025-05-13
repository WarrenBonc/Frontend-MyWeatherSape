import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import config from "../config";

const SignupPage = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  // fonction pour gérer l'inscription
  const handleSignup = () => {
    // Regex pour vérifier l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regex pour vérifier la date de naissance
    const dateRegex =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

    // Verifications des champs
    if (
      !firstName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !dateOfBirth.trim()
    ) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    if (!dateRegex.test(dateOfBirth)) {
      alert("Format de date invalide. Utilisez jj/mm/aaaa.");
      return;
    }

    if (!isValidDate(dateOfBirth)) {
      alert("Veuillez entrer une date de naissance réelle.");
      return;
    }
    setLoading(true);

    // Envoi de la requête à l'API
    fetch(`${config.API_BASE_URL}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        email,
        password,
        birthdate: dateOfBirth.split("/").reverse().join("-"), // Format yyyy-mm-dd
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          if (!data.preferencesCompleted) {
            navigation.navigate("Preference"); // Redirige vers le questionnaire
          } else {
            navigation.navigate("MainTabs"); // Redirige vers la page principale
          }
        } else if (data.error === "User already exists") {
          alert("Cet email est déjà utilisé.");
        } else {
          alert(data.error || "Erreur inconnue.");
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Erreur réseau ou serveur. Vérifiez votre connexion.");
        console.error("Erreur lors de l'inscription :", error);
      });
  };

  const handleDateInput = (text) => {
    // Supprime tout caractère non numérique
    const cleaned = text.replace(/[^0-9]/g, "");

    // Ajoute les `/` automatiquement pour le format dd/mm/yyyy
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4
      )}/${cleaned.slice(4, 8)}`;
    }

    setDateOfBirth(formatted);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require("../assets/Ellipse.png")}
          style={[styles.ellipse, styles.bottomLeft]}
          accessible={false}
        />
        <Image
          source={require("../assets/Ellipse.png")}
          style={[styles.ellipse, styles.topRight]}
          accessible={false}
        />

        <View style={styles.formContainer}>
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessible={true}
          >
            Créer un compte
          </Text>

          <Text
            style={styles.text}
            accessible={true}
            accessibilityLabel="Remplissez les informations ci-dessous pour créer un compte"
          >
            Remplissez les informations ci-dessous pour créer un compte
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#aaa"
            value={firstName}
            onChangeText={setFirstName}
            accessible={true}
            accessibilityLabel="Champ de texte : Prénom"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            accessible={true}
            accessibilityLabel="Champ de texte : Email"
          />

          <View
            style={styles.passwordContainer}
            accessible={true}
            accessibilityLabel="Champ de texte : Mot de passe avec bouton d’affichage"
          >
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Mot de passe"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              accessible={true}
              accessibilityLabel="Champ de texte : Mot de passe"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconContainer}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={
                passwordVisible
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              <Image
                source={
                  passwordVisible
                    ? require("../assets/eye-open.png")
                    : require("../assets/eye-closed.png")
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Date de naissance (jj/mm/aaaa)"
            placeholderTextColor="#aaa"
            value={dateOfBirth}
            onChangeText={handleDateInput}
            keyboardType="numeric"
            maxLength={10}
            accessible={true}
            accessibilityLabel="Champ de texte : Date de naissance, au format jour mois année"
          />

          <LinearGradient
            colors={["#34C8E8", "#4E4AF2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 0.99]}
            style={styles.button}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={handleSignup}
              disabled={loading}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Créer un compte"
            >
              <Text style={styles.buttonText}>Créer un compte</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            style={styles.haveAccountButton}
            onPress={() => navigation.navigate("SignIn")}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Vous avez déjà un compte ? Connectez-vous"
          >
            <Text style={styles.haveAccountText}>
              Vous avez déjà un compte ?
            </Text>
            <Text style={styles.blueText}>Connectez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ellipse: {
    position: "absolute",
    width: 700,
    height: 700,
    resizeMode: "contain",
  },
  bottomLeft: {
    bottom: -280,
    left: -280,
  },
  topRight: {
    top: -280,
    right: -280,
  },
  formContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 35,
  },
  title: {
    fontSize: 29,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "left",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,

    backgroundColor: "#ffff",
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    marginBottom: 15,
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    top: -7,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  haveAccountButton: {
    marginTop: 30,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
  },
  haveAccountText: {
    color: "#6C7278",
    fontSize: 14,
    fontWeight: "bold",
  },
  blueText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default SignupPage;
