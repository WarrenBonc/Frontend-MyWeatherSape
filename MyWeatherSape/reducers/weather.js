import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  forecast: [], // Météo actuelle + prévisions sur plusieurs jours (y compris heures)
  recommendation: "", // Conseil vestimentaire IA
};

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setForecast: (state, action) => {
      // On stocke directement les 7 jours (y compris le jour actuel)
      state.forecast = action.payload;
    },
    setRecommendation: (state, action) => {
      state.recommendation = action.payload;
    },
  },
});

export const { setForecast, setRecommendation } = weatherSlice.actions;

export default weatherSlice.reducer;
