import React, { useEffect, useState, useContext } from "react"; 
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "@app/context/AuthContext";

export default function JobSearchScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [scheduleFilter, setScheduleFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "https://malo-backend-empleos.onrender.com/api/Aplicacion/obtener-empleos-por-usuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usuarioID: user?.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los empleos");
      }

      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los empleos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const delayFilter = setTimeout(() => {
      applyFilters();
    }, 3000);

    return () => clearTimeout(delayFilter);
  }, [searchTerm, location, scheduleFilter, salaryFilter, jobs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let updatedJobs = jobs;

    if (searchTerm) {
      updatedJobs = updatedJobs.filter((job) =>
        job.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location) {
      updatedJobs = updatedJobs.filter((job) =>
        job.ubicacion.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (scheduleFilter) {
      updatedJobs = updatedJobs.filter((job) => job.horario === scheduleFilter);
    }

    if (salaryFilter) {
      updatedJobs = updatedJobs.filter((job) => {
        const salary = parseFloat(salaryFilter);
        return job.salario_minimo <= salary && job.salario_maximo >= salary;
      });
    }

    setFilteredJobs(updatedJobs);
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.jobCard}>
      {/* <Image source={{ uri: item.multimediaContenido }} style={styles.jobImage} /> */}
      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{item.titulo}</Text>
       {/*  <Text style={styles.companyName}>
          <FontAwesome name="check" size={20} color="gray" /> {item.descripcion}
        </Text> */}
        <TouchableOpacity
          style={styles.applyButton}
          /* onPress={() =>
            router.push({
              pathname: "/(Usuario)/detallePostulacion",
              params: {
                multimediaContenido: encodeURIComponent(item.multimediaContenido),
                titulo: item.titulo,
                descripcion: item.descripcion,
                empresa: item.empresa,
                horario: item.horario,
                ubicacion: item.ubicacion,
                salario_minimo: item.salario_minimo,
                salario_maximo: item.salario_maximo,
                empleoId: item.empleoId,
              },
            })
          } */
        >
          <Text style={styles.applyButtonText}>Postulado</Text>
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
        <Text style={styles.headerText}>Postulaciones</Text>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>

      

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.empleoId}
          contentContainerStyle={styles.jobList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
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
  filters: {
    marginBottom: 16,
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
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#DDD",
    flex: 1,
    marginLeft: 8,
  },
  jobList: {
    paddingBottom: 16,
    backgroundColor: "#E9E9E9",
  },
  jobCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
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
    fontWeight: "bold",
    fontSize: 16,
  },
  companyName: {
    color: "#555",
  },
  applicants: {
    color: "#888",
  },
  applyButton: {
    marginTop: 8,
    backgroundColor: "#dddd",
    padding: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "#FFF",
    textAlign: "center",
  },
});
