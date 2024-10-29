import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@app/context/AuthContext";
import { useLocalSearchParams } from "expo-router";

export default function ActualizarEmpleo() {
  const { user } = useContext(AuthContext);
  
  // Obtener los parámetros iniciales
  const {
    empleoId,
    titulo,
    descripcion,
    salario_minimo,
    ubicacion,
    salario_maximo,
    horario,
  } = useLocalSearchParams();

  // Configurar el estado inicial usando los parámetros obtenidos
  const [tituloA, setTitulo] = useState<string>(titulo || "");
  const [descripcionA, setDescripcion] = useState<string>(descripcion || "");
  const [ubicacionA, setUbicacion] = useState<string>(ubicacion || "");
  const [salarioMinimoA, setSalarioMinimo] = useState<number>(salario_minimo ? Number(salario_minimo) : 0);
  const [salarioMaximoA, setSalarioMaximo] = useState<number>(salario_maximo ? Number(salario_maximo) : 0);
  const [horarioA, setHorario] = useState<string>(horario || "");
  const [multimediaContenidoA, setMultimediaContenido] = useState<string>("");

  useEffect(() => {
    setTitulo(titulo || "");
    setDescripcion(descripcion || "");
    setUbicacion(ubicacion || "");
    setSalarioMinimo(salario_minimo ? Number(salario_minimo) : 0);
    setSalarioMaximo(salario_maximo ? Number(salario_maximo) : 0);
    setHorario(horario || "");
  }, [titulo, descripcion, ubicacion, salario_minimo, salario_maximo, horario]);

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

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://malo-backend-empleos.onrender.com/api/Empleo/DeleteEmpleoById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empleoId: empleoId }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      Alert.alert("Éxito", "Empleo eliminado exitosamente");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSubmit = async () => {
    const multimediaNombre = multimediaContenidoA.split('/').pop();
    const multimediaTipo = 'image/jpeg';

    try {
      const response = await fetch(`https://malo-backend-empleos.onrender.com/api/Empleo/UpdateEmpleoById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empleo_id: empleoId,
          titulo: tituloA,
          descripcion: descripcionA,
          ubicacion: ubicacionA,
          salario_minimo: salarioMinimoA,
          salario_maximo: salarioMaximoA,
          horario: horarioA,
          multimediaContenido: multimediaContenidoA,
          multimediaNombre,
          multimediaTipo,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      Alert.alert("Éxito", "Empleo actualizado exitosamente");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={tituloA} onChangeText={setTitulo} />

        <Text style={styles.label}>Descripción</Text>
        <TextInput style={styles.input} value={descripcionA} onChangeText={setDescripcion} multiline />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput style={styles.input} value={ubicacionA} onChangeText={setUbicacion} />

        <Text style={styles.label}>Salario Mínimo</Text>
        <TextInput style={styles.input} value={String(salarioMinimoA)} onChangeText={(text) => setSalarioMinimo(Number(text))} keyboardType="numeric" />

        <Text style={styles.label}>Salario Máximo</Text>
        <TextInput style={styles.input} value={String(salarioMaximoA)} onChangeText={(text) => setSalarioMaximo(Number(text))} keyboardType="numeric" />

        <Text style={styles.label}>Horario</Text>
        <TextInput style={styles.input} value={horarioA} onChangeText={setHorario} />

        <Text style={styles.label}>Multimedia</Text>
        {multimediaContenidoA ? (
          <Image source={{ uri: multimediaContenidoA }} style={{ width: 200, height: 200, marginBottom: 10 }} />
        ) : (
          <Text style={styles.placeholderText}>No se ha seleccionado ninguna imagen</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Actualizar Empleo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#FF0000" }]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Eliminar Empleo</Text>
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
