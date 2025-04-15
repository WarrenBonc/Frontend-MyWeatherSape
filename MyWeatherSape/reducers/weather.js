// reducers/weather.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current: null,           // météo actuelle
  today: [],               // météo par heure
  forecast: [],            // météo sur plusieurs jours
  recommendation: "",      // conseil vestimentaire IA
};

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setCurrentWeather: (state, action) => {
      state.current = action.payload;
    },
    setTodayWeather: (state, action) => {
      state.today = action.payload;
    },
    setForecast: (state, action) => {
      state.forecast = action.payload;
    },
    setRecommendation: (state, action) => {
      state.recommendation = action.payload;
    },
  },
});

export const {
  setCurrentWeather,
  setTodayWeather,
  setForecast,
  setRecommendation,
} = weatherSlice.actions;

export default weatherSlice.reducer;