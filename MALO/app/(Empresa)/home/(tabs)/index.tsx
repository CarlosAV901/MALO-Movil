import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "@app/context/AuthContext";
import axios from "axios";

export default function JobSearchScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applicantsCount, setApplicantsCount] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        "https://malo-backend-documentos.onrender.com/api/Documento/GetDocumentos"
      );
      if (!response.ok) throw new Error("Error al obtener los documentos");
      const documentsData = await response.json();
      setDocuments(documentsData);
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    }
  };

  // Fetch users for a specific job and filter documents
  const fetchUsuariosPorEmpleo = async (empleoId) => {
    try {
      const response = await fetch(
        "https://malo-backend-empleos.onrender.com/api/Aplicacion/obtener-usuarios-por-empleo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ empleoID: empleoId }),
        }
      );
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const usersData = await response.json();

      // Filter documents by user IDs
      const usuarioIds = usersData.map((user) => user.usuario_id);
      const filteredDocuments = documents.filter((doc) =>
        usuarioIds.includes(doc.usuario_id)
      );

      // Combine documents with users
      const combinedData = usersData.map((user) => ({
        ...user,
        documentos: filteredDocuments.filter(
          (doc) => doc.usuario_id === user.usuario_id
        ),
      }));

      setUsuarios(combinedData);
    } catch (error) {
      console.error("Error al obtener usuarios y documentos:", error);
    }
  };
  const fetchCompanyNames = async () => {
    try {
      const response = await axios.get(
        "https://malo-backend-empresas.onrender.com/api/Empresa/GetEmpresa"
      );
      const companies = response.data.reduce((acc, company) => {
        acc[company.id] = company.nombre;
        return acc;
      }, {});
      setCompanyNames(companies);
    } catch (error) {
      console.error("Error al obtener los nombres de las empresas:", error);
    }
  };

  const fetchApplicantsCount = async (empleoID) => {
    try {
      const response = await axios.post(
        "https://malo-backend-empleos.onrender.com/api/Aplicacion/contar-aplicaciones-por-empleo",
        { empleoID }
      );
      setApplicantsCount((prevCounts) => ({
        ...prevCounts,
        [empleoID]: response.data, // Suponiendo que `count` es la respuesta de la API
      }));
    } catch (error) {
      console.error("Error al contar los postulados:", error);
    }
  };
  // Fetch jobs filtered by empresa_id
  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos"
      );
      if (!response.ok) throw new Error("Error al obtener empleos");
      const data = await response.json();
      data.forEach((job) => fetchApplicantsCount(job.empleoId));
      const filteredByEmpresa = data.filter(
        (job) => job.empresa_id === user?.id
      );
      setJobs(filteredByEmpresa);
    } catch (error) {
      console.error("Error al obtener empleos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyNames();
    fetchJobs();
    fetchDocuments();
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
          {companyNames[item.empresa_id] || "Nombre no disponible"}
        </Text>
        <Text style={styles.companyName}>{item.horario}</Text>
        <Text style={styles.companyName}>
          Minimo: ${item.salario_minimo}, Maximo: ${item.salario_maximo}
        </Text>
        <Text style={styles.companyName}>
          Postulados: {applicantsCount[item.empleoId] || 0}
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
      <Text style={styles.usuarioName}>
        Fecha Aplicación: {item.fecha_aplicacion}
      </Text>
      {item.documentos.length > 0 ? (
        <FlatList
          data={item.documentos}
          keyExtractor={(doc) => `${doc.nombre}-${doc.contenido}`} // Use both name and content for unique keys
          renderItem={({ item: doc }) => (
            <View>
              <Text>Documento: {doc.nombre}</Text>
              {/* To show PDF or allow download */}
              <TouchableOpacity onPress={() => downloadPdf(doc.contenido)}>
                <Text style={{ color: "blue" }}>Descargar PDF</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No hay documentos asociados</Text>
      )}
    </View>
  );

  const downloadPdf = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Postulaciones</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <>
          <FlatList
            data={jobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.empleoId}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <Text style={styles.sectionTitle}>Usuarios aplicados</Text>
          <FlatList
            data={usuarios}
            renderItem={renderUsuarioItem}
            keyExtractor={(item) => item.usuario_id}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F5F5" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerText: { fontSize: 24, fontWeight: "bold", marginLeft: 16 },
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
  applyButton: {
    marginTop: 8,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  applyButtonText: { color: "#FFF", textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 16 },
  usuarioCard: { padding: 16, backgroundColor: "#dddd", marginBottom: 8 },
  usuarioName: { fontWeight: "bold" },
});
