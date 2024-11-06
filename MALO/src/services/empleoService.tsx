// services/empleoService.ts
export interface Empleo {
  titulo: string;
  descripcion: string;
  empresa_id: string; // ID de la empresa que está realizando la publicación
  ubicacion: string;
  salario_minimo: number;
  salario_maximo: number;
  horario: string;
  multimediaNombre?: string; // Opcional
  multimediaTipo?: string; // Opcional
  multimediaContenido?: string; // Opcional
}

export const postEmpleo = async (empleo: Empleo): Promise<void> => {
  const apiUrl = "https://malo-backend-empleos.onrender.com/api/Empleo/PostEmpleo";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al agregar el empleo");
    }

    console.log("Empleo agregado exitosamente");
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
