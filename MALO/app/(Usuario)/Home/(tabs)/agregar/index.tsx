import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "@app/components/Themed"; // Asegúrate de usar Themed.View si es necesario
import EditScreenInfo from "@app/components/EditScreenInfo";
import { AuthContext } from "@app/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";

export default function Agregar() {
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { isAuthenticated, logout } = authContext!; // Asegúrate de manejar el caso donde el contexto sea undefined

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <>
          <Text style={styles.title}>Bienvenido!</Text>
          <Text style={styles.title}>correo {user?.email}</Text>
          <Text style={styles.subtitle}>Ya has iniciado sesión</Text>
          <TouchableOpacity
            onPress={() => {
              logout(); 
              router.push("/login"); 
            }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Inicie sesión</Text>
          <Text style={styles.subtitle}>
            Por favor, inicie sesión para continuar
          </Text>
        </>
      )}
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    color: "gray",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff5c5c",
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
