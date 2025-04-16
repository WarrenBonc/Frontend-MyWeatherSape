import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const WeatherDisplay = ({ num, city }) => {
  const forecast = useSelector((state) => state.weather.forecast);

  if (!forecast || forecast.length === 0) {
    return <Text>Chargement des données météo...</Text>;
  }

  const currentDay = forecast[num];

  if (!currentDay) {
    return <Text>Jour non trouvé</Text>;
  }

  const { date, temperature, feels_like, condition } = currentDay;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{city}</Text>
      <Text style={styles.temp}>{temperature}°C</Text>
      <Text style={styles.text}>Ressenti : {feels_like}°C</Text>
      <Text style={styles.text}>{condition}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,

    borderRadius: 8,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  temp: {
    fontSize: 54,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default WeatherDisplay;
