import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "@app/context/AuthContext";
import axios from "axios";

export default function ActualizarEmpresa() {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext); // `logout` para cerrar sesión
  const [empresaData, setEmpresaData] = useState({
    nombre: "",
    email: "",
    industria: "",
    ubicacion: "",
  });

  useEffect(() => {
    cargarDatosEmpresa();
  }, []);

  const cargarDatosEmpresa = async () => {
    try {
      const response = await axios.get(`https://malo-backend-empresas.onrender.com/api/Empresa/obtener-empresa/${user?.id}`);
      setEmpresaData(response.data);
    } catch (error) {
      console.error("Error al cargar los datos de la empresa:", error);
      Alert.alert("Error", "No se pudieron cargar los datos de la empresa.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(
        'https://malo-backend-empresas.onrender.com/api/Empresa/actualizar-empresa',
        { id: user.id, ...empresaData },
        { headers: { 'Content-Type': 'application/json' } }
      );
      Alert.alert("Éxito", "Datos de la empresa actualizados exitosamente.");
    } catch (error) {
      console.error("Error al actualizar los datos de la empresa:", error);
      Alert.alert("Error", "No se pudieron actualizar los datos de la empresa.");
    }
  };

  const handleLogout = () => {
    logout(); // Cierra sesión
    navigation.replace("LoginScreen"); // Redirige al login
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Datos de la Empresa</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Contenedor de los datos de la empresa */}
        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.sectionTitle}>Nombre</Text>
          <Text style={styles.sectionSubtitle}>{empresaData.nombre || "No disponible"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email</Text>
          <Text style={styles.sectionSubtitle}>{empresaData.email || "No disponible"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Industria</Text>
          <Text style={styles.sectionSubtitle}>{empresaData.industria || "No disponible"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <Text style={styles.sectionSubtitle}>{empresaData.ubicacion || "No disponible"}</Text>
        </View>

        {/* Botón para guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Actualizar Empresa</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3c3744",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 50,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    position: "absolute",
    left: 50,
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  logoutButton: {
    position: "absolute",
    right: 10, // Alineación derecha
    backgroundColor: "#FF6F61",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
  },
  firstSection: {
    marginTop: 30, // Espacio adicional debajo del header
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "left",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "80%",
    marginVertical: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
