import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@app/context/AuthContext";
import { router } from "expo-router";

export default function AgregarEmpleo() {
  const { user } = useContext(AuthContext);
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");
  const [salarioMinimo, setSalarioMinimo] = useState<number>(0);
  const [salarioMaximo, setSalarioMaximo] = useState<number>(0);
  const [horario, setHorario] = useState<string>("");
  const [multimediaContenido, setMultimediaContenido] = useState<string>("");

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
      setMultimediaContenido(imageUri);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert("Error", "No se pudo encontrar el ID de la empresa.");
      return;
    }
  
    const multimediaNombre = multimediaContenido.split('/').pop();
    const multimediaTipo = 'image/jpeg';
  
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("empresa_id", user.id);
    formData.append("ubicacion", ubicacion);
    formData.append("salario_minimo", salarioMinimo.toString());
    formData.append("salario_maximo", salarioMaximo.toString());
    formData.append("horario", horario);
    formData.append("multimediaNombre", multimediaNombre || "");
    formData.append("multimediaTipo", multimediaTipo);
    formData.append("archivo", {
      uri: multimediaContenido,
      name: multimediaNombre,
      type: multimediaTipo,
    } as any);
  
    try {
      const response = await fetch("https://malo-backend-empleos.onrender.com/api/Empleo/PostEmpleo", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.log("Respuesta de error del servidor:", errorResponse);
        throw new Error(errorResponse.message || "Error en la respuesta del servidor");
      }
  
      Alert.alert("Éxito", "Empleo agregado exitosamente");
      router.push("/(Empresa)/home/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  

  return (
    <ScrollView style={{ backgroundColor: '#F5F5F5', flex: 1 }}>
      <View style={styles.container}>
        {/* Campos de texto */}
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título del empleo" />
        <Text style={styles.label}>Descripción</Text>
        <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder="Descripción" multiline />
        <Text style={styles.label}>Ubicación</Text>
        <TextInput style={styles.input} value={ubicacion} onChangeText={setUbicacion} placeholder="Ubicación" />
        <Text style={styles.label}>Salario Mínimo</Text>
        <TextInput style={styles.input} value={String(salarioMinimo)} onChangeText={(text) => setSalarioMinimo(Number(text))} placeholder="Salario Mínimo" keyboardType="numeric" />
        <Text style={styles.label}>Salario Máximo</Text>
        <TextInput style={styles.input} value={String(salarioMaximo)} onChangeText={(text) => setSalarioMaximo(Number(text))} placeholder="Salario Máximo" keyboardType="numeric" />
        <Text style={styles.label}>Horario</Text>
        <TextInput style={styles.input} value={horario} onChangeText={setHorario} placeholder="Horario" />
        
        {/* Selector de imagen */}
        <Text style={styles.label}>Multimedia</Text>
        {multimediaContenido ? (
          <Image source={{ uri: multimediaContenido }} style={{ width: 200, height: 200, marginBottom: 10 }} />
        ) : (
          <Text style={styles.placeholderText}>No se ha seleccionado ninguna imagen</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {/* Botón de envío */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Agregar Empleo</Text>
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
