import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    value: null, // Stocke le nom de l'utilisateur
    token: null, // Stocke le token d'authentification
    isAuthenticated: false, // Indique si l'utilisateur est authentifié
    loading: false, // Indique si une requête est en cours
    error: null, // Stocke l'erreur (si existante)
  },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload; // Met à jour le nom de l'utilisateur
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
    logout: (state) => {
      state.token = null; // Efface le token
      state.value = null; // Efface le nom de l'utilisateur
      state.isAuthenticated = false; // L'utilisateur n'est plus authentifié
    },
  },
});

export const { setUser, setToken, setLoading, setError, logout } =
  userSlice.actions;
export default userSlice.reducer;
