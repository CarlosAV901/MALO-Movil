import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, Modal, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@app/context/AuthContext";
import { router } from "expo-router";
import axios from "axios";
import { getEstados, getLocalidades, getMunicipios } from "@app/services/registrosServices";
import { MaterialIcons } from "@expo/vector-icons";

export default function AgregarEmpleo() {
  const { user } = useContext(AuthContext);
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [habilidades, setHabilidades] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [imagenPerfil, setImagenPerfil] = useState<string>("");
  const [selectedState, setSelectedState] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [estados, setEstados] = useState<string>('');
  const [municipios, setMunicipios] = useState<string>('');
  const [localidades, setLocalidades] = useState<string>('');
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [isMunicipalityModalVisible, setIsMunicipalityModalVisible] = useState(false);
  const [isLocalityModalVisible, setIsLocalityModalVisible] = useState(false);

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
    estado:estados,
    municipio: municipios,
    localidad: localidades,
    habilidades: '3,7,10',
    descripcion: descripcion,
    }
  
    try {
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
    }
  };
  useEffect(() => {
    const fetchEstados = async () => {
      const estadosData = await getEstados();
      setEstados(estadosData);
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const fetchMunicipios = async () => {
        const municipiosData = await getMunicipios(selectedState.cve_ent);
        setMunicipios(municipiosData);
      };
      fetchMunicipios();
    }
  }, [selectedState]);


  useEffect(() => {
    if (selectedMunicipality) {
      const fetchLocalidades = async () => {
        const municipiosCode = `${selectedState.cve_ent}${selectedMunicipality.cve_mun}`;
        const localidadesData = await getLocalidades(municipiosCode);
        setLocalidades(localidadesData);
      };
      fetchLocalidades();
    }
  }, [selectedMunicipality]);

  const handleStateSelect = (estado) => {
    setSelectedState(estado);
    setEstados(estado.nomgeo)
    setSelectedMunicipality('');
    setSelectedLocality('');
    setIsStateModalVisible(false);
  };

  const handleMunicipalitySelect = (municipio) => {
    setSelectedMunicipality(municipio);
    setMunicipios(municipio.nomgeo); // Guarda solo el nombre del municipio seleccionado
    setSelectedLocality('');
    setIsMunicipalityModalVisible(false);
  };

  const handleLocalitySelect = (localidad) => {
    setSelectedLocality(localidad);
    setLocalidades(localidad.nomgeo); // Guarda solo el nombre de la localidad seleccionada
    setIsLocalityModalVisible(false);
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
        <Text style={styles.label}>Telefono</Text>
        <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} placeholder="Telefono" />
        <Text style={styles.label}>Descripcion</Text>
        <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder="descripcion" />
        {/* Dropdown para Estado */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setIsStateModalVisible(true)}>
          <Text>{selectedState ? selectedState.nomgeo : 'Seleccionar Estado'}</Text>
          <MaterialIcons style={{paddingLeft:135}} name="arrow-drop-down" size={30} color="black" />
        </TouchableOpacity>
        <Modal visible={isStateModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <FlatList
              data={estados}
              keyExtractor={(item) => item.cve_ent}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleStateSelect(item)}>
                  <Text>{item.nomgeo}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsStateModalVisible(false)}>
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Dropdown para Municipio */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setIsMunicipalityModalVisible(true)}>
          <Text>{selectedMunicipality ? selectedMunicipality.nomgeo : 'Seleccionar Municipio'}</Text>
          <MaterialIcons style={{paddingLeft:120}} name="arrow-drop-down" size={30} color="black" />
        </TouchableOpacity>
        <Modal visible={isMunicipalityModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <FlatList
              data={municipios}
              keyExtractor={(item) => item.cve_mun}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleMunicipalitySelect(item)}>
                  <Text>{item.nomgeo}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsMunicipalityModalVisible(false)}>
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Dropdown para Localidad */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setIsLocalityModalVisible(true)}>
          <Text>{selectedLocality ? selectedLocality.nomgeo : 'Seleccionar Localidad'}</Text>
          <MaterialIcons style={{paddingLeft:120}} name="arrow-drop-down" size={30} color="black" />
        </TouchableOpacity>
        <Modal visible={isLocalityModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <FlatList
              data={localidades}
              keyExtractor={(item) => item.cve_loc}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleLocalitySelect(item)}>
                  <Text>{item.nomgeo}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsLocalityModalVisible(false)}>
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>

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
          <Text style={styles.submitButtonText}>Actualizar datos</Text>
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
  dropdown: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 30,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
  },
  modalCloseButton: {
    backgroundColor: '#3a78d5',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
