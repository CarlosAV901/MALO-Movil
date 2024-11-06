import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { getEstados, getLocalidades, getMunicipios } from '@app/services/registrosServices';
import { RegistroUsuarioService } from '@app/services/registrosServices'
import { useRouter } from 'expo-router';
//import { format, isValid, parse } from 'date-fns';

export default function RegisterForm() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');


  const [nombre, setName] = useState('');
  const [apellido, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [fecha_nacimiento, setBirthDate] = useState('');
  const [telefono, setPhone] = useState('');
  const [estados, setEstados] = useState<string>('');
  const [municipios, setMunicipios] = useState<string>('');
  const [localidades, setLocalidades] = useState<string>('');
  const [descripcion, setDescripcion] = useState(''); // Añade este estado
  const [habilidades, setHabilidades] = useState(''); // Añade este estado
  const [imagenPerfil, setImagenPerfil] = useState(''); // Añade este estad

  const [showPassword, setShowPassword] = useState(false);
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [isMunicipalityModalVisible, setIsMunicipalityModalVisible] = useState(false);
  const [isLocalityModalVisible, setIsLocalityModalVisible] = useState(false);

  /* const [estados, setEstados] = useState<string>('');
   const [municipios, setMunicipios] = useState<string>('');
   const [localidades, setLocalidades] = useState<string>('');*/

  const router = useRouter();

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    fecha_nacimiento: '',
    telefono: '',
    estado: '',
    municipio: '',
    localidad: '',
  });

  const validateForm = () => {
    let formErrors = { ...errors };
    let isValid = true;

    if (!nombre) {
      formErrors.nombre = 'El nombre es obligatorio.';
      isValid = false;
    }

    if (!apellido) {
      formErrors.apellido = 'El apellido es obligatorio.';
      isValid = false;
    }

    if (!email) {
      formErrors.email = 'El correo electrónico es obligatorio.';
      isValid = false;
    } else if (!validateEmail(email)) {
      formErrors.email = 'El correo debe contener un arroba (@) y terminar en .com.';
      isValid = false;
    }

    if (!contrasena) {
      formErrors.contrasena = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (!validatePassword(contrasena)) {
      formErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres y al menos una letra mayúscula.';
      isValid = false;
    }

    if (!telefono) {
      formErrors.telefono = 'El teléfono es obligatorio.';
      isValid = false;
    } else if (!validatePhone(telefono)) {
      formErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos.';
      isValid = false;
    }

    if (!fecha_nacimiento) {
      formErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
      isValid = false;
    }

    if (!selectedState) {
      formErrors.estado = 'El estado es obligatorio.';
      isValid = false;
    }

    if (!selectedMunicipality) {
      formErrors.municipio = 'El municipio es obligatorio.';
      isValid = false;
    }

    if (!selectedLocality) {
      formErrors.localidad = 'La localidad es obligatoria.';
      isValid = false;
    }

    if (!descripcion) {
      formErrors.descripcion = 'La descripción es obligatoria.';
      isValid = false;
    }

    if (!habilidades) {
      formErrors.habilidades = 'Las habilidades son obligatorias.';
      isValid = false;
    }

    if (!imagenPerfil) {
      formErrors.imagenPerfil = 'La imagen de perfil es obligatoria.';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (contrasena) => /^(?=.*[A-Z]).{8,}$/.test(contrasena);
  const validatePhone = (telefono) => /^\d{10}$/.test(telefono);

  // Validación y formato de fecha
  const validateDate = (date: string) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return dateRegex.test(date);
  };

  const handleDateChange = (date: string) => {
    const formattedText = date.replace(/[^0-9/]/g, '');
    if (formattedText.length === 2 || formattedText.length === 5) {
      setBirthDate(formattedText + '/');
    } else {
      setBirthDate(formattedText);
    }

    if (formattedText.length === 10 && validateDate(formattedText)) {
      const [day, month, year] = formattedText.split('/');
      setBirthDate(`${year}-${month}-${day}`);
    }
  };

  const handleSubmit = async () => {
    // Validación básica
    if (!nombre || !apellido || !email || !contrasena || !fecha_nacimiento || !telefono || !estados || !municipios || !localidades ) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    console.log(nombre, apellido, email, contrasena, fecha_nacimiento, telefono, estados, municipios, localidades)
    try {
      const fechaNacimientoDate = typeof fecha_nacimiento === "string"
        ? fecha_nacimiento
        : fecha_nacimiento.toISOString().split("T")[0];

      // Llamada al servicio para registrar la empresa
      const response = await RegistroUsuarioService(
        nombre,
        apellido,
        email,
        contrasena,
        fechaNacimientoDate,
        telefono,
        selectedState.nomgeo,         // Asegura que exista selectedState antes de acceder a nomgeo
        selectedMunicipality.nomgeo,  // Asegura que exista selectedMunicipality antes de acceder a nomgeo
        selectedLocality.nomgeo,
      );

      Alert.alert("Éxito", "Registro completado. Revisa tu correo y confirma tu cuenta");
      console.log("Usuario registrada:", response);
      router.push("/login"); // Redirige a la página de login o dashboard
    } catch (error) {
      console.error("Error al registrar la Usuario:", error);
      Alert.alert("Error", "Hubo un problema al registrar la Usuario. Inténtalo de nuevo.");
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
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Regístrate</Text>

        {/* Nombre */}
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={15} color="black" />
          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setName} />
        </View>
        {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}

        {/* Apellido */}
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={15} color="black" />
          <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setLastName} />
        </View>
        {errors.apellido ? <Text style={styles.errorText}>{errors.apellido}</Text> : null}

        {/* Teléfono */}
        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={15} color="black" />
          <TextInput style={styles.input} placeholder="Teléfono" keyboardType="phone-pad" value={telefono} onChangeText={setPhone} />
        </View>
        {errors.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}

        {/* Fecha de Nacimiento */}
        <View style={styles.inputContainer}>
          <FontAwesome name="calendar" size={15} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Fecha Nacimiento (dd/mm/yyyy)"
            value={fecha_nacimiento}
            onChangeText={handleDateChange} // Llamar a handleDateChange para formatear y validar
            maxLength={10} // Limitar a 10 caracteres (dd/mm/yyyy)
          />
        </View>
        {errors.fecha_nacimiento ? <Text style={styles.errorText}>{errors.fecha_nacimiento}</Text> : null}

        {/* Correo Electrónico */}
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={15} color="black" />
          <TextInput style={styles.input} placeholder="Correo Electrónico" keyboardType="email-address" value={email} onChangeText={setEmail} />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Contraseña */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={15} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={contrasena}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="black" />
          </TouchableOpacity>
        </View>
        {errors.contrasena ? <Text style={styles.errorText}>{errors.contrasena}</Text> : null}

        {/* Dropdown para Estado */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setIsStateModalVisible(true)}>
          <Text>{selectedState ? selectedState.nomgeo : 'Seleccionar Estado'}</Text>
          <MaterialIcons name="arrow-drop-down" size={15} color="black" />
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
        {errors.estado ? <Text style={styles.errorText}>{errors.estado}</Text> : null}

        {/* Dropdown para Municipio */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setIsMunicipalityModalVisible(true)}>
          <Text>{selectedMunicipality ? selectedMunicipality.nomgeo : 'Seleccionar Municipio'}</Text>
          <MaterialIcons name="arrow-drop-down" size={15} color="black" />
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
        {errors.municipio ? <Text style={styles.errorText}>{errors.municipio}</Text> : null}

        {/* Dropdown para Localidad */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setIsLocalityModalVisible(true)}>
          <Text>{selectedLocality ? selectedLocality.nomgeo : 'Seleccionar Localidad'}</Text>
          <MaterialIcons name="arrow-drop-down" size={15} color="black" />
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
        {errors.localidad ? <Text style={styles.errorText}>{errors.localidad}</Text> : null}


        {/* Submit button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 30,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  dropdown: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#3a78d5',
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    margin: 30,
    width: 300,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
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