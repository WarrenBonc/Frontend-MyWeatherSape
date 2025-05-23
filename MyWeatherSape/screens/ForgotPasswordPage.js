import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import config from "../config";

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSendResetLink = () => {
    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);
    setError("");

    fetch(`${config.API_BASE_URL}/api/users/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setSuccess(true);
        } else {
          setError(data.error || "Une erreur est survenue.");
        }
      })
      .catch(() => setError("Erreur réseau."))
      .finally(() => setLoading(false));
  };
  // fonction pour gérer l'envoi du code de réinitialisation
  const SendCode = async () => {
    if (!code) {
      setError("Veuillez entrer le code de verification.");

      return;
    }

    // Remove any leading or trailing whitespace

    const response = await fetch(
      `${config.API_BASE_URL}/api/users/verify-code`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }
    );

    const data = await response.json();

    if (data.result) {
      setSuccess(true);
      navigation.navigate("ResetPassword");
      return;
    } else {
      setError(data.error || "Une erreur est survenue.");
    }
  };

  if (!success) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mot de passe oublié</Text>
        <Text style={styles.text}>
          Saisis ton adresse email pour recevoir un code de verification.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Champ email"
          accessibilityHint="Entrez votre adresse email"
          accessibilityRole="champ email"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSendResetLink}>
          <Text style={styles.buttonText}>
            {loading ? "Envoi..." : "Envoyer le lien"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Entrer le code de verification</Text>
        <Text style={styles.text}>
          Saisis ton code de verification pour réinitialiser ton mot de passe.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Code de verification"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
          accessibilityLabel="Champ code de verification"
          accessibilityHint="Entrez le code de verification"
          accessibilityRole="champ code de verification"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={SendCode}>
          <Text style={styles.buttonText}>
            {loading ? "Envoi..." : "Envoyer le lien"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 14, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4E4AF2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  error: { color: "red", marginTop: 10 },
});

export default ForgotPasswordPage;
