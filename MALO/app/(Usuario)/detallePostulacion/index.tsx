import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import axios from "axios";

export default function Detalles() {
  const router = useRouter();
  const {
    user_id,
    empleoId,
    multimediaContenido,
    titulo,
    descripcion,
    salario_minimo,
    salario_maximo,
    horario,
    habilidades,
    empresaNombre
  } = useLocalSearchParams();

  const habilidadesArray = habilidades ? habilidades.split(",") : [];

  // State to track if user has applied
  const [hasApplied, setHasApplied] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const sendApplication = async () => {
    try {
      const response = await axios.post(
        "https://malo-backend-empleos.onrender.com/api/Aplicacion/aplicar-empleo",
        {
          usuarioID: user_id,
          empleoID: empleoId,
        }
      );
      if (response.status === 200) {
        setHasApplied(true); // Set state to disable the button
        alert(`Genial te haz postulado ${titulo}.`);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Genial te has postulado",
            body: `Genial ahora espera la respuesta de la empresa ${titulo}`,
          },
          trigger: { seconds: 2 },
        });
      }
    } catch (error) {
      console.error("Error al postularse:", error);
      alert("Error al postularse. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Detalles</Text>
        </View>

        <ImageBackground
          source={{
            uri:
              multimediaContenido ||
              "https://www.laizquierdadiario.mx/IMG/arton136155.jpg?1565924685",
          }}
          style={styles.image}
        >
          <View style={styles.jobInfo}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.jobTitle}>
                  {titulo || "Título no disponible"}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.detailItem}>
                  Horario: {horario || "No especificado"}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.company}>
                  {empresaNombre || "Empresa no disponible"}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.detailItem}>
                  Sueldo: ${salario_minimo || "No especificado"} - $
                  {salario_maximo || "No especificado"}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>
            {descripcion || "Descripción no disponible"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles principales</Text>
          <Text style={styles.detailItem}>
            Horario: {horario || "No especificado"}
          </Text>
          <Text style={styles.detailItem}>
            Sueldo: ${salario_minimo || "No especificado"} - $
            {salario_maximo || "No especificado"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.applyButton, hasApplied && styles.disabledButton]}
          onPress={sendApplication}
          disabled={hasApplied} // Disable button if user has applied
        >
          <Text style={styles.applyButtonText}>
            {hasApplied ? "Postulado" : "Postular"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C2C42",
    padding: 16,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 16,
    justifyContent: "flex-end", // Para que el contenido se coloque en la parte inferior
  },
  jobInfo: {
    backgroundColor: "rgba(60,55,68,0.8)",
    borderTopStartRadius: 20,
    padding: 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Para que los elementos ocupen todo el espacio
    marginBottom: 8, // Separación entre las filas
  },
  column: {
    flex: 1,
  },
  salary: {
    fontSize: 16,
    color: "#DDD",
    marginBottom: 4,
  },
  jobType: {
    fontSize: 14,
    color: "#AAA",
  },
  company: {
    fontSize: 14,
    color: "#AAA",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B4C5E4",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#BBB",
  },
  detailItem: {
    fontSize: 14,
    color: "#BBB",
    marginBottom: 4,
  },
  skillItem: {
    fontSize: 14,
    color: "#BBB",
  },
  applyButton: {
    backgroundColor: "#86A4FF",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  disabledButton: {
    backgroundColor: "#ccc", // Light gray for disabled state
  },
});
