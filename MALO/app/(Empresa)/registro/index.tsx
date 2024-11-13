import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { RegistroEmpresaService } from "@app/services/registrosServices";

export default function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [industria, setIndustry] = useState("");
  const [ubicacion, setDireccion] = useState("");
  const [contrasena, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    // Validación básica
    if (!nombre || !industria || !ubicacion || !email || !contrasena ) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    try {
      const response = await RegistroEmpresaService(
        nombre,
        industria,
        ubicacion,
        email,
        contrasena,
      );
      Alert.alert(
        "Éxito",
        "Registro completado. Registro completado. Revisa tu correo y confirma tu cuenta"
      );
      console.log("Empresa registrada:", response);
      router.push("/login"); // Redirige a la página de dashboard u otra página de tu elección
    } catch (error) {
      console.error("Error al registrar la empresa:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al registrar la empresa. Inténtalo de nuevo."
      );
    }
  };

  return (
    <>
    <Stack.Screen
    options={{ headerShown: true, title: "Registra una empresa" }}
  />
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Regístra tu empresa</Text>

        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="industry" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Industria"
            value={industria}
            onChangeText={setIndustry}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="map-marker" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={ubicacion}
            onChangeText={setDireccion}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <View style={styles.horizontalLine}></View>
        <TouchableOpacity onPress={() => router.replace(`/login`)}>
          <Text style={styles.link}>¿Ya tienes cuenta?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f2f2f2",
    padding: 40,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 30,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%",
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
    width: 300,
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
