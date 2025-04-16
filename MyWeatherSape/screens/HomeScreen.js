import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import {
  setCurrentWeather,
  setTodayWeather,
  setForecast,
  setRecommendation,
} from "../reducers/weather";

const HomePage = () => {
  const dispatch = useDispatch();

  const [selectedDay, setSelectedDay] = useState(0);
  const [searchCity, setSearchCity] = useState(city);
  const getLabelForDay = (dayOffset) => {
    const labels = ["Aujourd’hui", "Demain", "Jour 3", "Jour 4", "Jour 5"];
    return labels[dayOffset] || `Jour ${dayOffset + 1}`;
  };

  // On récupère les infos utilisateur et ville depuis Redux
  const userToken = useSelector((state) => state.user.token);
  const city = useSelector((state) => state.user.city) || "Paris";

  // On récupère les données météo depuis Redux
  // const current = useSelector((state) => state.weather.current);
  // const today = useSelector((state) => state.weather.today) || []; // Par défaut, tableau vide
  // const forecast = useSelector((state) => state.weather.forecast) || []; // Par défaut, tableau vide
  // const recommendation = useSelector((state) => state.weather.recommendation);
  // console.log("📍 Ville sélectionnée :", city);
  // console.log("🧑‍💻 Token utilisateur :", userToken);
  // console.log("🌡️ Météo actuelle :", current);
  // console.log("🕓 Météo heure par heure :", today);
  // console.log("📆 Prévisions des jours suivants :", forecast);
  // console.log("🧥 Recommandation IA :", recommendation);

  // Fonction qui fetch toutes les données météo depuis le backend
  // const fetchAllWeatherData = async () => {
  //   if (!userToken || !city) return;

  //   try {
  //     const [currentRes, forecastRes, aiRes] = await Promise.all([
  //       fetch(`http://192.168.0.44:3000/api/weather?city=${city}`),
  //       fetch(
  //         `http://192.168.0.44:3000/api/weather/forecast?city=${city}&days=5`
  //       ),
  //       fetch(`http://192.168.0.44:3000/api/weather/recommendation`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ userToken, city }),
  //       }),
  //     ]);

  //     const current = await currentRes.json();
  //     const forecast = await forecastRes.json();
  //     const recommendation = await aiRes.json();

  //     // On envoie les données dans Redux
  //     dispatch(setCurrentWeather(current));
  //     dispatch(setForecast(forecast.forecast));
  //     dispatch(setRecommendation(recommendation.advice));
  //   } catch (error) {
  //     console.error("Erreur météo :", error.message);
  //   }
  // };

  const fetchAllWeatherData = async () => {
    try {
      const fetchedData = await fetch(
        `http://192.168.0.44:3000/api/weather?city=${city}`
      );
      const data = await fetchedData.json();
      console.log("data", data);
    } catch (error) {}
  };

  fetchAllWeatherData();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>MyWeatherSape</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ville"
            value={searchCity}
            onChangeText={setSearchCity}
            onSubmitEditing={() => {
              dispatch({ type: "user/setCity", payload: searchCity });
            }}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      {/* Sélecteur de jour */}
      <View style={styles.daySelector}>
        <Text
          style={styles.arrow}
          onPress={() => selectedDay > 0 && setSelectedDay(selectedDay - 1)}
        >
          ←
        </Text>
        <Text style={styles.date}>{getLabelForDay(selectedDay)}</Text>
        <Text
          style={styles.arrow}
          onPress={() => selectedDay < 4 && setSelectedDay(selectedDay + 1)}
        >
          →
        </Text>
      </View>
      {/* Ville et météo actuelle */}
      <View style={styles.widgetmeteo}>
        <View style={styles.pagination}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
        </View>
      </View>
      {/* Recommandation IA */}
      <View style={styles.widgetTips}>
        <View style={styles.pagination}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "left",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#222",
  },
  city: {
    fontSize: 32,
    marginTop: 10,
    fontWeight: "300",
    fontFamily: "Poppins",
    textAlign: "center",
    marginBottom: 4,
  },
  temp: {
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Poppins",
    textAlign: "center",
  },
  feelsLike: {
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "center",
    color: "#444",
    marginBottom: 20,
  },
  condition: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins",
    color: "#666",
    marginBottom: 20,
  },
  advice: {
    fontSize: 18,
    fontFamily: "Poppins",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 20,
  },
  block: {
    marginVertical: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  hourCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    width: 80,
  },
  hour: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  tempHour: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    fontFamily: "Poppins",
  },
  conditionHour: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  tag: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#555",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  daySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  arrow: {
    fontSize: 22,
    color: "#444",
    fontFamily: "Poppins",
  },
  date: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#333",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    marginHorizontal: 4,
  },
  widgetmeteo: {
    height: 240,
    backgroundColor: "gray",
    flexDirection: "column",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  widgetTips: {
    height: 240,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default HomePage;
