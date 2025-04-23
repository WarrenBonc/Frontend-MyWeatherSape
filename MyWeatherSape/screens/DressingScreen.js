import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import config from "../config";

const DressingPage = () => {
  const user = useSelector((state) => state.user.value);
  const [clothes, setClothes] = useState([]);
  const [childClothes, setChildClothes] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newClothing, setNewClothing] = useState({
    label: "",
    category: "haut",
    forChild: false,
  });

  useEffect(() => {
    if (!user || !user._id) return;

    // Récupérer vêtements adulte

    
    fetch(`${config.API_BASE_URL}/api/dressing`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      console.log("Données récupérées :", data); // Ajoutez ce log
      setClothes(data.data);

    })
    
    .catch((err) => console.error("Erreur fetch vêtements :", err));
      // Récupérer vêtements enfants

    fetch(`${config.API_BASE_URL}/api/dressing?child=true`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Données récupérées pour vêtements enfants :", data); // Ajoutez ce log
        setChildClothes(data.data);})
      .catch((err) => console.error("Erreur fetch vêtements enfants :", err));
  }, []);

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

 
  // Regrouper les vêtements adultes par catégorie
  const groupedClothes = groupByCategory(clothes);

  // Transformer l'objet en tableau pour FlatList
  const groupedClothesArray = Object.entries(groupedClothes); // [ ["haut", [...]], ["bas", [...]] ]

  // Regrouper les vêtements des enfants par catégorie
const groupedChildClothes = groupByCategory(childClothes);
const groupedChildClothesArray = Object.entries(groupedChildClothes); // [ ["haut", [...]], ["bas", [...]] ]

// Ajouter un vêtement 

