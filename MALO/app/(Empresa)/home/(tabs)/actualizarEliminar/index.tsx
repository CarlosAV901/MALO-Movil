import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator,RefreshControl } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthContext } from '@app/context/AuthContext'; // Asegúrate de que esta ruta sea correcta

export default function JobSearchScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext); // Obtén el contexto para acceder a empresa_id
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 

  const fetchJobs = async () => {
    try {
      const response = await fetch("https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos");
      if (!response.ok) {
        throw new Error('Error al obtener los empleos');
      }
      const data = await response.json();
      
      // Filtra los empleos según el empresa_id del usuario
      const filteredJobs = data.filter(job => job.empresa_id === user?.id);
      setJobs(filteredJobs);
    } catch (error) {
      console.error(error);
      alert('Error al obtener los empleos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };
  const renderJobItem = ({ item }) => (
    <View style={styles.jobCard}>
      <Image source={{ uri: item.multimediaContenido }} style={styles.jobImage} />
      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{item.titulo}</Text>
        <Text style={styles.companyName}><FontAwesome name="check" size={20} color="gray" /> {item.descripcion}</Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => router.push({
            pathname: '/(Empresa)/home/(tabs)/actualizarEliminar/actualizar',
            params: {
              multimediaContenido: item.multimediaContenido,
              titulo: item.titulo,
              descripcion: item.descripcion,
              empresa: item.empresa,
              horario: item.horario,
              ubicacion: item.ubicacion,
              salario_minimo: item.salario_minimo,
              salario_maximo: item.salario_maximo,
              empleoId:item.empleoId
            }
          })}
        >
          <Text style={styles.applyButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterItem}>
          <FontAwesome name="search" size={20} color="gray" />
          <TextInput placeholder="Buscar empleo..." style={styles.filterInput} />
        </View>
        <View style={styles.filterItem}>
          <FontAwesome name="map-marker" size={20} color="gray" />
          <TextInput placeholder="Ciudad o estado..." style={styles.filterInput} />
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Horario</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Sueldo</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

       {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.empleoId.toString()}
          contentContainerStyle={styles.jobList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filters: {
    marginBottom: 16,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#DDD',
    marginBottom: 8,
  },
  filterInput: {
    flex: 1,
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#DDD',
    flex: 1,
    marginLeft: 8,
  },
  jobList: {
    paddingBottom: 16,
    backgroundColor: '#E9E9E9',
  },
  jobCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  jobImage: {
    width: 130,
    height: 150,
    borderRadius: 8,
  },
  jobDetails: {
    marginLeft: 16,
    flex: 1,
  },
  jobTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  companyName: {
    color: '#555',
  },
  applicants: {
    color: '#888',
  },
  applyButton: {
    marginTop: 8,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});
