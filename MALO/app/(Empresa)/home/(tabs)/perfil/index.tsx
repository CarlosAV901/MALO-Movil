import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import { AuthContext } from "@app/context/AuthContext";
import { router } from "expo-router";
import axios from "axios";

export default function ActualizarEmpresa() {
  const { user } = useContext(AuthContext);
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [industria, setIndustria] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");

  const handleSubmit = async () => {
    if (!user?.token) {
      Alert.alert("Error", "No se pudo encontrar el token de autenticación.");
      return;
    }

    const empresaData = {
      id: user.id, 
      nombre: nombre,
      email: email,
      industria: industria,
      ubicacion: ubicacion,
    };

    try {
      const response = await axios.post(
        'https://malo-backend-empresas.onrender.com/api/Empresa/actualizar-empresa', 
        empresaData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      Alert.alert("Éxito", "Empresa actualizada exitosamente");
      router.push("/(Empresa)/home/(tabs)");
    } catch (error: any) {
      console.error("Error de Axios:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Error en la respuesta del servidor");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#F5F5F5', flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.label}>Nombre de la Empresa</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre de la empresa" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
        <Text style={styles.label}>Industria</Text>
        <TextInput style={styles.input} value={industria} onChangeText={setIndustria} placeholder="Industria" />
        <Text style={styles.label}>Ubicación</Text>
        <TextInput style={styles.input} value={ubicacion} onChangeText={setUbicacion} placeholder="Ubicación" />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Actualizar Empresa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
