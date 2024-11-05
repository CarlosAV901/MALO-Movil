import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RegistrationModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>¿Eres una Empresa o un Usuario?</Text>
          <TouchableOpacity style={styles.optionButton} onPress={() => { onClose(); router.push('/(Usuario)/registro')}}>
            <Text style={styles.optionText}>Empresa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => { onClose(); router.push('/(Empresa)/registro') }}>
            <Text style={styles.optionText}>Usuario</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 5,
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

export default RegistrationModal;
