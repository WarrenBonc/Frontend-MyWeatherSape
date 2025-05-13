import { useDispatch } from "react-redux";
import { setUser } from "../reducers/user";

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

const SigninPage = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const [error, setError] = useState("");

  // Fonction de soumission de formulaire
  const handleSignin = () => {
    if (!email || !password) {
      setError("Veuillez entrer votre email et mot de passe.");
      return;
    }
    console.log("url", `${config.API_BASE_URL}/api/users/signin`);

    setError(""); // Réinitialise l'erreur avant de commencer la requête

    fetch(`${config.API_BASE_URL}/api/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Inclure les cookies dans la requête
    })
      .then((response) => response.json()) // Gère la réponse de l'API
      .then((data) => {
        console.log("Réponse API :", data);
        if (data.result === true) {
          // Si la connexion réussit, on enregistre les informations utilisateur
          dispatch(setUser(data.userId)); // Enregistre l'ID utilisateur dans Redux

          // Redirige en fonction de l'état des préférences
          if (!data.preferencesCompleted) {
            navigation.navigate("Preference"); // Redirige vers le questionnaire
          } else {
            navigation.navigate("MainTabs"); // Redirige vers la page principale
          }
        } else {
          setError(data.error); // Affiche l'erreur si la connexion échoue
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Une erreur est survenue, veuillez réessayer.");
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={styles.container}
        accessible={true}
        accessibilityLabel="Écran de connexion"
      >
        {/* Décorations */}
        <Image
          source={require("../assets/Ellipse.png")}
          style={[styles.ellipse, styles.bottomLeft]}
          accessibilityIgnoresInvertColors
          accessible={false}
        />
        <Image
          source={require("../assets/Ellipse.png")}
          style={[styles.ellipse, styles.topRight]}
          accessibilityIgnoresInvertColors
          accessible={false}
        />

        {/* Formulaire */}
        <View
          style={styles.formContainer}
          accessible={true}
          accessibilityLabel="Formulaire de connexion"
        >
          <Text style={styles.title} accessibilityRole="header">
            Connectez-vous à votre compte
          </Text>

          <Text style={styles.text}>
            Entrez votre mot de passe et votre email pour vous connecter
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            accessibilityLabel="Champ email"
            accessibilityHint="Entrez votre adresse e-mail"
          />

          <View
            style={styles.passwordContainer}
            accessible={true}
            accessibilityLabel="Champ mot de passe"
          >
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Mot de passe"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={(text) => setPassword(text)}
              accessibilityLabel="Champ mot de passe"
              accessibilityHint="Entrez votre mot de passe"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconContainer}
              accessibilityLabel={
                passwordVisible
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              accessibilityRole="button"
            >
              <Image
                source={
                  passwordVisible
                    ? require("../assets/eye-open.png")
                    : require("../assets/eye-closed.png")
                }
                style={styles.icon}
                accessibilityIgnoresInvertColors
              />
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={{ color: "red" }} accessibilityLiveRegion="polite">
              {error}
            </Text>
          )}

          {/* Mot de passe oublié */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate("ForgotPassword")}
            accessibilityLabel="Mot de passe oublié"
            accessibilityRole="button"
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Bouton connexion */}
          <LinearGradient
            colors={["#34C8E8", "#4E4AF2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 0.99]}
            style={styles.button}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => handleSignin()}
              accessibilityRole="button"
              accessibilityLabel="Se connecter"
            >
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Créer un compte */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("Signup")}
          accessibilityLabel="Créer un compte"
          accessibilityRole="button"
        >
          <Text style={styles.createAccountText}>Pas de compte ?</Text>
          <Text style={styles.blueText}>Créer un compte</Text>
        </TouchableOpacity>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 29,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
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
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: "#4D81E7",
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 15,
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
  createAccountButton: {
    marginTop: 30,
    padding: 10,
    borderRadius: 5,
    color: "#6C7278",
    flexDirection: "row",
  },
  createAccountText: {
    color: "#6C7278",
    fontSize: 14,
    fontWeight: "bold",
  },
  blueText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SigninPage;
