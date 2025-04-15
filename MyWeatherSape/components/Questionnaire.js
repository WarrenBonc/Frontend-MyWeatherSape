import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const Questionnaire = () => {   

const [question, setQuestion] = useState(0);
const [reponse, setReponse] = useState("");
const [reponseTotal, setReponseTotal] = useState([]);

if(question === 0) {
  return (
    <View style={styles.container}>
     <Text>Selectionnez votre sexe</Text>
     <View />

        <TouchableOpacity onPress={() => setReponse("Homme")}>
            <Text>Homme</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setReponse("Femme")}>
            <Text>Femme</Text>
            </TouchableOpacity >
     <TouchableOpacity onPress={() =>{ setQuestion(1) setReponseTotal([...reponseTotal, reponse]) }}>
        <Text>Continuez</Text>
     </TouchableOpacity>
    </View>
  );
    
  return (
    <div>

  <TouchableOpacity>

  </TouchableOpacity>
    </div>
  );
}