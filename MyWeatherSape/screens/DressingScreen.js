import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";
import config from "../config";
import { LinearGradient } from "expo-linear-gradient";

const DressingPage = () => {
  const [clothingItems, setClothingItems] = useState([]);
  const [children, setChildren] = useState([]);
  const [activePerson, setActivePerson] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newClothing, setNewClothing] = useState({
    label: "",
    category: "",
    forChild: false,
    childId: null,
  });
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const categories = [
    { label: "Haut", value: "Haut" },
    { label: "Bas", value: "Bas" },
    { label: "Accessoire", value: "Accessoire" },
    { label: "Chaussure", value: "Chaussure" },
  ];

  // Fonction pour regrouper les vêtements par catégorie
  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  // Fonction pour récupérer les vêtements
  const fetchDressing = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/dressing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          include: "credentials",
        },
      });

      const data = await response.json();
      if (data) {
        setClothingItems(data.data);
        setChildren(data.children);
      }
    } catch (error) {
      console.error("Error fetching dressing items:", error);
    }
  };

  // Fonction pour ajouter un vêtement
  const handleAddClothing = async (cloth) => {
    if (!cloth.label.trim()) {
      alert("Veuillez entrer un nom pour le vêtement.");
      return;
    }
    if (!cloth.category) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/dressing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          include: "credentials",
        },
        body: JSON.stringify(cloth),
      });

      const data = await response.json();
      console.log(data);
      fetchDressing();
      closeModal();
    } catch (error) {
      console.error("Error adding clothing item:", error);
    }
  };

  // Fonction pour supprimer un vêtement
  const handleDeleteClothing = async (
    clothingId,
    forChild = false,
    childId = null
  ) => {
    try {
      await fetch(`${config.API_BASE_URL}/api/dressing`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          include: "credentials",
        },
        body: JSON.stringify({ clothingId, childId, forChild }),
      });

      fetchDressing();
    } catch (error) {
      console.error("Error deleting clothing item:", error);
    }
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setModalVisible(false);
    setActivePerson(null);
    setNewClothing({
      label: "",
      category: "",
      forChild: false,
      childId: null,
    });
  };

  // Fonction pour ouvrir le modal
  const openModal = (person, childId, forChild) => {
    setModalVisible(true);
    setActivePerson(person);
    setNewClothing({
      label: "",
      category: "",
      forChild: forChild,
      childId: childId,
    });
  };

  // Effect pour récupérer les vêtements au montage
  useEffect(() => {
    fetchDressing();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Dressing</Text>
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
      {/* Dressing principal */}
      <View>
        <Text style={styles.sectionTitle}>Ma Garde-robe</Text>
        <TouchableOpacity
          onPress={() => openModal("Utilisateur principal", null, false)}
          accessibilityLabel="Ajouter un vêtement"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={["#34C8E8", "#4E4AF2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.addClothText}>Ajouter un vêtement</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* Liste des vêtements par catégorie de l'utilisateur principal */}
        {Object.entries(groupByCategory(clothingItems)).map(
          ([category, items]) => (
            <View key={category}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {items.map((item) => (
                <View style={styles.card} key={item._id}>
                  <Text style={{ color: "black" }}>{item.label}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteClothing(item._id)}
                    accessibilityLabel="Supprimer"
                    accessibilityRole="button"
                  >
                    <Icon
                      name="times"
                      size={20}
                      color="#FF5C5C"
                      style={{ marginLeft: 5 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.separator} />
            </View>
          )
        )}
      </View>

      {/* Dressing des enfants */}
      {children.map((child) => (
        <View key={child._id}>
          <Text style={styles.sectionTitle}>Garde-robe de {child.name}</Text>
          <TouchableOpacity
            onPress={() => openModal(child.name, child._id, true)}
            accessibilityLabel="Ajouter un vêtement pour enfant"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={["#34C8E8", "#4E4AF2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.addClothText}>
                Ajouter un vêtement pour {child.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {Object.entries(groupByCategory(child.dressing)).map(
            ([category, items]) => (
              <View key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {items.map((item) => (
                  <View style={styles.card} key={item._id}>
                    <Text style={{ color: "black" }}>{item.label}</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        handleDeleteClothing(item._id, true, child._id)
                      }
                      accessibilityLabel="Supprimer"
                      accessibilityRole="button"
                    >
                      <Icon name="times" size={20} color="#FF5C5C" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )
          )}
        </View>
      ))}

      {/* Modal pour ajouter un vêtement */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Ajouter un vêtement pour {activePerson || "Utilisateur"}
            </Text>
            <TextInput
              placeholder="Nom du vêtement"
              placeholderTextColor={"#999"}
              value={newClothing.label}
              onChangeText={(text) =>
                setNewClothing({ ...newClothing, label: text })
              }
              style={styles.input}
              accessibilityLabel="Nom du vêtement"
              accessibilityRole="text"
            />
            <View style={styles.dropdownContainer}>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={categories}
                labelField="label"
                valueField="value"
                placeholder="Sélectionnez une catégorie"
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setValue(item.value);
                  setNewClothing({ ...newClothing, category: item.value });
                }}
                accessibilityLabel="Catégorie"
                accessibilityRole="button"
              />
            </View>
            <TouchableOpacity
              onPress={() => handleAddClothing(newClothing)}
              accessibilityLabel="Ajouter"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={["#34C8E8", "#4E4AF2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.submitButtonText}>Ajouter</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 90,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 0,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  card: {
    width: "70%",
    alignContent: "center",
    marginVertical: 8,
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    width: "60%",
    textAlign: "center",
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    marginBottom: 5,
    backgroundColor: "#FFFBFB",
    width: "80%",
    textAlign: "center",
    padding: 10,
  },
  dropdown: {
    margin: 16,
    height: 50,
    width: 220,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  submitButton: {
    backgroundColor: "#4E4AF2",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#FF5C5C",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  ellipse: {
    position: "absolute",
    width: 700,
    height: 700,
    resizeMode: "contain",
  },
  bottomLeft: {
    bottom: 40,
    left: -70,
  },
  topRight: {
    top: 280,
    right: -100,
  },
  addClothText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  gradientButton: {
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: 237,
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#222",
    marginBottom: 20,
    marginTop: -30,
  },
});

export default DressingPage;
