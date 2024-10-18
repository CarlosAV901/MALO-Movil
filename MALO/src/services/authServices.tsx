const API_URL = "https://malo-backend.onrender.com/api/Auth/login";

export interface LoginResponse {
  token: string;
}

export const loginService = async (email: string, contrasena: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, contrasena }),
    });

    console.log("Estado de la respuesta:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      throw new Error(errorData.message || "Error de autenticación");
    }
    
    const data: LoginResponse = await response.json();
    console.log("Datos de respuesta:", data);
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error; 
  }
};
