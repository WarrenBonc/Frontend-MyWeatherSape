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

const SignupPage = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

const [firstName, setFirstName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleSignup = () => {
  fetch("http://192.168.1.45:3000/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      email,
      password,
      birthdate: dateOfBirth.split("/").reverse().join("-"), // Format yyyy-mm-dd
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
        navigation.navigate("Preference");
      } else {
        alert(data.error);
      }
    })
    .catch(error => {
      alert("Une erreur est survenue lors de l'inscription.");
      console.error(error);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={require("../assets/Ellipse.png")}
          style={[styles.ellipse, styles.bottomLeft]}
        />
        <Image
          source={require("../assets/Ellipse.png")}
          style={[styles.ellipse, styles.topRight]}
        />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.text}>
            Remplissez les informations ci-dessous pour créer un compte
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#aaa"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Mot de passe"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconContainer}
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

          {/* Date of Birth Input */}
          <TextInput
            style={styles.input}
            placeholder="Date de naissance (jj/mm/aaaa)"
            placeholderTextColor="#aaa"
            value={dateOfBirth}
            onChangeText={handleDateInput}
            keyboardType="numeric"
            maxLength={10} // Limite la saisie à 10 caractères
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
            >
              <Text style={styles.buttonText}>Créer un compte</Text>
            </TouchableOpacity>
          </LinearGradient>
          <Text style={styles.orText}>Ou inscrivez-vous avec</Text>
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

          <TouchableOpacity
            style={styles.haveAccountButton}
            onPress={() => navigation.navigate("SignIn")}
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
  orText: {
    marginVertical: 15,
    fontSize: 14,
    color: "#666",
  },
});

export default SignupPage;
