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
  Modal,
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
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);

  const scheduleOptions = [
    "Tiempo completo",
    "Medio tiempo",
    "Dia",
    "Noche",
    "",
  ];
  const salaryOptions = ["1000", "2000", "3000", ""];
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout } = authContext!;
  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos"
      );
      if (!response.ok) throw new Error("Error al obtener los empleos");

      const data = await response.json();
      const filteredByEmpresa = data.filter((job) => job.empresa_id);
      setJobs(filteredByEmpresa);
      setFilteredJobs(filteredByEmpresa);
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
    const delayFilter = setTimeout(() => applyFilters(), 6000);
    return () => clearTimeout(delayFilter);
  }, [searchTerm, location, scheduleFilter, salaryFilter, jobs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let updatedJobs = jobs;
    if (searchTerm)
      updatedJobs = updatedJobs.filter((job) =>
        job.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (location)
      updatedJobs = updatedJobs.filter((job) =>
        job.ubicacion.toLowerCase().includes(location.toLowerCase())
      );
    if (scheduleFilter)
      updatedJobs = updatedJobs.filter((job) => job.horario === scheduleFilter);
    if (salaryFilter) {
      const salary = parseFloat(salaryFilter);
      if (!isNaN(salary))
        updatedJobs = updatedJobs.filter(
          (job) => job.salario_minimo <= salary && job.salario_maximo >= salary
        );
    }
    setFilteredJobs(updatedJobs);
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
        <Text style={styles.applicants}>Postulados: {item.applicants}</Text>
        {isAuthenticated ? (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              router.push({
                pathname: "/(Usuario)/detallePostulacion",
                params: {
                  user_id:user?.id,
                  empleoId:item.empleoId,
                  multimediaContenido: encodeURIComponent(item.multimediaContenido),
                  titulo: item.titulo,
                  descripcion: item.descripcion,
                  empresa: item.empresa,
                  horario: item.horario,
                  ubicacion: item.ubicacion,
                  salario_minimo: item.salario_minimo,
                  salario_maximo: item.salario_maximo,
                },
              })
            }}
          >
            <Text style={styles.applyButtonText}>Postular</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() =>
              router.push("/login")}>
            <Text style={styles.applyButtonText}>Inicia Sesion</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderDropdown = (options, setFilter, isOpen, setIsOpen) => (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.modalOption}
              onPress={() => {
                setFilter(option);
                setIsOpen(false);
              }}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Filters */}
      <View style={styles.filters}>
        <View style={styles.filterItem}>
          <FontAwesome name="search" size={20} color="gray" />
          <TextInput
            placeholder="Buscar empleo..."
            style={styles.filterInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <View style={styles.filterItem}>
          <FontAwesome name="map-marker" size={20} color="gray" />
          <TextInput
            placeholder="Ciudad o estado..."
            style={styles.filterInput}
            value={location}
            onChangeText={setLocation}
          />
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsScheduleOpen(true)}
          >
            <Text>{scheduleFilter || "Horario"}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsSalaryOpen(true)}
          >
            <Text>{salaryFilter || "Sueldo"}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Modals */}
      {renderDropdown(
        scheduleOptions,
        setScheduleFilter,
        isScheduleOpen,
        setIsScheduleOpen
      )}
      {renderDropdown(
        salaryOptions,
        setSalaryFilter,
        isSalaryOpen,
        setIsSalaryOpen
      )}

      {/* Job List */}
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
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "#FFF",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    alignItems: "center",
  },
});
