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

const SigninPage = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

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
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Mot de passe"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible}
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

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordButton}>
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
              onPress={() => navigation.navigate("Preference")}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
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
