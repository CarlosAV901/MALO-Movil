import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CrearPostulacionScreen() {
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [detalles, setDetalles] = useState('');
  const [salario, setSalario] = useState('');
  const [horario, setHorario] = useState('');
  const [habilidades, setHabilidades] = useState(['Skills aqui', 'Skills aqui', 'Skills aqui']);
  const [nuevaHabilidad, setNuevaHabilidad] = useState(''); // Estado para la nueva habilidad

  const handleEliminarHabilidad = (index) => {
    const nuevasHabilidades = habilidades.filter((_, i) => i !== index);
    setHabilidades(nuevasHabilidades);
  };

  const handleAgregarHabilidad = () => {
    if (nuevaHabilidad.trim()) {
      setHabilidades([...habilidades, nuevaHabilidad]);
      setNuevaHabilidad(''); // Limpiar el campo de entrada
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text>Genera nuevas oportunidades</Text>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>
    
      {/* Detalles del puesto */}
      <Text style={styles.label}>Detalles del puesto</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe los detalles del puesto..."
        value={detalles}
        onChangeText={setDetalles}
      />

      {/* Salario y Horario */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Salario</Text>
          <TextInput
            style={styles.inputSmall}
            placeholder="Rango salario"
            value={salario}
            onChangeText={setSalario}
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="Rango Salario"
            value={salario}
            onChangeText={setSalario}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Horario</Text>
          <TextInput
            style={styles.inputSmall}
            placeholder="Horario am"
            value={horario}
            onChangeText={setHorario}
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="Horario"
            value={horario}
            onChangeText={setHorario}
          />
        </View>
      </View>

      {/* Botón para subir imagen o video */}
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Subir imagen/video</Text>
      </TouchableOpacity>

      {/* Habilidades requeridas */}
      <Text style={styles.label}>Habilidades Requeridas</Text>
      <View style={styles.habilidadesContainer}>
        {habilidades.map((habilidad, index) => (
          <View key={index} style={styles.habilidad}>
            <Text>{habilidad}</Text>
            <TouchableOpacity onPress={() => handleEliminarHabilidad(index)}>
              <Text style={styles.eliminarText}>✖</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Input para nueva habilidad */}
      <TextInput
        style={styles.input}
        placeholder="Escribe una nueva habilidad..."
        value={nuevaHabilidad}
        onChangeText={setNuevaHabilidad}
      />
      
      {/* Botón para agregar nueva habilidad */}
      <TouchableOpacity
        style={styles.addSkillButton}
        onPress={handleAgregarHabilidad}
      >
        <Text style={styles.addSkillText}>Agregar Habilidad</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addSkillButton}
      >
        <Text style={styles.addSkillText}>Publicar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 10,
    height: 40,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 10,
    height: 40,
  },
  uploadButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    marginRight: 10,
  },
  habilidadesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  habilidad: {
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  eliminarText: {
    marginLeft: 10,
    color: '#ff0000',
  },
  addSkillButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  addSkillText: {
    color: '#fff',
    fontSize: 16,
  },
});
