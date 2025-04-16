import Constants from "expo-constants";

const localIp = Constants.manifest?.debuggerHost?.split(":")[0];
export const API_BASE_URL = `http://${localIp}:3000`;
