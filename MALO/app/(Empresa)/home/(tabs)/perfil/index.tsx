import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@app/context/AuthContext";
import axios from "axios";
import { router } from "expo-router";

export default function ActualizarEmpresa() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); // `logout` para cerrar sesión
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout } = authContext!; 
  const [empresa, setEmpresa] = useState({
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
      // Aquí solo enviamos el ID directamente en el cuerpo de la solicitud
      const response = await axios.post(
        "https://malo-backend-empresas.onrender.com/api/Empresa/GetEmpresaPorId",
        user?.id,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const empresaData = response.data;
      setEmpresa({
        nombre: empresaData.nombre,
        email: empresaData.email,
        industria: empresaData.industria,
        ubicacion: empresaData.ubicacion,
      });
    } catch (error) {
      console.error("Error al cargar los datos de la empresa:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudieron cargar los datos de la empresa.");
    }
  };
  

  const handleSave = async () => {
    router.push({
      pathname: "/(Empresa)/actualizarEmpresa",
      params: {
        nombre: empresa.nombre,
        email: empresa.email,
        industria: empresa.industria,
        ubicacion: empresa.ubicacion,
      },
    });
  };

  const handleLogout = () => {
    logout(); // Cierra sesión
    router.replace("/login"); // Redirige al login
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
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
          <Text style={styles.sectionSubtitle}>
            {empresa.nombre || "No disponible"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email</Text>
          <Text style={styles.sectionSubtitle}>
            {empresa.email || "No disponible"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Industria</Text>
          <Text style={styles.sectionSubtitle}>
            {empresa.industria || "No disponible"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <Text style={styles.sectionSubtitle}>
            {empresa.ubicacion || "No disponible"}
          </Text>
        </View>

        {/* Botón para guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Editar Empresa</Text>
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
