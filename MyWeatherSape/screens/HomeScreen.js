import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { setForecast, setRecommendation } from "../reducers/weather";
import { setCity } from "../reducers/user";
import WeatherDisplay from "../components/weatherDisplay";
import PagerView from "react-native-pager-view";
import config from "../config";

import ChartDisplay from "../components/chartDisplay";

const HomePage = () => {
  const dispatch = useDispatch();
  const city = useSelector((state) => state.user.city) || "Estissac";
  const userToken = useSelector((state) => state.user.token); // Récupérer le token utilisateur depuis Redux

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);

  const [selectedDay, setSelectedDay] = useState(0);
  const [searchCity, setSearchCity] = useState("");
  const [tips, setTips] = useState("Chargement des recommandations...");

  const getLabelForDay = (dayOffset) => {
    const daysOfWeek = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayOffset);

    const dayName = daysOfWeek[targetDate.getDay()];
    const day = targetDate.getDate();
    const monthName = months[targetDate.getMonth()];

    return `${dayName} ${day} ${monthName}`;
  };

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la localisation est nécessaire pour déterminer votre ville."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const geoData = await geoRes.json();
      const userCity =
        geoData.address?.city ||
        geoData.address?.town ||
        geoData.address?.village;

      if (userCity) {
        dispatch(setCity(userCity));
      } else {
        Alert.alert("Erreur", "Impossible de déterminer votre ville.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la localisation :",
        error
      );
      Alert.alert("Erreur", "Impossible de récupérer votre localisation.");
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/weather/recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`, // Inclure le token JWT
          },
          body: JSON.stringify({ city, dayOffset: selectedDay }),
        }
      );

      const data = await response.json();
      if (data.advice) {
        setTips(data.advice); // Mettre à jour l'état avec les recommandations
      } else {
        console.error(
          "Erreur lors de la récupération des recommandations :",
          data.message
        );
        setTips("Impossible de charger les recommandations.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setTips("Erreur réseau. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [city, selectedDay]);

  const fetchAllWeatherData = async () => {
    try {
      const fetchData = await fetch(
        `${config.API_BASE_URL}/api/weather/7days-hourly/${city}`
      );

      if (!fetchData.ok) {
        throw new Error(`Erreur HTTP : ${fetchData.status}`);
      }

      const weatherData = await fetchData.json();

      if (!weatherData || !weatherData.forecast) {
        throw new Error("Données météo invalides ou manquantes");
      }

      const sortedDays = Object.keys(weatherData.forecast).sort((a, b) => {
        return new Date(a) - new Date(b);
      });

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

      const recommendation = { advice: "Restez au chaud!" };

      dispatch(setForecast(dailyData));
      dispatch(setRecommendation(recommendation.advice));
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
              if (searchCity !== city) {
                dispatch(setCity(searchCity));
                fetchAllWeatherData();
              }
            }}
            placeholderTextColor="#999"
          />
        </View>
      </View>
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
      <View style={styles.swipercontainer}>
        <PagerView
          style={styles.wrapper}
          horizontal={false}
          pageMargin={10}
          onPageSelected={(e) => setCurrentSlide(e.nativeEvent.position)}
        >
          <View style={styles.widgetmeteo}>
            <WeatherDisplay num={selectedDay} city={city} />
          </View>
          <View style={styles.widgetmeteo}>
            <ChartDisplay num={selectedDay} city={city} />
          </View>
        </PagerView>
        <View style={styles.pagination}>
          <View style={[styles.dot, currentSlide === 0 && styles.dotActive]} />
          <View style={[styles.dot, currentSlide === 1 && styles.dotActive]} />
        </View>
      </View>
      <View style={styles.swipercontainer}>
        <PagerView
          style={styles.wrapper}
          horizontal={false}
          pageMargin={10}
          onPageSelected={(e) => setCurrentSlide2(e.nativeEvent.position)}
        >
          <View style={styles.widgetTips}>
            <Text style={styles.title}>Voici nos recommandations :</Text>
            <View style={styles.tipsContent}>
              <View style={styles.display}>
                <Image
                  source={require("../assets/tshirt.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>

              <Text style={styles.tips}>{tips}</Text>
            </View>
          </View>
          <View style={styles.widgetTips}></View>
        </PagerView>
        <View style={styles.pagination}>
          <View style={[styles.dot, currentSlide2 === 0 && styles.dotActive]} />
          <View style={[styles.dot, currentSlide2 === 1 && styles.dotActive]} />
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
    gap: 0,
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
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 0,
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
    marginBottom: 0,
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
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    top: 230,
    left: 93,
    right: 0,
    width: "100%",
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
    paddingBottom: 30,
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
  wrappers: {
    height: "60%",
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
    position: "relative",
    width: "50%",
    borderRadius: 20,
    marginTop: 20,
  },
  display: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  tipsContent: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  tips: {
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#333",
    width: "60%",
    height: 90,
    textAlign: "left",
    paddingTop: 10,

    // le texte ne doit pas depasser, mais je veux le voir en entier
  },
});

export default HomePage;
