import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@app/context/AuthContext";

export default function AgregarEmpleo  ()  {
  const { user } = useContext(AuthContext);
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");
  const [salarioMinimo, setSalarioMinimo] = useState<number>(0);
  const [salarioMaximo, setSalarioMaximo] = useState<number>(0);
  const [horario, setHorario] = useState<string>("");
  const [multimediaContenido, setMultimediaContenido] = useState<string>("");

 // console.log("empresa", user);

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
      // Aquí usamos el uri de la imagen seleccionada
      const imageUri = pickerResult.assets[0].uri; // Asegúrate de acceder correctamente a la uri
      console.log("Imagen seleccionada URI:", imageUri);
      setMultimediaContenido(imageUri); // Guarda la uri en el estado
    }
  };
  
  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert("Error", "No se pudo encontrar el ID de la empresa.");
      return;
    }
  
    // Obtén el nombre y tipo de la imagen
    const multimediaNombre = multimediaContenido.split('/').pop(); // Extrae el nombre del archivo del URI
    const multimediaTipo = 'image/jpeg'; // O ajusta según el tipo que estás usando
  
    const empleoData = {
      titulo,
      descripcion,
      empresa_id: user.id,
      ubicacion,
      salario_minimo: salarioMinimo,
      salario_maximo: salarioMaximo,
      horario,
      multimediaContenido, // Aquí se envía la uri
      multimediaNombre, // Nombre de la imagen
      multimediaTipo, // Tipo de la imagen
    };
  
    try {
      const response = await fetch("https://malo-backend-empleos.onrender.com/api/Empleo/PostEmpleo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleoData),
      });
    
      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
       
        console.log("Respuesta de error del servidor:",); // Registrar la respuesta
        throw new Error("Error en la respuesta del servidor"); // Lanzar error genérico
      }
     
      Alert.alert("Éxito", "Empleo agregado exitosamente");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
    
  };
  
  return (
    <ScrollView>
      <View style={styles.container}>
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

        <Text style={styles.label}>Multimedia</Text>
        {multimediaContenido ? (
        <Image source={{ uri: multimediaContenido }} style={{ width: 200, height: 200, marginBottom: 10 }} />
        ) : (
          <Text style={styles.placeholderText}>No se ha seleccionado ninguna imagen</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Agregar Empleo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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

