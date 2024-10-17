import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function RegisterForm() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Registrate</Text>

        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Nombre" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Apellido" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Telefono" keyboardType="phone-pad" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="calendar" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Fecha Nacimiento" />
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Correo Electronico" keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={24} color="black" />
          <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry />
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Pais</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text>{country || 'Seleccionar País'}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Estado</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text>{state || 'Seleccionar Estado'}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Municipios</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text>{state || 'Seleccionar Municipio'}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <View style={styles.horizontalLine}></View>
        <TouchableOpacity onPress={() => router.push(`/login`)}>
          <Text style={styles.link}>Ya tienes cuenta?</Text>
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
  dropdownContainer: {
    width: '100%',
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
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
