import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Detalles () {
  const router = useRouter();

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
          source={{ uri: 'https://www.laizquierdadiario.mx/IMG/arton136155.jpg?1565924685' }} 
          style={styles.image}
        >
          <View style={styles.jobInfo}>
  <View style={styles.row}>
    <View style={styles.column}>
      <Text style={styles.jobTitle}>Ayudante de Cocina</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.jobType}>Tiempo Completo</Text>
    </View>
  </View>

  <View style={styles.row}>
    <View style={styles.column}>
      <Text style={styles.company}>La Duqueza</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.salary}>$2,000 - 3,000</Text>
    </View>
  </View>
</View>
        </ImageBackground>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit praesent, nullam laoreet ver más...
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles principales</Text>
          <Text style={styles.detailItem}>Tipo: Restaurante</Text>
          <Text style={styles.detailItem}>Sexo: Indistinto</Text>
          <Text style={styles.detailItem}>Edad: 30 a 50 años</Text>
          <Text style={styles.detailItem}>Horario: 10:00 a.m a las 6:00 p.m</Text>
          <Text style={styles.detailItem}>Sueldo base</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades necesarias</Text>
          <Text style={styles.skillItem}>- Responsabilidad</Text>
          <Text style={styles.skillItem}>- Iniciativa</Text>
          <Text style={styles.skillItem}>- Trabajo en equipo</Text>
          <Text style={styles.skillItem}>- si</Text>
        </View>

        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Postular</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C42',
    padding: 16,
    paddingTop:30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color:"#fff"
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    justifyContent: 'flex-end', // Para que el contenido se coloque en la parte inferior
  },
  jobInfo: {
    backgroundColor: 'rgba(60,55,68,0.8)',
    borderTopStartRadius: 20,
    padding: 16,
    position: 'absolute', 
    bottom: 0, 
    width: '100%',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Para que los elementos ocupen todo el espacio
    marginBottom: 8, // Separación entre las filas
  },
  column: {
    flex: 1, 
  },
  salary: {
    fontSize: 16,
    color: '#DDD',
    marginBottom: 4,
  },
  jobType: {
    fontSize: 14,
    color: '#AAA',
  },
  company: {
    fontSize: 14,
    color: '#AAA',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B4C5E4',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#BBB',
  },
  detailItem: {
    fontSize: 14,
    color: '#BBB',
    marginBottom: 4,
  },
  skillItem: {
    fontSize: 14,
    color: '#BBB',
  },
  applyButton: {
    backgroundColor: '#86A4FF',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
