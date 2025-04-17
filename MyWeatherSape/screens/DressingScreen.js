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
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import config from "../config";

const DressingPage = () => {
  const user = useSelector((state) => state.user.value);
  const [clothes, setClothes] = useState([]);
  const [childClothes, setChildClothes] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    console.log("🧥 DressingPage monté");
    console.log("👤 Utilisateur courant :", user);
    if (!user || !user._id) return;

    // Récupérer vêtements utilisateur
    fetch(`${config.API_BASE_URL}/api/dressing`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setClothes(data.clothingItems))
      .catch((err) => console.error("Erreur fetch vêtements :", err));

    // Récupérer vêtements enfants
    fetch(`${config.API_BASE_URL}/api/dressing/child`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setChildClothes(data.clothingItems))
      .catch((err) => console.error("Erreur fetch vêtements enfants :", err));
  }, [user]);

  const handleDelete = (id) => {
    fetch(`${config.API_BASE_URL}/api/delete-clothes/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setClothes((prev) => prev.filter((item) => item._id !== id));
        setChildClothes((prev) => prev.filter((item) => item._id !== id));
      })
      .catch((err) => Alert.alert("Erreur", "Suppression échouée."));
  };

  const handleAddClothes = () => {
    console.log("🧵 handleAddClothes appelé");
    if (!user || !user._id) {
      console.warn("⚠️ Pas d’utilisateur connecté");
      return;
    }
    // Création du vêtement sans userId dans le corps
    const newItem = {
      label: "Nouveau vêtement",
      category: "haut",
      season: "été",
    };
    fetch(`${config.API_BASE_URL}/api/add-clothes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Vêtement adulte ajouté :", data);
        // Re-fetch les vêtements...
        fetch(`${config.API_BASE_URL}/api/dressing`, { credentials: "include" })
          .then((res) => res.json())
          .then((data) => setClothes(data.clothingItems));
        setEditingItemId(null);
        setEditingLabel("");
      })
      .catch((err) => {
        console.error("Erreur ajout vêtement :", err);
        Alert.alert("Erreur", "Impossible d’ajouter le vêtement adulte.");
      });
  };

  const handleAddChildClothes = () => {
    console.log("🧒 handleAddChildClothes appelé");
    if (!user || !user._id) {
      console.warn("⚠️ Pas d’utilisateur connecté");
      return;
    }
    // Création du vêtement enfant sans userId dans le corps
    const newItem = {
      label: "Vêtement enfant",
      category: "bas",
      season: "hiver",
    };
    fetch(`${config.API_BASE_URL}/api/add-child-clothes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Vêtement enfant ajouté :", data);
        // Re-fetch...
        fetch(`${config.API_BASE_URL}/api/dressing/child`, { credentials: "include" })
          .then((res) => res.json())
          .then((data) => setChildClothes(data.clothingItems))
          .catch((err) => console.error("Erreur rechargement vêtements enfant :", err));
        setEditingItemId(null);
        setEditingLabel("");
      })
      .catch((err) => {
        console.error("Erreur ajout vêtement enfant :", err);
        Alert.alert("Erreur", "Impossible d’ajouter le vêtement enfant.");
      });
  };

  const handleEditSubmit = (id) => {
    fetch(`${config.API_BASE_URL}/api/edit-clothes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editingLabel }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setClothes((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, label: editingLabel } : item
          )
        );
        setChildClothes((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, label: editingLabel } : item
          )
        );
        setEditingItemId(null);
      })
      .catch((err) => Alert.alert("Erreur", "Échec de la modification"));
  };

  const renderItem = ({ item }) => {
    console.log("👕 Affichage vêtement :", item.label);
    return (
      <View style={styles.card}>
        {editingItemId === item._id ? (
          <TextInput
            style={styles.input}
            value={editingLabel}
            onChangeText={setEditingLabel}
            onSubmitEditing={() => handleEditSubmit(item._id)}
            onBlur={() => setEditingItemId(null)}
            autoFocus
          />
        ) : (
          <Text style={styles.label}>{item.label}</Text>
        )}
        <Text style={styles.badge}>Catégorie : {item.category}</Text>
        <Text style={styles.badge}>Saison : {item.season}</Text>
        <View style={styles.actions}>
          <LinearGradient
            colors={["#34C8E8", "#4E4AF2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              onPress={() => {
                setEditingItemId(item._id);
                setEditingLabel(item.label);
              }}
              style={styles.button}
            >
              <Text style={styles.btnText}>Modifier</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={["#34C8E8", "#4E4AF2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              style={styles.button}
            >
              <Text style={styles.btnText}>Supprimer</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <Text style={styles.pageTitle}>Dressing</Text>
          <Text style={styles.sectionTitle}>Mon dressing :</Text>
          <View style={{ width: "60%", alignSelf: "flex-start" }}>
            <LinearGradient
              colors={["#34C8E8", "#4E4AF2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddClothes}
              >
                <Text style={styles.btnText}>+ Ajouter un vêtement</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View style={styles.list}>
            {clothes.map((item) => renderItem({ item }))}
          </View>
          <Text style={styles.sectionTitle}>🧒 Vêtements enfants</Text>
          <View style={{ width: "60%", alignSelf: "flex-start" }}>
            <LinearGradient
              colors={["#34C8E8", "#4E4AF2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddChildClothes}
              >
                <Text style={styles.btnText}>+ Ajouter un vêtement enfant</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      }
      data={childClothes}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      horizontal={false}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins-SemiBold",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#222",
    marginBottom: 20,
    marginTop: -30,
  },
  list: {
    gap: 10,
  },
  card: {
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
});

export default DressingPage;
