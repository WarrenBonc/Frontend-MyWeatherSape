import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    value: null, // Stocke les infos de l'utilisateur connecté (nom, email, etc.)
    token: null, // Stocke le token d'authentification
    city: "Paris", // Ville sélectionnée ou détectée par défaut
    isAuthenticated: false, // Indique si l'utilisateur est authentifié
    loading: false, // Indique si une requête est en cours (chargement global)
    error: null, // Stocke une éventuelle erreur d'authentification ou de requête

    // Paramètres de notifications
    notifications: {
      enabled: true, // Si l'utilisateur a activé les notifications
      frequency: "morning", // Moment de réception des notifications ("morning", "weekly", etc.)
    },

    // Préférences issues du questionnaire initial (ajouté récemment)
    preferences: {
      gender: null,
      sensitivity: null,
      accessories: [], // Liste d'accessoires cochés : ["bonnet", "gants"]
      recommendationFrequency: null,
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload; // Met à jour les infos utilisateur
    },
    updateUser: (state, action) => {
      // Met à jour des champs spécifiques de l'utilisateur (utilisé dans EditProfile)
      state.value.firstName = action.payload.firstName;
      state.value.email = action.payload.email;
    },
    setToken: (state, action) => {
      state.token = action.payload; // Stocke le token JWT
      state.isAuthenticated = true; // Marque l'utilisateur comme connecté
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Active/désactive le mode chargement global
    },
    setError: (state, action) => {
      state.error = action.payload; // Enregistre une erreur
    },
    updateNotifications: (state, action) => {
      state.notifications = action.payload; // Met à jour les préférences de notification
    },
    updatePreferences: (state, action) => {
      state.preferences = action.payload; // Met à jour les préférences issues du questionnaire
    },
    setCity: (state, action) => {
      state.city = action.payload; // Met à jour la ville
    },
    logout: (state) => {
      // Réinitialise tous les champs utilisateur à la déconnexion
      return {
        value: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        notifications: {
          enabled: true,
          frequency: "morning",
        },
        preferences: {
          gender: null,
          sensitivity: null,
          accessories: [],
          recommendationFrequency: null,
        },
      };
    },
  },
});

// Export des actions pour les utiliser avec dispatch()
export const {
  setUser,
  setToken,
  setLoading,
  setError,
  logout,
  updateNotifications,
  updatePreferences,
  setCity,
} = userSlice.actions;

// Export du reducer principal
export default userSlice.reducer;