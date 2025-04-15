import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Questionnaire = () => {
  const [question, setQuestion] = useState(0);
  const [reponse, setReponse] = useState("");
  const [reponseTotal, setReponseTotal] = useState([]);

  const totalQuestions = 3; // Nombre total de questions

  const questions = [
    {
      text: "Selectionnez votre sexe :",
      options: ["Homme", "Femme"],
    },
    {
      text: "Votre sensibilité aux températures :",
      options: [
        "Frileux",
        "Sensible au froid",
        "Neutre",
        "Le froid ne me dérange pas trop",
        "J’ai vite chaud",
        "Résistant au froid",
      ],
    },
    {
      text: "Accessoires préférés :",
      options: [
        "Casquette / Bonnet",
        "Écharpe",
        "Gants",
        "Sac à dos",
        "Lunettes de soleil",
      ],
    },
    {
      text: "Fréquence des recommandations :",
      options: [
        "Une tenue par jour",
        "Une tenue seulement si la météo change beaucoup",
        "Plusieurs suggestions pour choisir",
      ],
    },
  ];

  const handleNextQuestion = () => {
    if (question < totalQuestions - 1) {
      setReponseTotal([...reponseTotal, reponse]);
      setQuestion(question + 1);
      setReponse(""); // Réinitialise la réponse pour la prochaine question
    } else {
      setReponseTotal([...reponseTotal, reponse]);
      console.log("Questionnaire terminé :", reponseTotal);
      // Ajoutez ici la logique pour terminer le questionnaire
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Topsection}>
        <Text style={styles.title}>
          Question {question + 1} sur {totalQuestions}
        </Text>
        {/* Barre de progression */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progress,
              { width: `${((question + 1) / totalQuestions) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questions[question].text}</Text>
        {questions[question].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              reponse === option && styles.selectedOptionButton,
            ]}
            onPress={() => setReponse(option)}
          >
            <Text
              style={[
                styles.optionText,
                reponse === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.Btnsection}>
        <TouchableOpacity
          onPress={handleNextQuestion}
          disabled={!reponse} // Désactive le bouton si aucune réponse n'est sélectionnée
          style={[
            styles.nextButton,
            !reponse && styles.disabledNextButton, // Applique le style gris si désactivé
          ]}
        >
          <Text style={styles.nextButtonText}>
            {question < totalQuestions - 1 ? "Continuer" : "Terminer"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginTop: 65,
    paddingHorizontal: 20,
  },
  Topsection: {
    width: "100%",
    height: 100,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  progressBar: {
    width: "80%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#4E4AF2",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    width: "80%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedOptionButton: {
    backgroundColor: "#34C8E8",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#4E4AF2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
  },
  disabledNextButton: {
    backgroundColor: "#cccccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  questionContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  Btnsection: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Questionnaire;
