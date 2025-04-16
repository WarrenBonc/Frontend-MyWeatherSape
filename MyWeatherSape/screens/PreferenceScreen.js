import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Questionaire from "../components/Questionnaire";

const PreferencePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Ellipse.png")}
        style={[styles.ellipse, styles.bottomLeft]}
      />
      {/* Ellipse Top Right */}
      <Image
        source={require("../assets/Ellipse.png")}
        style={[styles.ellipse, styles.topRight]}
      />
      <Questionaire navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ellipse: {
    position: "absolute",
    width: 700,
    height: 700,
    resizeMode: "contain",
  },
  bottomLeft: {
    bottom: -280,
    left: -280,
  },
  topRight: {
    top: -280,
    right: -280,
  },
});

export default PreferencePage;
