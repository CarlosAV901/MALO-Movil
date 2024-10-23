import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function RegisterForm() {
  const [industry, setIndustry] = useState('');
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Regístra tu empresa</Text>

        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Nombre" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="industry" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Industria" value={industry} onChangeText={setIndustry} />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="map-marker" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Dirección" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Correo Electrónico" keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry />
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <View style={styles.horizontalLine}></View>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>¿Ya tienes cuenta?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f2f2f2',
    padding:40
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 30,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#3a78d5",
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: "center",
    margin: 30,
    width:300
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  link: {
    color: "#340bdb",
    textAlign: "center",
    marginVertical: 5,
  },
  horizontalLine: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    width: "50%",
    marginVertical: 10,
  },
  linksContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});