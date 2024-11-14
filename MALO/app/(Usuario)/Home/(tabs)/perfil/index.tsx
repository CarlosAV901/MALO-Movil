import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "@app/context/AuthContext";
import axios from "axios";

export default function PerfilScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [imagenPerfil, setImagenPerfil] = useState<string>("");
  const [habilidades, setHabilidades] = useState<string[]>(["Skill aquí", "Skill aquí", "Skill aquí"]);
  const [experiencias, setExperiencias] = useState<string>("");
  const [documento, setDocumento] = useState<any>(null);

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const response = await axios.get(`https://malo-backend.onrender.com/api/Usuario/ObtenerUsuario/${user?.id}`);
      const datosUsuario = response.data;
      setImagenPerfil(datosUsuario.imagen_perfil);
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
      Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
    }
  };

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

  const handleSave = () => {
    Alert.alert("Guardado", "La información ha sido guardada exitosamente.");
  };

  return (
    <View style={styles.container}>
      {/* ScrollView con el resto de la información */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección del encabezado con separación blanca */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>

        {/* Espacio extra debajo del encabezado */}
        <View style={styles.spacing}></View>

        {/* Foto de perfil con icono de edición en la parte superior */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePickImage} style={styles.profileImageContainer}>
            {imagenPerfil ? (
              <Image source={{ uri: imagenPerfil }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Seleccionar imagen</Text>
              </View>
            )}
            <FontAwesome name="pencil" size={18} color="gray" style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* Información del usuario */}
        <View style={styles.section}>
          <Text style={styles.nameText}>Nombre de usuario</Text>
          <Text style={styles.contactText}>su correo@gmail.com</Text>
          <Text style={styles.contactText}>fecha de nacimiento</Text>
          <Text style={styles.contactText}>773-987-52-61</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lugar de residencia</Text>
          <Text style={styles.sectionSubtitle}>ejemplo. Hidalgo de tula allende, el carmen</Text>
        </View>

        {/* Campo de experiencias (sin TextInput, solo un Text) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencias</Text>
          <Text style={styles.sectionSubtitle}>{experiencias || "No has agregado experiencias."}</Text>
        </View>

        {/* Habilidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.skillsContainer}>
            {habilidades.map((skill, index) => (
              <TouchableOpacity key={index} style={styles.skillButton}>
                <Text style={styles.skillText}>{skill} ✕</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addSkillButton}>
              <Text style={styles.addSkillText}>Otro +</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón para subir CV */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.documentButton}>
            <FontAwesome name="upload" size={18} color="gray" style={styles.documentIcon} />
            <Text style={styles.documentButtonText}>Subir CV</Text>
          </TouchableOpacity>
          {documento && <Text style={styles.documentText}>{documento.name}</Text>}
        </View>

        {/* Botón para guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3066be",
  },
  header: {
    alignItems: "center",
    paddingTop: 10, // Ajusta la distancia de la parte superior
  },
  profileImageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20, // Separación hacia abajo con la información
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,  // Círculo
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",  // Color blanco para la separación
    borderBottomWidth: 2, // Línea debajo de la separación
    borderBottomColor: "#ddd", // Color de la línea
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  spacing: {
    height: 20,  // Añadido para crear un espacio blanco debajo del encabezado
    backgroundColor: "#FFFFFF", // Fondo blanco para asegurar que se vea
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
  },
  contactText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  skillButton: {
    backgroundColor: "#E0F7FA",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 5,
    marginBottom: 5,
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
  },
});
