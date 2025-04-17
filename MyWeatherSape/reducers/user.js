import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    value: null, // Stocke le nom de l'utilisateur
    token: null, // Stocke le token d'authentification
    city: "Paris", // Stocke la ville actuelle
    isAuthenticated: false, // Indique si l'utilisateur est authentifié
    loading: false, // Indique si une requête est en cours
    error: null, // Stocke l'erreur (si existante)
    notifications: {
      enabled: true,
      frequency: "morning",
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload; // Met à jour le nom de l'utilisateur
    },
    updateUser: (state, action) => {
      state.value.firstName = action.payload.firstName;
      state.value.email = action.payload.email;
    },
    setToken: (state, action) => {
      state.token = action.payload; // Met à jour le token d'authentification
      state.isAuthenticated = true; // L'utilisateur est authentifié
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Met à jour l'état de chargement
    },
    setError: (state, action) => {
      state.error = action.payload; // Met à jour l'erreur
    },
    updateNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    logout: (state) => {
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
      };
    },
  },
});

export const {
  setUser,
  setToken,
  setLoading,
  setError,
  logout,
  updateNotifications,
  setCity,
} = userSlice.actions;
export default userSlice.reducer;
