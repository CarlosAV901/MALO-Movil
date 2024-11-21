import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, Modal, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@app/context/AuthContext";
import { router } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function AgregarEmpleo() {
  const { user } = useContext(AuthContext);
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");
  const [salarioMinimo, setSalarioMinimo] = useState<number>(0);
  const [salarioMaximo, setSalarioMaximo] = useState<number>(0);
  const [horario, setHorario] = useState<string>("");
  const [multimediaContenido, setMultimediaContenido] = useState<string>("");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState("");
  const [loading, setLoading] = useState<boolean>(false);  
  const scheduleOptions = [
    "Tiempo completo",
    "Medio tiempo",
    "Mañana",
    "Noche",
    "Tarde",
    "",
  ];
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
    setLoading(true); 
    const multimediaNombre = multimediaContenido.split('/').pop();
    const multimediaTipo = 'image/jpeg';
  
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("empresa_id", user.id);
    formData.append("ubicacion", ubicacion);
    formData.append("salario_minimo", salarioMinimo.toString());
    formData.append("salario_maximo", salarioMaximo.toString());
    formData.append("horario", scheduleFilter);
    formData.append("multimediaNombre", multimediaNombre || "");
    formData.append("multimediaTipo", multimediaTipo);
    formData.append("archivo", {
      uri: multimediaContenido,
      name: multimediaNombre,
      type: multimediaTipo,
    } as any);
    console.log(formData);
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
    }finally {
      setLoading(false);  
    }
  };
  
  const renderDropdown = (options, setFilter, isOpen, setIsOpen) => (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {options.map((option) => (
            <TouchableOpacity
            key={option}
            style={styles.modalOption}
            onPress={() => {
              setFilter(option);
              setIsOpen(false); // Cierra el modal al seleccionar una opción
            }}
          >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
  return (
    <ScrollView style={{ backgroundColor: '#F5F5F5', flex: 1 }}>
      <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Agregar Empleos</Text>
        <TouchableOpacity onPress={() => router.navigate('/(Empresa)/home/(tabs)/perfil')}>
          <FontAwesome name="user-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>
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
      
      {/* Botón para abrir el dropdown */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsScheduleOpen(true)}
      >
        <Text>{scheduleFilter || "Seleccionar Horario"}</Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
      </TouchableOpacity>
      
      {/* Llamar a la función que renderiza el dropdown */}
      {renderDropdown(
        scheduleOptions,
        setScheduleFilter,
        isScheduleOpen,
        setIsScheduleOpen
      )}
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
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Agregar Empleo</Text>
          )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
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
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DDD",
    flex: 1,
  },
   modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    alignItems: "center",
  },
});
