import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { LineChart } from "react-native-chart-kit"; // Assure-toi que tu utilises bien ce package

const WeatherDisplay = ({ num }) => {
  const forecast = useSelector((state) => state.weather.forecast);

  if (!forecast || forecast.length === 0) {
    return <Text>Chargement des données météo...</Text>;
  }

  const currentDay = forecast[num];

  if (!currentDay || !currentDay.hours) {
    return <Text>Données horaires non disponibles</Text>;
  }

  // Filtrer les heures spécifiques (0h, 6h, 12h, 18h)
  const filteredHours = currentDay.hours.filter((hourObj, index) => {
    return index === 0 || index === 6 || index === 12 || index === 18;
  });

  // Préparer les données du graphique
  const chartData = filteredHours.map((hourObj, index) => ({
    temperature: hourObj.temperature,
    label: `${index * 6}h`, // Afficher 0h, 6h, 12h, 18h
  }));

  // Données pour le graphique
  const data = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        data: chartData.map((item) => item.temperature),
        color: (opacity = 1) => `rgba(76,158,241, ${opacity})`, // Couleur de la ligne
        strokeWidth: 3, // Épaisseur de la ligne
      },
    ],
  };

  // Configuration du graphique
  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1, // Nombre de décimales
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Couleur du texte
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Couleur des labels
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4", // Rayon des points plus petits
      strokeWidth: "2",
      stroke: "#4c9ef1",
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prévisions météo</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={320}
          height={180}
          chartConfig={chartConfig}
          bezier
          withInnerLines={true}
          withOuterLines={true}
          formatYLabel={(yValue) => `${yValue}°`} // << Ajouté ici
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",

    height: 200, // Ajuster la taille totale du conteneur
    width: 270,
  },
  title: {
    fontSize: 16, // Taille du titre plus petite
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  chartContainer: {
    alignItems: "center", // Centrer le graphique
    justifyContent: "center",
    marginRight: 20,
    // Espacement autour du graphique
  },
});

export default WeatherDisplay;