const GetCloth = async () =>{

  try {
    const response = await fetch(`${config.API_BASE_URL}/api/dressing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log("Données récupérées get :", data);
   
  } catch (error) {
    console.error("Erreur lors de la récupération des vêtements :", error);
  }



};

useEffect(() => {
  GetCloth();}, []);

  const handleAddClothes = () => {
    console.log("Données envoyées :", newClothing);
    if (!newClothing.label || !newClothing.category) {
      Alert.alert("Erreur", "Veuillez entrer un nom pour le vêtement.");
      return;
    }


    fetch(`${config.API_BASE_URL}/api/dressing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newClothing),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Données récupérées :", data);
      if (data && data.message === "Vêtement ajouté avec succès") {

        setClothes((prev) => [...prev, data.item]);

        
        setNewClothing({ label: "", category: "haut", forChild: false });
        setModalVisible(false);
        Alert.alert("Succès", "Vêtement ajouté avec succès !");
      } else {
        Alert.alert("Erreur", "Impossible d'ajouter le vêtement.");
      }
    })
    .catch(() => Alert.alert("Erreur", "Impossible d'ajouter le vêtement."));
};
// Fonction pour supprimer un vêtement

  const handleDelete = (id, forChild = false, childId = null) => {
     if (!id) {
       console.error("ID invalide pour la suppression :", id);
       Alert.alert("Erreur", "Impossible de supprimer le vêtement : ID invalide.");
       return;
    }

    const url = forChild
      ? `${config.API_BASE_URL}/api/dressing/${id}?childId=${childId}`
      : `${config.API_BASE_URL}/api/dressing/${id}`;

      console.log("URL de suppression :", url);

    fetch(url, {
       method: "DELETE",
       credentials: "include",
       })
      .then((res) => {
      console.log("Statut de la réponse :", res.status);
        if (!res.ok) {
          throw new Error(`Erreur HTTP : ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Réponse de l'API :", data);

        if (data.message === "Vêtement supprimé avec succès") {
          setClothes((prev) => prev.filter((item) => item._id !== id));
        Alert.alert("Succès", "Vêtement supprimé avec succès !");
      } else {
        Alert.alert("Erreur", data.message || "Impossible de supprimer le vêtement.");
      }
    })
    .catch((err) => {
      console.error("Erreur lors de la suppression :", err);
      Alert.alert("Erreur", "Impossible de supprimer le vêtement.");
    });
};

  const handleEditSubmit = (id, forChild = false, childId = null) => {
    const url = forChild
      ? `${config.API_BASE_URL}/api/dressing/${id}?childId=${childId}`
      : `${config.API_BASE_URL}/api/dressing/${id}`;

    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ label: editingLabel }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Vêtement mis à jour avec succès") {
          const updater = (prev) =>
            prev.map((item) =>
              item._id === id ? { ...item, label: editingLabel } : item
            );
          if (forChild) {
            setChildClothes(updater);
          } else {
            setClothes(updater);
          }
          setEditingItemId(null);
          Alert.alert("Succès", "Vêtement mis à jour avec succès !");
        } else {
          Alert.alert("Erreur", "Impossible de mettre à jour le vêtement.");
        }
      })
      .catch(() => Alert.alert("Erreur", "Impossible de mettre à jour le vêtement."));
  };
  const renderItem = ({ item, forChild = false}) => {
    const [category, items] = item;
    const isChildClothing = forChild;


    return (
      <View>
        <Text style={styles.categoryTitle}>
  {category.charAt(0).toUpperCase() + category.slice(1)}
</Text>
        {items.map((clothingItem, index) => (
          <View key={clothingItem._id || `${clothingItem.label}-${index}`} style={styles.card}>
            <Text style={styles.label}>{clothingItem.label}</Text>
            <TouchableOpacity
              style={styles.deleteButton} 
              onPress={() => handleDelete(clothingItem._id, isChildClothing, clothingItem.childId)}
            >
              <Icon name="times" size={20} color="#FF5C5C" /> {/* Icône croix */}
            </TouchableOpacity>
          </View>
        ))}s
      </View>
    );
  };

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <View>
            
            <Text style={styles.sectionTitle}>Ma garde robe :</Text>
            <View style={{ width: "60%", alignSelf: "center" }}>
              <LinearGradient
                colors={["#34C8E8", "#4E4AF2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.btnText}>+ Ajouter un vêtement</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        }
        data={groupedClothesArray}
        renderItem={({ item }) => renderItem({ item, forChild: false })}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.container}
      />

      <FlatList
        ListHeaderComponent={
          <View>
            <Text style={styles.sectionTitle}>Sa garde robe :</Text>
            <View style={{ width: "60%", alignSelf: "center" }}>
              <LinearGradient
                colors={["#34C8E8", "#4E4AF2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setModalVisible(true);
                    setNewClothing((prev) => ({ ...prev, forChild: true, childId: "ID_DE_L_ENFANT" }));
                  }}
                >
                  <Text style={styles.btnText}>+ Ajouter un vêtement</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        }
        data={groupedChildClothesArray}
        renderItem={({ item }) => renderItem({ item, forChild: true })}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.container}
      />

      {/* Modale pour ajouter un vêtement */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setNewClothing({ label: "", category: "haut", forChild: false });
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un vêtement</Text>
            <TextInput
              placeholder="Type de vêtement (ex: jupe, pull)"
              value={newClothing.label}
              onChangeText={(text) => setNewClothing({ ...newClothing, label: text })}
              style={styles.input}
            />

<View style={styles.dropdownContainer}>
  <Text style={styles.categoryLabel}>Catégorie :</Text>
  <TouchableOpacity
    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
    style={styles.dropdownButton}
  >
    <Text style={styles.dropdownText}>{newClothing.category}</Text>
  </TouchableOpacity>

  {showCategoryDropdown && (
    <View style={styles.dropdownList}>
      {["haut", "bas", "accessoire"].map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => {
            setNewClothing({ ...newClothing, category });
            setShowCategoryDropdown(false);
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownItemText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>

            <TouchableOpacity onPress={handleAddClothes} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 90,
    backgroundColor: "#FFFFFF",
    width: "80%"
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    
  },

  
  card: {
    width: "60%",
    marginVertical: 8,
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  badge: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Poppins-Regular",
  },
  gradientButton: {
    borderRadius: 5,
    overflow: "hidden",
    alignSelf: "flex-start",
    marginVertical: 5,
    paddingHorizontal: 0,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  input: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  categoryLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 5,
  },
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  forChildToggle: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  toggleButtonActive: {
    backgroundColor: "#4E4AF2",
  },
  toggleButtonText: {
    color: "#000",
  },
  addButton: {
    backgroundColor: "#4E4AF2",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#4E4AF2",
    fontFamily: "Poppins-SemiBold",
  },
  submitButton: {
    backgroundColor: "#4E4AF2", // Couleur de fond
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20, // Espacement avec le champ de saisie
    width: "100%",  // Pour faire occuper toute la largeur de la modale
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15, // Espacement avec le bouton Ajouter
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#4E4AF2",
    borderRadius: 5,
    width: "100%",  // Pour faire occuper toute la largeur de la modale
  },
  closeButtonText: {
    color: "#4E4AF2",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  deleteButton: {
    position: "absolute", // Positionner l'icône à l'extérieur du card
    top: 8, // Espacement par rapport au haut du card
    right: 8, // Espacement par rapport à la droite du card
    width: 20,

  },
});

export default DressingPage;