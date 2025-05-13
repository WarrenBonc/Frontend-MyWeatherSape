import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Welcome = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../assets/bg-cloud.png")}
      style={styles.bgImage}
      blurRadius={7}
      accessible={false}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={styles.container}>
          <View
            style={{
              width: 350,
              height: 350,
              justifyContent: "center",
              alignItems: "center",
            }}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="Logo de l'application MyWeatherSape"
          >
            <Image
              source={require("../assets/Logo.png")}
              style={styles.logo}
              accessibilityIgnoresInvertColors={false}
            />
          </View>

          <View
            style={{
              width: "90%",
              height: 270,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 140,
            }}
            importantForAccessibility="yes"
          >
            <Text
              style={{
                fontSize: 40,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 40,
              }}
              accessibilityRole="header"
              accessible={true}
            >
              Bienvenue dans MyWeatherSape !
            </Text>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                textAlign: "center",
                marginBottom: 20,
              }}
              accessible={true}
            >
              Ne vous posez plus la question de comment vous habiller !
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                textAlign: "center",
                padding: 10,
              }}
              accessible={true}
            >
              MyWeatherSape est une application simple et ludique qui vous aide
              à trouver en un instant une tenue adaptée à la météo.
            </Text>

            <LinearGradient
              colors={["#34C8E8", "#4E4AF2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.99]}
              style={{
                borderRadius: 5,
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: 300,
                height: 50,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("SignIn")}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Continuer vers la page de connexion"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingLeft: 10,
                    width: "80%",
                  }}
                >
                  Continuez
                </Text>
                <Image
                  source={require("../assets/fleche.png")}
                  style={{ width: 20, height: 15, resizeMode: "contain" }}
                  accessible={true}
                  accessibilityLabel="Icône de flèche pointant vers la droite"
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  bgImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
});

export default Welcome;
