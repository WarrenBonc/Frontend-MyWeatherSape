import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SigninPage = () => {
  return (
    <View style={styles.container}>
      <Text>SigninPage</Text>
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
});

export default SigninPage;
