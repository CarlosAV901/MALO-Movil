const API_EMPRESA = "https://malo-backend-empresas.onrender.com";
const API_USUARIO = "https://malo-backend.onrender.com";
const API_Estado = "https://gaia.inegi.org.mx/wscatgeo/v2/mgee/"; 
const API_Municipio= "https://gaia.inegi.org.mx/wscatgeo/v2/mgem"; 
const API_Localidad="https://gaia.inegi.org.mx/wscatgeo/v2/localidades";

//USUARIO
export interface UsuarioResponse {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  fecha_nacimiento: string;
  telefono: string;
  estado: string;
  municipio: string;
  localidad: string;
  habilidades: string,
  descripcion: string;
  imagen_perfil: string
}

export const RegistroUsuarioService = async (nombre: string, apellido: string, email: string, contrasena: string, fecha_nacimiento: Date, telefono: string, estado: string, municipio: string, localidad: string, habilidades: string, descripcion: string, imagen_perfil: string): Promise<UsuarioResponse> => {
    try {
      const response = await fetch(`${API_USUARIO}/api/Usuario/InsertarUsuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          contrasena,
          fecha_nacimiento,
          telefono,
          estado: estado || "",
          municipio: municipio || "",
          localidad: localidad || "",
          habilidades,       
          descripcion,      
          imagen_perfil     
        }),
      });
  
      console.log("Estado de la respuesta:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        throw new Error(errorData.message || "Error de autenticación");
      }
  
      const data: UsuarioResponse = await response.json();
      console.log("Datos de respuesta:", data);
      return data;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  };

  //EMPRESA
export interface EmpresaResponse {
  nombre: string;
  industria: string;
  ubicacion: string;
  email: string;
  contrasena: string;
}

export const RegistroEmpresaService = async (
  nombre: string,
  industria: string,
  ubicacion: string,
  email: string,
  contrasena: string
): Promise<EmpresaResponse> => {
  try {
    const response = await fetch(`${API_EMPRESA}/api/Empresa/agregar-empresa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, industria, ubicacion, email, contrasena }),
    });

    console.log("Estado de la respuesta:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      throw new Error(errorData.message || "Error de autenticación");
    }

    const data: EmpresaResponse = await response.json();
    console.log("Datos de respuesta:", data);
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};


// Servicio para obtener los estados
export const getEstados = async () => {
  try {
    const response = await fetch(API_Estado);
    const data = await response.json();
   // console.log("Estados:", data); // Verifica la estructura de los datos
    return data.datos || data; // Asegúrate de retornar el objeto correcto
  } catch (error) {
    console.error("Error al obtener los estados:", error);
  }
};

// Servicio para obtener los municipios
export const getMunicipios = async (codigoEstado: string) => {
  try {
    const response = await fetch(`${API_Municipio}/${codigoEstado}`);
    const data = await response.json();
 //   console.log("Municipios:", data); // Verifica la estructura de los datos
    return data.datos || data;
  } catch (error) {
    console.error("Error al obtener los municipios:", error);
  }
};

// Servicio para obtener las localidades
export const getLocalidades = async (codigoMunicipio: string) => {
  try {
    const response = await fetch(`${API_Localidad}/${codigoMunicipio}`);
    const data = await response.json();
  //  console.log("Localidades:", data); // Verifica la estructura de los datos
    return data.datos || data;
  } catch (error) {
    console.error("Error al obtener las localidades:", error);
  }
};