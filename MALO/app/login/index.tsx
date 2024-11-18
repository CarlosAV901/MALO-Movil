import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import logo from "@img/logoBlanco.png";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AuthContext } from "@app/context/AuthContext";
import * as Notifications from 'expo-notifications';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [contrasena, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, isLoading, user } = useContext(AuthContext);
  const router = useRouter();
  const [isEmpresa, setIsEmpresa] = useState<boolean>(false);
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
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso requerido", "Necesitas permisos de notificación para recibirlas.");
      return false;
    }
    return true;
  };
  
  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Bienvenido a MALO",
        body: "Genial ahora busca o postula un trabajo",
      },
      trigger: { seconds: 2 },
    });
  };
  
  const handleLogin = async () => {
    //router.push("/(Usuario)/home/(tabs)/agregar");
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    sendTestNotification();
     try {
      await login(email, contrasena, isEmpresa);

      if (isEmpresa) {
        router.replace("/(Empresa)/home/(tabs)/actualizarEliminar");
      } else {
        router.replace("/(Usuario)/Home/(tabs)/buscar");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } 
  };

  function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
  }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.topSection}>
          <Svg
            height="30%"
            width="100%"
            viewBox="0 0 1440 320"
            style={styles.wave}
          >
            <Path
              fill="#fff"
              d="M0,224L48,213.3C96,203,192,181,288,160C384,139,480,117,576,138.7C672,160,768,224,864,213.3C960,203,1056,117,1152,101.3C1248,85,1344,139,1392,165.3L1440,192V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
            />
          </Svg>
          <Svg
            height="30%"
            width="100%"
            viewBox="0 0 1440 320"
            style={styles.wave}
          >
            <Path
              fill="#B4C5E4"
              d="M -1 218 L 48 213.3 C 96 203 192 181 288 160 C 384 139 480 117 576 138.7 C 672 160 768 224 864 213.3 C 960 203 1056 117 1152 101.3 C 1248 85 1344 139 1392 165.3 L 1440 192 V 320 H 1392 C 1344 320 1248 320 1135 302 C 997 290 960 210 863 215 C 761 224 671 160 576 140 C 476 118 399 136 286 161 C 119 197 117 198 49 215 H 0 Z"
            />
          </Svg>

          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formSection}>
              <Text style={styles.label}>Correo</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Ingresa tu correo"
                placeholderTextColor="#ccc"
              />

              <View>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    value={contrasena}
                    onChangeText={setPassword}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor="#ccc"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.iconContainer}
                  >
                    <TabBarIcon
                      name={showPassword ? "eye-slash" : "eye"}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Soy una empresa</Text>
                  <Switch style={{padding:6}} value={isEmpresa} onValueChange={setIsEmpresa} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => router.replace(`/olvideContrasena`)}>
            <Text style={styles.link}>Olvidé la contraseña</Text>
          </TouchableOpacity>
          <View style={styles.horizontalLine}></View>
          <TouchableOpacity
          onPress={() => {openModal();}}>
            <Text style={styles.link}>No tienes cuenta?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
              <TouchableOpacity style={{padding: 15,backgroundColor: "#000",borderRadius: 30,marginVertical: 5,width: "100%",alignItems: "center", }}onPress={closeModal}>
                <Text style={styles.closeText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    backgroundColor: "#2D17E8",
    height: "70%",
  },
  wave: {
    position: "absolute",
    bottom: -50,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 400,
    height: 300,
    marginBottom: 1,
    marginTop: 40,
  },
  formContainer: {
    padding: 20,
    paddingTop: 1,
  },
  formSection: {
    paddingHorizontal: 20,
    marginTop: -90,
    justifyContent: "center",
    paddingVertical: 70,
  },
  label: {
    color: "white",
  },
  input: {
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#38d5",
    color: "#fff",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#38d5",
    color: "#fff",
    paddingRight: 40,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    padding: 5,
    margin:5
  },
  toggleIcon: {
    fontSize: 18,
  },
  button: {
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
  linksContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin:4
  },
  link: {
    color: "#340bdb",
    textAlign: "center",
    marginVertical: 5,
  },
  horizontalLine: {
    borderBottomColor: "#000",
    borderBottomWidth: 0.5,
    width: "50%",
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    marginRight: 10,
    color:"#fff"
  },
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
    color: "#000",
    fontSize: 16,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
});
