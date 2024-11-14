import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "@app/context/AuthContext";

export default function JobSearchScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Nuevo estado para almacenar usuarios
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos"
      );
      if (!response.ok) {
        throw new Error("Error al obtener los empleos");
      }
      const data = await response.json();
      const filteredByEmpresa = data.filter(
        (job) => job.empresa_id === user?.id
      );
      setJobs(filteredByEmpresa);
      setFilteredJobs(filteredByEmpresa);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los empleos");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener usuarios aplicados a un empleo específico
  const fetchUsuariosPorEmpleo = async (empleoId) => {
    try {
      const response = await fetch(
        "https://malo-backend-empleos.onrender.com/api/Aplicacion/obtener-usuarios-por-empleo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ empleoID: empleoId }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const data = await response.json();
      setUsuarios(data); // Almacena los usuarios en el estado
    } catch (error) {
      console.error(error);
      alert("Error al obtener los usuarios");
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
      <Image
        source={{ uri: item.multimediaContenido }}
        style={styles.jobImage}
      />
      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{item.titulo}</Text>
        <Text style={styles.companyName}>
          <FontAwesome name="check" size={20} color="gray" /> {item.descripcion}
        </Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => fetchUsuariosPorEmpleo(item.empleoId)} // Llama a la API de usuarios con el empleoId
        >
          <Text style={styles.applyButtonText}>Ver Usuarios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUsuarioItem = ({ item }) => (
    <View style={styles.usuarioCard}>
      <Text style={styles.usuarioName}>{item.usuario_id}</Text>
      <Text style={styles.usuarioEmail}>{item.fecha_aplicacion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
     <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Postulaciones</Text>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <>
          <FlatList
            data={filteredJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.empleoId}
            contentContainerStyle={styles.jobList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <Text style={styles.sectionTitle}>Usuarios aplicados:</Text>
          <FlatList
            data={usuarios} // Muestra los usuarios
            renderItem={renderUsuarioItem}
            keyExtractor={(item) => item.usuarioID}
            contentContainerStyle={styles.usuarioList}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F5F5" },
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
  filters: { marginBottom: 16 },
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
  filterInput: { flex: 1, marginLeft: 8 },
  jobList: { paddingBottom: 16, backgroundColor: "#E9E9E9" },
  jobCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  jobImage: { width: 130, height: 150, borderRadius: 8 },
  jobDetails: { marginLeft: 16, flex: 1 },
  jobTitle: { fontWeight: "bold", fontSize: 16 },
  companyName: { color: "#555" },
  usuarioList: { color: "#555" },
  applyButton: {
    marginTop: 8,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  applyButtonText: { color: "#FFF", textAlign: "center" },
  applicantCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  usuarioCard: {
    padding: 16,
    backgroundColor: "#FFF",
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  usuarioName: {
    fontWeight: "bold",
  },
  usuarioEmail: {
    color: "#555",
  },
});
