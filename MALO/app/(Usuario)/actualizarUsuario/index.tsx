import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, Modal, FlatList, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@app/context/AuthContext";
import { router, Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { getEstados, getLocalidades, getMunicipios } from "@app/services/registrosServices";
import { MaterialIcons } from "@expo/vector-icons";

export default function AgregarEmpleo() {
    const {
        nombre,
        apellido,
        email,
        telefono,
        estado,
        municipio,
        localidad,
        imagen,
      } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [nombreA, setNombre] = useState<string>(nombre || "");
  const [apellidoA, setApellido] = useState<string>(apellido || "");
  const [emailA, setEmail] = useState<string>(email || "");
  const [telefonoA, setTelefono] = useState<string>(telefono || "");
  const [habilidades, setHabilidades] = useState<string>( "");
  const [descripcionA, setDescripcion] = useState<string>("");
  const [imagenPerfil, setImagenPerfil] = useState<string>( imagen ||"");
  const [selectedState, setSelectedState] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [estados, setEstados] = useState<string>('');
  const [municipios, setMunicipios] = useState<string>('');
  const [localidades, setLocalidades] = useState<string>('');
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [isMunicipalityModalVisible, setIsMunicipalityModalVisible] = useState(false);
  const [isLocalityModalVisible, setIsLocalityModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  
  const handleSubmit = async () => {
    if (!user?.token) {
      Alert.alert("Error", "No se pudo encontrar el token de autenticación.");
      return;
    }
    
  
    const userData = {
    UsuarioId:user.id,
    nombre: nombreA,
    email: emailA,
    apellido: apellidoA,
    telefono: telefonoA,
    estado:estados,
    municipio: municipios,
    localidad: localidades,
    descripcion: descripcionA,
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
    <>
    <Stack.Screen
  options={{ headerShown: true, title: "Actualizar Datos" }}
/>
    <ScrollView style={{ backgroundColor: '#F5F5F5', flex: 1 }}>
      <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={nombreA} onChangeText={setNombre} placeholder="Nombre" />
        <Text style={styles.label}>Apellido</Text>
        <TextInput style={styles.input} value={apellidoA} onChangeText={setApellido} placeholder="Apellido" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={emailA} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
        <Text style={styles.label}>Telefono</Text>
        <TextInput style={styles.input} value={telefonoA} onChangeText={setTelefono} placeholder="Telefono" />
        <Text style={styles.label}>Descripcion</Text>
        <TextInput style={styles.input} value={descripcionA} onChangeText={setDescripcion} placeholder="descripcion" />
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Actualizar datos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Asegura que el spinner esté por encima del contenido
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
