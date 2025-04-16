import { useDispatch } from "react-redux";
import { setToken, setUser, setLoading, setError } from "../reducers/user";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fonction de soumission de formulaire
  const handleSignin = () => {
    if (!email || !password) {
      setError("Veuillez entrer votre email et mot de passe.");
      return;
    }

    setLoading(true);
    setError(""); // Réinitialise l'erreur avant de commencer la requête
    fetch(`${config.API_BASE_URL}/api/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json()) // Gère la réponse de l'API
      .then((data) => {
        console.log("Réponse API :", data);
        if (data.result === true) {
          // Si la connexion réussit, on enregistre le token et l'utilisateur
          dispatch(setToken(data.token)); // Enregistre le token dans Redux
          dispatch(setUser(data.userId)); // Optionnel, pour garder des informations utilisateur
          navigation.navigate("MainTabs"); // Redirige vers la page de préférence
        } else {
          setError(data.error); // Affiche l'erreur si la connexion échoue
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Une erreur est survenue, veuillez réessayer.");
      })
      .finally(() => {
        setLoading(false); // Réinitialise l'état de chargement
      });
  };

  // Fonction pour gérer l'oubli de mot de passe
  const handleForgotPassword = () => {
    if (!email) {
      setError("Veuillez entrer votre email.");
      return;
    }

    setLoading(true);
    setError(""); // Réinitialise l'erreur avant de commencer la requête
    console.log("Demande de réinitialisation du mot de passe pour:", email);

    fetch(`${API_BASE_URL}/api/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse de l'API:", data);

        if (data.result === true) {
          // Si la demande est réussie, l'utilisateur reçoit un email
          setError(""); // Réinitialise l'erreur
          navigation.navigate("ResetPassword", { email }); // Redirige vers la page de réinitialisation
        } else {
          setError(data.error); // Affiche l'erreur si la demande échoue
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Une erreur est survenue, veuillez réessayer.");
      })
      .finally(() => {
        setLoading(false); // Réinitialise l'état de chargement
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Ellipse Bottom Left */}
        <Image
          source={require("../assets/Ellipse.png")}
          style={[styles.ellipse, styles.bottomLeft]}
        />
        {/* Ellipse Top Right */}
        <Image
          source={require("../assets/Ellipse.png")}
          style={[styles.ellipse, styles.topRight]}
        />

        {/* Sign-in Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Connectez-vous à votre compte</Text>
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
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Mot de passe"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconContainer}
            >
              <Image
                source={
                  passwordVisible
                    ? require("../assets/eye-open.png") // Replace with your "eye open" icon
                    : require("../assets/eye-closed.png") // Replace with your "eye closed" icon
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

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
            >
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Social Login Buttons */}
          <Text style={styles.orText}>Ou connectez-vous avec</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
            >
              <Image
                source={require("../assets/google.png")} // Replace with your Google icon
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.facebookButton]}
            >
              <Image
                source={require("../assets/Facebook.png")} // Replace with your Facebook icon
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* pas de compte ? créer un compte */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("Signup")}
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
  orText: {
    marginVertical: 15,
    fontSize: 14,
    color: "#666",
  },
  socialButtonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    height: 130,
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#EFF0F6",
    borderWidth: 1,
  },
  facebookButton: {
    backgroundColor: "#fff",
    borderColor: "#EFF0F6",
    borderWidth: 1,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: "contain",
  },
  socialButtonText: {
    color: "#00000",
    fontSize: 14,
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
