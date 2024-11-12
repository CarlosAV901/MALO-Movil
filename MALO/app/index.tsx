import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Modal 
} from "react-native";
import logo from "@img/logoAmarillo.png"; // Asegúrate de que esta ruta sea correcta
import { useRouter } from "expo-router";
import RegistroModal from "@app/components/modales/Seleccion";

export default function WelcomeScreen() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleCompanyRegistration = () => {
    closeModal();
    router.push('/(Empresa)/registro')
  };

  const handleUserRegistration = () => {
    closeModal();
   router.push('/(Usuario)/registro')
  };

  return (
    <ImageBackground
      source={require("@img/fondo.jpeg")} // Cambia esta ruta por la ruta de tu imagen de fondo
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(Usuario)/Home/(tabs)/buscar")}
        >
          <Text style={styles.buttonText}>Explora</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            openModal();
          }}
        >
          <Text style={styles.buttonText}>Regístrate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      {/* Modal */}
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>¿Eres una Empresa o un Usuario?</Text>
              <TouchableOpacity style={styles.optionButton} onPress={handleCompanyRegistration}>
                <Text style={styles.optionText}>Empresa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={handleUserRegistration}>
                <Text style={styles.optionText}>Usuario</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 400,
    height: 450,
    marginBottom: 1,
    marginTop: -350,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#090C9B",
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: "center",
    margin: 30,
  },
  button2: {
    backgroundColor: "#3a78d5",
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: "center",
    margin: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  /* modal */
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    backgroundColor: "#3a78d5",
    borderRadius: 30,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
  closeText: {
    color: "#888",
    marginTop: 10,
  },
});
