export interface LoginResponse {
  token: string;
}

// Ahora loginService acepta la url como un tercer parámetro
export const loginService = async (
  email: string,
  contrasena: string,
  apiUrl: string // Recibe la URL de la API dinámicamente
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${apiUrl}/api/Auth/login`, {
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
