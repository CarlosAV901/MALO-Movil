import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { AuthContext } from "@app/context/AuthContext";

const AgregarEmpleo = () => {
  const { user } = useContext(AuthContext); // Obtén el ID de la empresa
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");
  const [salarioMinimo, setSalarioMinimo] = useState<number>(0);
  const [salarioMaximo, setSalarioMaximo] = useState<number>(0);
  const [horario, setHorario] = useState<string>("");
  const [multimediaNombre, setMultimediaNombre] = useState<string>("");
  const [multimediaTipo, setMultimediaTipo] = useState<string>("");
  const [multimediaContenido, setMultimediaContenido] = useState<string>("");
 console.log("empresa",user)
  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert("Error", "No se pudo encontrar el ID de la empresa.");
      return;
    }

    const empleoData = {
      titulo,
      descripcion,
      empresa_id: user.id, // Usa el ID de la empresa del contexto
      ubicacion,
      salario_minimo: salarioMinimo,
      salario_maximo: salarioMaximo,
      horario,
      multimediaNombre,
      multimediaTipo,
      multimediaContenido,
    };

    try {
      const response = await fetch("https://malo-backend-empleos.onrender.com/api/Empleo/PostEmpleo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar el empleo");
      }

      Alert.alert("Éxito", "Empleo agregado exitosamente");
      // Puedes redirigir o reiniciar el formulario aquí

    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView>

   
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título del empleo" />

      <Text style={styles.label}>Descripción</Text>
      <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder="Descripción" multiline />

      <Text style={styles.label}>Ubicación</Text>
      <TextInput style={styles.input} value={ubicacion} onChangeText={setUbicacion} placeholder="Ubicación" />

      <Text style={styles.label}>Salario Mínimo</Text>
      <TextInput style={styles.input} value={String(salarioMinimo)} onChangeText={(text) => setSalarioMinimo(Number(text))} placeholder="Salario Mínimo" keyboardType="numeric" />

      <Text style={styles.label}>Salario Máximo</Text>
      <TextInput style={styles.input} value={String(salarioMaximo)} onChangeText={(text) => setSalarioMaximo(Number(text))} placeholder="Salario Máximo" keyboardType="numeric" />

      <Text style={styles.label}>Horario</Text>
      <TextInput style={styles.input} value={horario} onChangeText={setHorario} placeholder="Horario" />

      <Text style={styles.label}>Nombre de Multimedia</Text>
      <TextInput style={styles.input} value={multimediaNombre} onChangeText={setMultimediaNombre} placeholder="Nombre" />

      <Text style={styles.label}>Tipo de Multimedia</Text>
      <TextInput style={styles.input} value={multimediaTipo} onChangeText={setMultimediaTipo} placeholder="Tipo" />

      <Text style={styles.label}>Contenido de Multimedia</Text>
      <TextInput style={styles.input} value={multimediaContenido} onChangeText={setMultimediaContenido} placeholder="Contenido" multiline />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Agregar Empleo</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AgregarEmpleo;
