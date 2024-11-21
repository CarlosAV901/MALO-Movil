import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@app/context/AuthContext";
import axios from "axios";
import { router } from "expo-router";

export default function PerfilScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout } = authContext!;
  const [imagenPerfil, setImagenPerfil] = useState<string>("");
  const [habilidades, setHabilidades] = useState<string[]>([
    "Skill aquí",
    "Skill aquí",
    "Skill aquí",
  ]);
  const [experiencias, setExperiencias] = useState<string>("");
  const [documento, setDocumento] = useState<any>(null);
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    fechaNacimiento: "",
    telefono: "",
    estado: "",
    municipio: "",
    localidad: "",
    habilidades: "",
    descripcion: "",
  });

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const response = await axios.post(
        "https://malo-backend.onrender.com/api/Usuario/ObtenerUsuarioPorId",
        {
          id: user?.id, // Enviar ID por el cuerpo de la solicitud
        }
      );

      const datosUsuario = response.data;
      const habilidadesProcesadas = datosUsuario.habilidadesDescripciones
        ? datosUsuario.habilidadesDescripciones
            .split(",")
            .map((habilidUsuario: string) => habilidUsuario.trim())
        : [];
      setHabilidades(habilidadesProcesadas);
      // Actualiza los estados con los datos recibidos
      setImagenPerfil(datosUsuario.imagenPerfil || "");
      setExperiencias(
        datosUsuario.experiencias || "No has agregado experiencias."
      );

      setUsuario({
        nombre: datosUsuario.nombre,
        apellido: datosUsuario.apellido,
        email: datosUsuario.email,
        fechaNacimiento: datosUsuario.fecha_nacimiento,
        telefono: datosUsuario.telefono,
        estado: datosUsuario.estado,
        municipio: datosUsuario.municipio,
        localidad: datosUsuario.localidad,
        habilidades: habilidadesProcesadas,
        descripcion: datosUsuario.descripcion,
      });
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
      Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
    }
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permisos requeridos",
        "Se necesitan permisos para acceder a la galería."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets[0].uri;
      setImagenPerfil(imageUri);
      setLoading(true);
      await changefoto(imageUri);
      setLoading(false);
    }
  };

  const changefoto = async (imageUri: string) => {
    if (!user?.token) {
      Alert.alert("Error", "No se pudo encontrar el token de autenticación.");
      return;
    }

    const multimediaNombre = imageUri.split("/").pop();
    const multimediaTipo = "image/jpeg";

    const formData = new FormData();
    formData.append("UsuarioId", user.id);
    if (imageUri) {
      formData.append("archivo", {
        uri: imageUri,
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
      console.error(
        "Error de Axios (Multimedia):",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error en la respuesta del servidor"
      );
    }
  };

  const handleSave = () => {
    router.push({
      pathname: "/(Usuario)/actualizarUsuario",
      params: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        fechaNacimiento: usuario.fechaNacimiento,
        telefono: usuario.telefono,
        estado: usuario.estado,
        municipio: usuario.municipio,
        localidad: usuario.localidad,
        habilidades: usuario.habilidades,
        descripcion: usuario.descripcion,
        imagen: encodeURIComponent(imagenPerfil),
        experiencias: experiencias,
      },
    });
  };
  const [documentosUsuario, setDocumentosUsuario] = useState<Documento[]>([]);

  // Obtener documentos y filtrar por usuario_id
  useEffect(() => {
    const fetchAndFilterDocumentos = async () => {
      try {
        const response = await axios.get<Documento[]>(
          "https://malo-backend-documentos.onrender.com/api/Documento/GetDocumentos"
        );
        const documentosFiltrados = response.data.filter(
          (doc) => doc.usuario_id === user.id
        );
        setDocumentosUsuario(documentosFiltrados);
      } catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    };

    fetchAndFilterDocumentos();
  }, [user?.id]);
  /////
  const handlePickDocument = async () => {
    if (documentosUsuario.length > 0) {
      // Si ya existe un documento, preguntar si quiere actualizarlo
      Alert.alert(
        "Información",
        "Ya tienes un documento asociado. ¿Quieres actualizarlo?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Actualizar",
            onPress: () => handleUpdateDocument(), // Llama a la función para actualizar
          },
        ]
      );
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Permite seleccionar cualquier tipo de archivo
        copyToCacheDirectory: true, // Asegura que el archivo esté accesible localmente
      });

      console.log("Resultado del DocumentPicker:", result);

      // Verificar si la operación fue cancelada
      if (result.canceled) {
        Alert.alert(
          "Operación cancelada",
          "No se seleccionó ningún documento."
        );
        return;
      }

      // Obtener el URI del primer archivo
      const documentUri = result.assets && result.assets[0]?.uri;

      if (!documentUri) {
        Alert.alert("Error", "No se encontró la URI del archivo seleccionado.");
        return;
      }

      setDocumento(documentUri); // Guardar el documento seleccionado
      setLoading(true);
      await uploadDocument(documentUri); // Subir el archivo
      setLoading(false);
    } catch (error) {
      console.error("Error al seleccionar el documento:", error);
      Alert.alert("Error", "No se pudo seleccionar el documento.");
    }
  };

  const uploadDocument = async (documentUri: string) => {
    try {
      const documentName = documentUri.split("/").pop();
      const documentType = "application/pdf"; // Cambiar según el tipo de archivo

      const formData = new FormData();
      formData.append("usuario_id", user.id);
      formData.append("nombre", String(documentName));
      if (documentUri) {
        formData.append("archivo", {
          uri: documentUri,
          name: documentName,
          type: documentType,
        } as any);
      }

      const response = await axios.post(
        "https://malo-backend-documentos.onrender.com/api/Documento/PostAgregarDoc",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);
      Alert.alert("Éxito", "Documento subido correctamente.");
    } catch (error: any) {
      console.error(
        "Error de Axios (Documento):",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error en la respuesta del servidor"
      );
    }
  };

  const handleUpdateDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Permite seleccionar cualquier tipo de archivo
        copyToCacheDirectory: true, // Asegura que el archivo esté accesible localmente
      });

      console.log("Resultado del DocumentPicker:", result);

      // Verificar si la operación fue cancelada
      if (result.canceled) {
        Alert.alert(
          "Operación cancelada",
          "No se seleccionó ningún documento."
        );
        return;
      }

      // Obtener el URI del primer archivo
      const documentUri = result.assets && result.assets[0]?.uri;

      if (!documentUri) {
        Alert.alert("Error", "No se encontró la URI del archivo seleccionado.");
        return;
      }

      setDocumento(documentUri); // Guardar el documento seleccionado
      setLoading(true);
      await updateDocument(documentUri); // Subir el archivo
      setLoading(false);
    } catch (error) {
      console.error("Error al seleccionar el documento:", error);
      Alert.alert("Error", "No se pudo seleccionar el documento.");
    }
  };
  const updateDocument = async (documentUri: string) => {
    try {
      const documentName = documentUri.split("/").pop();
      const documentType = "application/pdf"; // Cambiar según el tipo de archivo

      const formData = new FormData();
      formData.append("usuario_id", user.id);
      formData.append("nombre", String(documentName));
      if (documentUri) {
        formData.append("archivo", {
          uri: documentUri,
          name: documentName,
          type: documentType,
        } as any);
      }

      const response = await axios.post(
        "https://malo-backend-documentos.onrender.com/api/Documento/ActualizarDocumento",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);
      Alert.alert("Éxito", "Documento subido correctamente.");
    } catch (error: any) {
      console.error(
        "Error de Axios (Documento):",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error en la respuesta del servidor"
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {/* ScrollView con el resto de la información */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección del encabezado con separación blanca */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              logout();
              router.replace("/login");
            }}
          >
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Foto de perfil con icono de edición en la parte superior */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.profileImageContainer}
          >
            {imagenPerfil ? (
              <Image
                source={{ uri: imagenPerfil }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>
                  Seleccionar imagen
                </Text>
              </View>
            )}
            <FontAwesome
              name="pencil"
              size={18}
              color="gray"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Información del usuario */}
        <View style={styles.section}>
          <Text
            style={styles.nameText}
          >{`${usuario.nombre} ${usuario.apellido}`}</Text>
          <Text style={styles.contactText}>{usuario.email}</Text>
          <Text style={styles.contactText}>{usuario.fechaNacimiento}</Text>
          <Text style={styles.contactText}>{usuario.telefono}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lugar de residencia</Text>
          <Text style={styles.sectionSubtitle}>
            {" "}
            {`${usuario.estado}, ${usuario.municipio}, ${usuario.localidad}`}
          </Text>
        </View>

        {/* Campo de experiencias (sin TextInput, solo un Text) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencias</Text>
          <Text style={styles.sectionSubtitle}>
            {experiencias || "No has agregado experiencias."}
          </Text>
        </View>

        {/* Habilidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.skillsContainer}>
            {habilidades.map((skill, index) => (
              <TouchableOpacity key={index} style={styles.skillButton}>
                <Text style={styles.skillText}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón para subir CV */}
        {isAuthenticated ? (
          <View style={styles.section}>
            <TouchableOpacity
              onPress={handlePickDocument}
              style={styles.documentButton}
            >
              <Text style={styles.documentButtonText}>
                {documentosUsuario.length > 0 ? "Actualizar PDF" : "Subir PDF"}
              </Text>
            </TouchableOpacity>

            {documento && (
              <Text style={styles.documentText}>{documento.documentName}</Text>
            )}
            <View>
              {documentosUsuario.length > 0 ? (
                documentosUsuario.map((doc) => (
                  <Text key={doc.id} style={{ margin: 5, fontSize: 16 }}>
                    {doc.nombre}
                  </Text>
                ))
              ) : (
                <Text>No hay documentos asociados a este usuario.</Text>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => router.push("/login")}
          >
            <Text style={{ color: "red", textAlign: "center" }}>
              Inicia Sesion para ver tus postulaciones
            </Text>
          </TouchableOpacity>
        )}

        {/* Botón para guardar */}
        {isAuthenticated ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: "red", textAlign: "center" }}>
            Inicia Sesion para ver tus postulaciones
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3066be",
  },
  applyButton: {
    marginTop: 8,
    backgroundColor: "#dddd",
    padding: 10,
    borderRadius: 8,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Fondo semi-transparente
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Asegura que el spinner esté por encima del contenido
  },
  header: {
    alignItems: "center",
    paddingTop: 60, // Añade espacio superior para que esté debajo del encabezado
    marginTop: 10, // Ajusta la posición para que quede debajo del encabezado
  },
  profileImageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    width: "112%", // Hace que el contenedor abarque todo el ancho
    position: "absolute",
    height: 50,
    zIndex: 1, // Asegura que el encabezado esté sobre la imagen
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    position: "absolute",
    left: 50,
  },
  logoutButton: {
    backgroundColor: "#FF6F61",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  backButton: {
    marginRight: 10,
  },

  spacing: {
    height: 20,
    backgroundColor: "#FFFFFF",
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
  documentButton: {
    padding: 10,
    backgroundColor: "#E0F7FA",
    borderRadius: 8,
    alignItems: "center",
  },
  documentButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  documentText: {
    marginTop: 10,
    color: "#000",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  skillButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  skillText: {
    fontSize: 14,
    color: "#000",
  },
  addSkillText: {
    fontSize: 14,
    color: "#fff",
  },
});
