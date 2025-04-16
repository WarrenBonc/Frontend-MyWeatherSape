import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import { setForecast, setRecommendation } from "../reducers/weather";
import WeatherDisplay from "../components/weatherDisplay";
import PagerView from "react-native-pager-view";

import ChartDisplay from "../components/chartDisplay";

const HomePage = () => {
  const dispatch = useDispatch();
  const city = useSelector((state) => state.weather.city) || "Estissac";

  const [currentSlide, setCurrentSlide] = useState(0);

  const [selectedDay, setSelectedDay] = useState(0);
  const [searchCity, setSearchCity] = useState(city);
  const getLabelForDay = (dayOffset) => {
    const labels = ["Aujourd’hui", "Demain", "Jour 3", "Jour 4", "Jour 5"];
    return labels[dayOffset] || `Jour ${dayOffset + 1}`;
  };

  const fetchAllWeatherData = async () => {
    try {
      // On fait une requête à l'API pour récupérer les données météo
      const fetchData = await fetch(
        `${API_BASE_URL}/api/weather/7days-hourly/${city}`
      );

      if (!fetchData.ok) {
        throw new Error(`Erreur HTTP : ${fetchData.status}`);
      }

      const weatherData = await fetchData.json();

      // Vérification de la structure des données
      if (!weatherData || !weatherData.forecast) {
        throw new Error("Données météo invalides ou manquantes");
      }

      console.log("Structure des données météo :", weatherData); // Affichage des données pour examen

      // Trier les jours en fonction de la date (du plus proche au plus éloigné)
      const sortedDays = Object.keys(weatherData.forecast).sort((a, b) => {
        return new Date(a) - new Date(b); // Compare les dates
      });

      // Affichage des jours triés
      console.log("Jours triés :", sortedDays);

      // Création de la structure pour les jours et les heures
      const dailyData = sortedDays.map((day) => {
        return {
          date: day,
          condition: weatherData.forecast[day].condition,
          temperature:
            weatherData.forecast[day].hours[0]?.temperature ||
            "Données non disponibles",
          feels_like:
            weatherData.forecast[day].hours[0]?.feels_like ||
            "Données non disponibles",
          hours: weatherData.forecast[day].hours.map((hourData) => ({
            temperature: hourData.temperature,
            feels_like: hourData.feels_like,
            hour: hourData.hour,
          })),
        };
      });
      console.log("Structure des données météo :", dailyData[0].condition);
      // Exemple de recommandation spécifique
      const recommendation = { advice: "Restez au chaud!" };

      // On envoie les données globales de tous les jours dans Redux
      // Action pour les conditions des 7 jours avec températures et ressentis
      dispatch(setForecast(dailyData)); // Action pour la prévision des 7 jours avec heures
      dispatch(setRecommendation(recommendation.advice)); // Action pour les recommandations
    } catch (error) {
      console.error("Erreur météo :", error.message);
    }
  };

  useEffect(() => {
    fetchAllWeatherData();
  }, [city]);

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
          onPress={() => selectedDay < 5 && setSelectedDay(selectedDay + 1)}
        >
          →
        </Text>
      </View>
      {/* Ville et météo actuelle */}
      <View style={styles.swipercontainer}>
        <PagerView style={styles.wrapper} horizontal={false} pageMargin={10}>
          <View style={styles.widgetmeteo}>
            <WeatherDisplay num={selectedDay} city={city} />
          </View>
          <View style={styles.widgetmeteo}>
            <ChartDisplay num={selectedDay} city={city} />
          </View>
        </PagerView>
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
    backgroundColor: "#F3F4F6",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 10,
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
    backgroundColor: "#fff",
    flexDirection: "column",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  widgetTips: {
    height: 240,
    backgroundColor: "#ffff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  wrapper: {
    height: "100%",
    width: "205%",
    display: "flex",
    borderRadius: 20,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  swipercontainer: {
    height: 260,
    width: "50%",
    borderRadius: 20,
    marginTop: 20,
  },
});

export default HomePage;
