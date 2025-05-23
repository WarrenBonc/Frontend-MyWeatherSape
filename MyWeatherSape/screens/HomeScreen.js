import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { setForecast, setRecommendation } from "../reducers/weather";

import { setCity, setUser } from "../reducers/user";
import WeatherDisplay from "../components/weatherDisplay";
import PagerView from "react-native-pager-view";
import config from "../config";

import ChartDisplay from "../components/chartDisplay";

const HomePage = () => {
  const dispatch = useDispatch();
  const city = useSelector((state) => state.user.city) || "Estissac";
  const user = useSelector((state) => state.user.value);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState("");
  const [childName, setChildName] = useState("");
  const [children, setChildren] = useState([]);
  const [fetchedChildren, setFetchedChildren] = useState([]);
  const [createChild, setCreateChild] = useState(true);

  const [selectedDay, setSelectedDay] = useState(0);
  const [searchCity, setSearchCity] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const childrenOptions = [
    { label: "Garçon", value: "child1" },
    { label: "Fille", value: "child2" },
  ];

  const loadSearchHistory = async () => {
    const history = await AsyncStorage.getItem("searchHistory");
    if (history) setRecentSearches(JSON.parse(history));
    // else setRecentSearches([]); // optional
  };
  {
    /* Fonction pour charger les favoris */
  }
  const loadFavorites = async () => {
    try {
      const favs = await AsyncStorage.getItem("favorites");
      if (favs) {
        setFavorites(JSON.parse(favs));
      } else {
        setFavorites([]);
      }
    } catch (e) {
      setFavorites([]);
    }
  };
  {
    /* Fonction pour sauvegarder les favoris */
  }
  const saveFavorites = async (favArr) => {
    setFavorites(favArr);
    await AsyncStorage.setItem("favorites", JSON.stringify(favArr));
  };
  {
    /* Fonction pour ajouter/supprimer un favori */
  }
  const toggleFavorite = async (cityName) => {
    let updatedFavorites;
    if (favorites.includes(cityName)) {
      updatedFavorites = favorites.filter((fav) => fav !== cityName);
    } else {
      updatedFavorites = [
        cityName,
        ...favorites.filter((fav) => fav !== cityName),
      ];
    }
    await saveFavorites(updatedFavorites);
  };
  {
    /* Fonction pour supprimer une recherche */
  }
  const removeSearch = async (cityName) => {
    const updatedSearches = recentSearches.filter((c) => c !== cityName);
    await AsyncStorage.setItem(
      "searchHistory",
      JSON.stringify(updatedSearches)
    );
    setRecentSearches(updatedSearches);
    // Optionally also remove from favorites
    if (favorites.includes(cityName)) {
      const updatedFavorites = favorites.filter((fav) => fav !== cityName);
      await saveFavorites(updatedFavorites);
    }
  };
  {
    /* Fonction pour ajouter une recherche */
  }
  const saveSearch = async (cityName) => {
    const updatedHistory = [
      cityName,
      ...recentSearches.filter((c) => c !== cityName),
    ].slice(0, 3);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setRecentSearches(updatedHistory);
  };
  {
    /* Chargement des favoris et recherches */
  }
  useEffect(() => {
    loadSearchHistory();
    loadFavorites();
  }, []);
  const [tips, setTips] = useState("Chargement des recommandations...");

  {
    /* Fonction pour récupérer le libellé d'un jour */
  }
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
  {
    /* Fonction pour ajouter un enfant */
  }
  const handleAddChild = async () => {
    if (!childName || !selectedChild) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/users/add-child`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            include: "credentials",
          },
          body: JSON.stringify({
            firstName: childName,
            gender: selectedChild,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Enfant ajouté avec succès !");
        setChildName(""); // Réinitialiser le champ prénom
        setSelectedChild(""); // Réinitialiser le champ sexe
        setCreateChild(true); // Revenir à l'état initial

        await getChild();
      } else {
        Alert.alert("Erreur", data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'enfant :", error);
      Alert.alert("Erreur", "Impossible de communiquer avec le serveur.");
    }
  };
  {
    /* Fonction pour récupérer les enfants */
  }
  const getChild = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/users/children`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            include: "credentials",
          },
        }
      );

      const data = await response.json();
      data.children.forEach((child) => {
        console.log(`Dressing de ${child.name} :`, child.dressing);
      });
      if (response.ok) {
        setChildren(data.children); // Stocker les enfants dans l'état
      } else {
        Alert.alert("Erreur", data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des enfants :", error);
      Alert.alert("Erreur", "Impossible de communiquer avec le serveur.");
    }
  };

  // Appeler la fonction pour récupérer les enfants au chargement du composant
  useEffect(() => {
    getChild();
  }, []);
  {
    /* Fonction pour récupérer la localisation */
  }
  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la localisation est nécessaire pour déterminer votre ville."
        );
        dispatch(setCity("Paris")); // Valeur par défaut si la permission est refusée
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
        dispatch(setCity("Paris"));
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la localisation :",
        error
      );
      Alert.alert("Erreur", "Impossible de récupérer votre localisation.");
      dispatch(setCity("Paris"));
    }
  };
  {
    /* Fonction pour récupérer les recommandations pour l'utilisateur */
  }
  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/weather/recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            include: "credentials",
          },
          body: JSON.stringify({ city, dayOffset: selectedDay }),
        }
      );

      const data = await response.json();
      if (data.advice) {
        setTips(data.advice);
        dispatch(setUser(data.firstName)); // Mettre à jour l'état avec les recommandations
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

  const handleRemoveChild = async (childId) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/users/remove-child`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            include: "credentials",
          },
          body: JSON.stringify({ childId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Enfant supprimé avec succès !");
        setChildren((prevChildren) =>
          prevChildren.filter((child) => child._id !== childId)
        );
      } else {
        Alert.alert("Erreur", data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'enfant :", error);
      Alert.alert("Erreur", "Impossible de supprimer l'enfant.");
    }
  };
  {
    /* Fonction pour récupérer les recommandations pour les enfants */
  }
  const fetchChildRecommendations = async (childid) => {
    if (fetchedChildren.includes(childid)) return; // Évite les doublons

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/weather/recommendation/child`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            include: "credentials",
          },
          body: JSON.stringify({
            city,
            dayOffset: selectedDay,
            childId: childid,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.advice) {
        // Mettre à jour les recommandations pour l'enfant spécifique
        setChildren((prevChildren) =>
          prevChildren.map((child) =>
            child._id === childid
              ? { ...child, recommendation: data.advice }
              : child
          )
        );

        // Ajouter l'enfant à la liste des enfants déjà traités
        setFetchedChildren((prev) => [...prev, childid]);
      } else {
        console.error(
          "Erreur lors de la récupération des recommandations pour l'enfant :",
          data.message
        );
      }
    } catch (error) {
      console.error(
        "Erreur réseau lors de la récupération des recommandations :",
        error
      );
    }
  };
  // Effect pour récupérer les recommandations pour les enfants
  useEffect(() => {
    children.forEach((child) => {
      if (!fetchedChildren.includes(child._id)) {
        fetchChildRecommendations(child._id);
      }
    });
  }, [city, selectedDay, children]);
  // Effect pour récupérer la localisation
  useEffect(() => {
    fetchUserLocation();
  }, []);
  // Effect pour récupérer les recommandations trigger quand on change de ville ou de jour
  useEffect(() => {
    fetchRecommendations();
  }, [city, selectedDay]);

  // Réinitialiser l'affichage du dropdown lors du retour sur HomeScreen
  useFocusEffect(
    useCallback(() => {
      setShowDropdown(false);
    }, [])
  );
  {
    /* Fonction pour récupérer toutes les météo */
  }
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
  // Effect pour charger toutes les météo
  useEffect(() => {
    fetchAllWeatherData();
  }, [city]);

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <FlatList
        data={[{}]}
        keyExtractor={() => "static"}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        renderItem={() => (
          <>
            <View style={styles.header}>
              <Image
                source={require("../assets/Ellipse.png")}
                style={[styles.ellipse, styles.bottomLeft]}
                accessibilityLabel="Ellipse en bas à gauche"
                accessibilityRole="image"
              />
              {/* Ellipse Top Right */}
              <Image
                source={require("../assets/Ellipse.png")}
                style={[styles.ellipse, styles.topRight]}
                accessibilityLabel="Ellipse en haut à droite"
                accessibilityRole="image"
              />
              <Text
                style={styles.logoText}
                accessibilityLabel="Logo MyWeatherSape"
              >
                MyWeatherSape
              </Text>
              {/* Barre de recherche */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher une ville"
                  value={searchCity}
                  onChangeText={setSearchCity}
                  onSubmitEditing={async () => {
                    if (searchCity.trim() !== "") {
                      await dispatch(setCity(searchCity.trim()));
                      await fetchAllWeatherData();
                      await saveSearch(searchCity.trim());
                      setShowDropdown(false);
                    }
                  }}
                  placeholderTextColor="#999"
                  onFocus={() => setShowDropdown(true)}
                  accessibilityLabel="Champ de recherche"
                  accessibilityRole="search"
                />
                {searchCity.trim() !== "" && (
                  <TouchableOpacity
                    onPress={() => toggleFavorite(searchCity.trim())}
                    accessibilityLabel="Ajouter ou retirer des favoris"
                    accessibilityRole="button"
                  >
                    <Image
                      source={
                        favorites.includes(searchCity.trim())
                          ? require("../assets/heart_filled.png")
                          : require("../assets/heart_outline.png")
                      }
                      style={{ width: 24, height: 24, marginLeft: 10 }}
                      accessibilityLabel="Icône de cœur favoris"
                      accessibilityRole="image"
                    />
                  </TouchableOpacity>
                )}
              </View>
              {/* Liste de recherches récentes */}
              {showDropdown && recentSearches.length > 0 && (
                <ScrollView
                  style={{
                    maxHeight: 160,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                  accessibilityLabel="Liste des recherches récentes"
                  accessibilityRole="list"
                >
                  {(() => {
                    const sortedSearches = [...recentSearches].sort((a, b) => {
                      const aFav = favorites.includes(a) ? 0 : 1;
                      const bFav = favorites.includes(b) ? 0 : 1;
                      if (aFav !== bFav) return aFav - bFav;
                      return (
                        recentSearches.indexOf(a) - recentSearches.indexOf(b)
                      );
                    });
                    return sortedSearches.map((item, index) => (
                      <View
                        key={item}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 10,
                          borderBottomWidth:
                            index !== sortedSearches.length - 1 ? 1 : 0,
                          borderColor: "#ccc",
                        }}
                      >
                        <TouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            setSearchCity(item);
                            dispatch(setCity(item));
                            fetchAllWeatherData();
                            setShowDropdown(false);
                          }}
                          accessibilityLabel={`Sélectionner la ville ${item}`}
                          accessibilityRole="button"
                        >
                          <Text
                            style={{ fontSize: 16 }}
                            accessibilityLabel={item}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <TouchableOpacity
                            onPress={() => toggleFavorite(item)}
                            style={{ marginHorizontal: 6 }}
                            accessibilityLabel={`Ajouter ou retirer ${item} des favoris`}
                            accessibilityRole="button"
                          >
                            <Image
                              source={
                                favorites.includes(item)
                                  ? require("../assets/heart_filled.png")
                                  : require("../assets/heart_outline.png")
                              }
                              style={{ width: 24, height: 24 }}
                              accessibilityLabel={`Icône de cœur favoris pour ${item}`}
                              accessibilityRole="image"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => removeSearch(item)}
                            style={{ marginHorizontal: 6 }}
                            accessibilityLabel={`Supprimer ${item} de la liste`}
                            accessibilityRole="button"
                          >
                            <Image
                              source={require("../assets/trash.png")}
                              style={{ width: 24, height: 30 }}
                              accessibilityLabel={`Icône de poubelle pour ${item}`}
                              accessibilityRole="image"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ));
                  })()}
                </ScrollView>
              )}
            </View>
            {/* Sélecteur de jours */}
            <View style={styles.daySelector}>
              <Text
                style={styles.arrow}
                onPress={() =>
                  selectedDay > 0 && setSelectedDay(selectedDay - 1)
                }
                accessibilityLabel="Jour précédent"
                accessibilityRole="button"
              >
                ←
              </Text>
              <Text style={styles.date} accessibilityLabel="Jour sélectionné">
                {getLabelForDay(selectedDay)}
              </Text>
              <Text
                style={styles.arrow}
                onPress={() =>
                  selectedDay < 5 && setSelectedDay(selectedDay + 1)
                }
                accessibilityLabel="Jour suivant"
                accessibilityRole="button"
              >
                →
              </Text>
            </View>
            <View style={styles.swipercontainer}>
              {/* Premiers Widgets : metéo + chart */}
              <PagerView
                style={styles.wrapper}
                horizontal={false}
                pageMargin={10}
                onPageSelected={(e) => setCurrentSlide(e.nativeEvent.position)}
                accessibilityLabel="Swiper des widgets"
                accessibilityRole="carousel"
              >
                <View style={styles.widgetmeteo}>
                  <WeatherDisplay num={selectedDay} city={city} />
                </View>
                <View style={styles.widgetmeteo}>
                  <ChartDisplay num={selectedDay} city={city} />
                </View>
              </PagerView>
              <View style={styles.pagination}>
                <View
                  style={[styles.dot, currentSlide === 0 && styles.dotActive]}
                  accessibilityLabel="Point de pagination 1"
                  accessibilityRole="dot"
                />
                <View
                  style={[styles.dot, currentSlide === 1 && styles.dotActive]}
                  accessibilityLabel="Point de pagination 2"
                  accessibilityRole="dot"
                />
              </View>
            </View>
            <View style={styles.swipercontainer}>
              {/* Seconds Widgets : recommandations + enfants */}
              <PagerView
                style={styles.wrapper}
                horizontal={false}
                pageMargin={10}
                onPageSelected={(e) => setCurrentSlide2(e.nativeEvent.position)}
                accessibilityLabel="Swiper des widgets"
                accessibilityRole="carousel"
              >
                {/* Slide 1 : Recommandations */}
                <View style={styles.widgetTips}>
                  <Text style={styles.title}>
                    Voici nos recommandations {user} :
                  </Text>
                  <View style={styles.tipsContent}>
                    <View style={styles.display}>
                      <Image
                        source={require("../assets/tshirt.png")}
                        style={{ width: 70, height: 70 }}
                        accessibilityLabel="Icône de t-shirt"
                        accessibilityRole="image"
                      />
                    </View>

                    <ScrollView
                      style={styles.tipsScroll}
                      contentContainerStyle={styles.tipsScrollContent}
                      accessibilityLabel="Liste des recommandations"
                      accessibilityRole="list"
                    >
                      <Text style={styles.tips}>{tips}</Text>
                    </ScrollView>
                  </View>
                </View>

                {/* Slides dynamiques : Un slide par enfant */}
                {children.map((child) => (
                  <View style={styles.widgetTips} key={child._id}>
                    <Text style={styles.title}>
                      Voici nos recommandations pour {child.name} :
                    </Text>
                    <View style={styles.tipsContent}>
                      <View style={styles.display}>
                        <Image
                          source={require("../assets/tshirt.png")}
                          style={{ width: 50, height: 50 }}
                          accessibilityLabel="Icône de t-shirt pour enfant"
                          accessibilityRole="image"
                        />
                      </View>

                      <ScrollView
                        style={styles.tipsScroll}
                        contentContainerStyle={styles.tipsScrollContent}
                        accessibilityLabel={`Recommandations pour ${child.name}`}
                        accessibilityRole="list"
                      >
                        <Text style={styles.tips}>
                          {child.recommendation ||
                            "Chargement des recommandations..."}
                        </Text>
                      </ScrollView>
                    </View>
                  </View>
                ))}

                {/* Slide final : Création d'un enfant */}
                <View style={styles.widgetTips}>
                  {createChild ? (
                    //rajoute la liste des enfant avec une croix sur le coté de chaque enfant
                    <View style={{ width: "100%", height: "100%" }}>
                      <View style={styles.crossContainer}>
                        <TouchableOpacity onPress={() => setCreateChild(false)}>
                          <LinearGradient
                            colors={["#34C8E8", "#4E4AF2"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.circleCross}
                            accessibilityLabel="Fermer la création d'enfant"
                            accessibilityRole="button"
                          >
                            <Image
                              style={{ width: 30, height: 30 }}
                              source={require("../assets/cross.png")}
                            />
                          </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.crossText}>Ajouter un enfant</Text>
                      </View>
                      <View
                        style={{
                          marginTop: 70,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FlatList
                          style={{
                            width: "80%",
                            height: "90%",
                          }}
                          data={children}
                          keyExtractor={(item) => item._id}
                          renderItem={({ item }) => (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: 10,
                                backgroundColor: "#f9f9f9",
                                borderRadius: 10,
                                marginBottom: 10,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  color: "#333",
                                }}
                              >
                                {item.name} ({item.gender})
                              </Text>
                              <TouchableOpacity
                                onPress={() => handleRemoveChild(item._id)}
                              >
                                <Image
                                  source={require("../assets/cross2.png")}
                                  style={{ width: 24, height: 24 }}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        />
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{ position: "absolute", top: 20, right: 20 }}
                        onPress={() => setCreateChild(true)}
                        accessibilityLabel="Ajouter un enfant"
                        accessibilityRole="button"
                      >
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                          }}
                          source={require("../assets/cross2.png")}
                        />
                      </TouchableOpacity>
                      <TextInput
                        placeholder="Prenom"
                        style={styles.input}
                        value={childName}
                        onChangeText={setChildName}
                        accessibilityLabel="Champ de texte : Prenom"
                        accessibilityRole="text"
                      />
                      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        <LinearGradient
                          colors={["#34C8E8", "#4E4AF2"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 20,
                            width: 290,
                            alignItems: "center",
                          }}
                          accessibilityLabel="Icône de sexe"
                          accessibilityRole="image"
                        >
                          <Text style={{ color: "#fff", fontSize: 16 }}>
                            {selectedChild ? `${selectedChild}` : "Sexe"}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleAddChild}>
                        <LinearGradient
                          colors={["#34C8E8", "#4E4AF2"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 20,
                            width: 290,
                            alignItems: "center",
                          }}
                          accessibilityLabel="Bouton valider"
                          accessibilityRole="button"
                        >
                          <Text style={{ color: "#fff", fontSize: 16 }}>
                            Valider
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      {/* Modal pour sélectionner le sexe */}
                      <Modal
                        visible={isModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setIsModalVisible(false)}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          <View
                            style={{
                              width: "80%",
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              padding: 20,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginBottom: 10,
                              }}
                            >
                              Sélectionnez une option
                            </Text>
                            <FlatList
                              data={childrenOptions}
                              keyExtractor={(item) => item.value}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#ccc",
                                  }}
                                  onPress={() => {
                                    setSelectedChild(item.label);
                                    setIsModalVisible(false);
                                  }}
                                  accessibilityLabel={`Sélectionner ${item.label}`}
                                  accessibilityRole="button"
                                >
                                  <Text style={{ fontSize: 16, color: "#333" }}>
                                    {item.label}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            />
                            <TouchableOpacity
                              style={{
                                marginTop: 10,
                                alignItems: "center",
                              }}
                              onPress={() => setIsModalVisible(false)}
                              accessibilityLabel="Fermer"
                              accessibilityRole="button"
                            >
                              <Text style={{ fontSize: 16, color: "#007BFF" }}>
                                Fermer
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  )}
                </View>
              </PagerView>
              <View style={styles.pagination}>
                {/* Générer un dot pour chaque slide */}
                {[
                  ...Array(1 + children.length + 1), // 1 pour les recommandations générales, `children.length` pour les enfants, et 1 pour le slide d'ajout
                ].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentSlide2 === index && styles.dotActive, // Activer le dot correspondant au slide actuel
                    ]}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      />
    </TouchableWithoutFeedback>
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
  swipercontainer: {
    height: 260,
    position: "relative",
    width: "50%",
    borderRadius: 20,
    marginTop: 20,
  },
  display: {
    width: 110,
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
    marginTop: 30,
    paddingHorizontal: 10,
  },
  tips: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#333",
    width: "60%",
    textAlign: "left",
    paddingTop: 0,
    // le texte ne doit pas depasser, mais je veux le voir en entier
  },
  tipsScroll: {
    maxHeight: 120,
    width: "80%",
  },
  tipsScrollContent: {
    paddingVertical: 5,
  },
  ellipse: {
    position: "absolute",
    width: 700,
    height: 700,
    resizeMode: "contain",
  },
  bottomLeft: {
    bottom: -280,
    left: -70,
  },
  topRight: {
    top: 280,
    right: -100,
  },
  circleCross: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  crossContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  crossText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins",

    paddingBottom: 10,
  },
  input: {
    width: "80%",
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#333",
    marginTop: 60,
  },
});

export default HomePage;
