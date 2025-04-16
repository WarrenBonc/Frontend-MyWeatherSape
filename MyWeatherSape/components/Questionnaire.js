import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Questionnaire = ({ navigation }) => {
  const [question, setQuestion] = useState(0);
  const [reponse, setReponse] = useState("");
  const [reponseTotal, setReponseTotal] = useState([]);
  const progressAnim = useRef(new Animated.Value(0)).current; // Animation pour la barre de progression

  const totalQuestions = 4; // Nombre total de questions

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
        "Aucun",
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
      // Ajoutez la dernière réponse directement dans une copie locale
      const finalResponses = [...reponseTotal, reponse];
      setReponseTotal(finalResponses);
      console.log("Questionnaire terminé :", finalResponses);

      // Redirige vers la page d'accueil
      navigation.navigate("MainTabs");
    }
  };

  // Animation de la barre de progression
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (question + 1) / totalQuestions, // Proportion de progression
      duration: 500, // Durée de l'animation
      useNativeDriver: false, // Nécessaire pour les animations de style
    }).start();
  }, [question]);

  return (
    <View style={styles.container}>
      <View style={styles.Topsection}>
        {/* Affiche le titre de la question */}
        <Text style={styles.title}>{questions[question].text}</Text>
        {/* Barre de progression */}
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progress,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.questionContainer}>
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
        <LinearGradient
          colors={reponse ? ["#34C8E8", "#4E4AF2"] : ["#cccccc", "#cccccc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.99]}
          style={[styles.button, !reponse && styles.disabledNextButton]}
        >
          <TouchableOpacity
            style={styles.buttonContent}
            onPress={handleNextQuestion}
            disabled={!reponse}
          >
            <Text style={styles.nextButtonText}>
              {question < totalQuestions - 1 ? "Continuer" : "Terminer"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
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
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    textAlign: "center",
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
    backgroundColor: "blue",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedOptionButton: {
    backgroundColor: "green",
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
    height: 400,
    alignItems: "center",
    marginBottom: 20,
  },
  Btnsection: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Questionnaire;
