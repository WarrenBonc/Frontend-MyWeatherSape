import Constants from "expo-constants";

// Utilise une fonction pour récupérer l'IP locale
const getLocalIp = () => {
  if (Constants.manifest?.debuggerHost) {
    // Essaie de parser l'IP depuis debuggerHost (cas développement)
    return Constants.manifest.debuggerHost.split(":")[0];
  }

  // Si debuggerHost n'est pas défini, essaie l'IP locale (fallback sur 192.168.0.44)
  // Ou tu peux remplacer avec ton adresse IP locale
  return "192.168.0.44"; // Remplacer par l'IP de ton réseau localdsdsds
};

const localIp = getLocalIp();
const API_BASE_URL = `http://${localIp}:3000`;

export default { API_BASE_URL };
