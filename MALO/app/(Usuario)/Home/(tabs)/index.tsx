import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

export default function BuscarEmpleoScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Restaurantes");

  const jobs = [
    {
      id: 1,
      title: "Camarero",
      company: "KFC (Empresa)",
      salary: "$2000 - 3000",
      category: "Restaurantes",
      imageUrl:
        "https://www.laizquierdadiario.mx/IMG/arton136155.jpg?1565924685",
    },
    {
      id: 2,
      title: "Recepcionista",
      company: "Hotel XYZ",
      salary: "$2500 - 3500",
      category: "Restaurantes",
      imageUrl:
        "https://www.laizquierdadiario.mx/IMG/arton136155.jpg?1565924685",
    },
    {
      id: 3,
      title: "Cajero",
      company: "Supermercado ABC",
      salary: "$1800 - 2500",
      category: "Supermercados",
      imageUrl:
        "https://www.laizquierdadiario.mx/IMG/arton136155.jpg?1565924685",
    },
    {
      id: 4,
      title: "Mecánico",
      company: "Taller Mecánico 123",
      salary: "$3000 - 4000",
      category: "Mecanica",
      imageUrl:
        "https://www.laizquierdadiario.mx/IMG/arton136155.jpg?1565924685",
    },
  ];

  // Filtrar empleos según la categoría seleccionada
  const filteredJobs = jobs.filter((job) => job.category === selectedCategory);

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
      <View>
        <ScrollView horizontal style={styles.tabContainer}>
          {[
            "Restaurantes",
            "Hoteles",
            "Supermercados",
            "Asiendas",
            "Mecanica",
            "Electricos",
          ].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.tab,
                  selectedCategory === category && styles.activeTab,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Job Cards */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.jobList}>
            {filteredJobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <Image source={{ uri: job.imageUrl }} style={styles.jobImage} />
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCompany}>{job.company}</Text>
                <Text style={styles.jobSalary}>{job.salary}</Text>
                <TouchableOpacity style={styles.applyButton}onPress={() => router.push('/(Usuario)/detallePostulacion')}>
                  <Text style={styles.applyButtonText}>Postularme</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <Text style={styles.title}>Te pueden Interesar</Text>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.jobList}>
            {filteredJobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <Image source={{ uri: job.imageUrl }} style={styles.jobImage} />
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCompany}>{job.company}</Text>
                <Text style={styles.jobSalary}>{job.salary}</Text>
                <TouchableOpacity style={styles.applyButton} onPress={() => router.push('/(Usuario)/detallePostulacion')}>
                  <Text style={styles.applyButtonText}>Postularme</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 30,
    marginTop: 20,
  },
  tabContainer: {
    marginVertical: 5, // Cambiado a 5 para reducir el espacio
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
    flexDirection: "row",
    marginTop: 1,
  },
  jobCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 200, // Ajusta el ancho según sea necesario
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
