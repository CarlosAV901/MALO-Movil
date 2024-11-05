import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BuscarEmpleoScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Restaurantes");

  // Función para obtener los empleos de la API
  const fetchJobs = async () => {
    try {
      const response = await fetch("https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos");
      if (!response.ok) {
        throw new Error('Error al obtener los empleos');
      }
      const data = await response.json();
      setJobs(data); // Actualiza el estado con los empleos obtenidos
    } catch (error) {
      console.error(error);
      alert('Error al obtener los empleos');
    } finally {
      setLoading(false); // Termina la carga
    }
  };

  useEffect(() => {
    fetchJobs(); // Llama a la función al montar el componente
  }, []);

  // Filtrar empleos según la categoría seleccionada
  const filteredJobs = jobs.filter((job) => job.categoria === selectedCategory);

  const renderJobItem = ({ item }) => (
    <View style={styles.jobCard}>
      <Image source={{ uri: item.multimediaContenido }} style={styles.jobImage} />
      <Text style={styles.jobTitle}>{item.titulo}</Text>
      <Text style={styles.jobCompany}>{item.empresa}</Text>
      <Text style={styles.jobSalary}>{`${item.salario_minimo} - ${item.salario_maximo}`}</Text>
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => router.push({
          pathname: '/(Usuario)/detallePostulacion',
          params: {
            multimediaContenido: item.multimediaContenido,
            titulo: item.titulo,
            descripcion: item.descripcion,
            empresa: item.empresa,
            horario: item.horario,
            ubicacion: item.ubicacion,
            salario_minimo: item.salario_minimo,
            salario_maximo: item.salario_maximo
          }
        })}
      >
        <Text style={styles.applyButtonText}>Postularme</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Manos A La Obra</Text>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <Text style={styles.title}>Encuentra el mejor empleo para ti</Text>
      <View style={styles.filterItem}>
        <FontAwesome name="search" size={20} color="gray" />
        <TextInput placeholder="Buscar empleo..." style={styles.filterInput} />
      </View>

      {/* Tabs */}
      <ScrollView horizontal style={styles.tabContainer}>
        {["Restaurantes", "Hoteles", "Supermercados", "Asiendas", "Mecanica", "Electricos"].map((category) => (
          <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)}>
            <Text style={[styles.tab, selectedCategory === category && styles.activeTab]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Job List */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.empleoId.toString()}
          horizontal
          contentContainerStyle={styles.jobList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#DDD",
    marginBottom: 8,
  },
  filterInput: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 30,
    marginTop: 20,
  },
  tabContainer: {
    marginVertical: 5,
  },
  tab: {
    marginRight: 20,
    fontSize: 16,
    color: "#333",
  },
  activeTab: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  jobList: {
    paddingBottom: 16,
  },
  jobCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 200,
  },
  jobImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  jobCompany: {
    fontSize: 14,
    color: "#666",
  },
  jobSalary: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
