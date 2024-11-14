import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@app/context/AuthContext";
import { router } from "expo-router";
import axios from "axios";

export default function AgregarEmpleo() {
  const { user } = useContext(AuthContext);
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");
  const [localidad, setLocalidad] = useState<string>("");
  const [habilidades, setHabilidades] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [imagenPerfil, setImagenPerfil] = useState<string>("");

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permisos requeridos", "Se necesitan permisos para acceder a la galería.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets[0].uri;
      setImagenPerfil(imageUri);
    }
  };

  const handleSubmit = async () => {
    if (!user?.token) {
      Alert.alert("Error", "No se pudo encontrar el token de autenticación.");
      return;
    }
    const multimediaNombre = imagenPerfil.split("/").pop();
    const multimediaTipo = "image/jpeg";
    
    const formData = new FormData();
    formData.append('UsuarioId', user.id);  
    if (imagenPerfil) {

      formData.append("archivo", {
        uri: imagenPerfil,
        name: multimediaNombre,
        type: multimediaTipo,
      } as any);
    }
    try {
      const responseMultimedia = await axios.post(
        "https://malo-backend.onrender.com/api/Usuario/ActualizarMultimedia",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      Alert.alert("Éxito", "Multimedia actualizada exitosamente");
    } catch (error) {
      console.error("Error de Axios (Multimedia):", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error en la respuesta del servidor"
      );
    }
  
    const userData = {
    UsuarioId:user.id,
    nombre: nombre,
    email: email,
    apellido: apellido,
    telefono: telefono,
    estado:estado,
    municipio: municipio,
    localidad: localidad,
    descripcion: descripcion,
    habilidades: '3,7,10',
    }
  
   /*  try {
      const response = await axios.post('https://malo-backend.onrender.com/api/Usuario/ActualizarUsuario', userData, {
        headers: {
          'Content-Type': 'application/json', // Make sure the correct content type is set
          'Authorization': `Bearer ${user.token}`,
        }
      });
      console.log(response);
      Alert.alert("Éxito", "Usuario agregado exitosamente");
      router.push("/(Usuario)/Home/(tabs)");
    } catch (error) {
      console.error("Error de Axios:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Error en la respuesta del servidor");
    } */
  };
  

  return (
    <ScrollView style={{ backgroundColor: '#F5F5F5', flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" />
        <Text style={styles.label}>Apellido</Text>
        <TextInput style={styles.input} value={apellido} onChangeText={setApellido} placeholder="Apellido" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

        <Text style={styles.label}>Imagen de Perfil</Text>
        {imagenPerfil ? (
          <Image source={{ uri: imagenPerfil }} style={{ width: 200, height: 200, marginBottom: 10 }} />
        ) : (
          <Text style={styles.placeholderText}>No se ha seleccionado ninguna imagen</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Agregar Usuario</Text>
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
  placeholderText: {
    marginBottom: 10,
    fontStyle: "italic",
    color: "#888",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
