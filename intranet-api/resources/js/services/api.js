const API_URL = "http://127.0.0.1:8000/api";

export async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error en login");
    }

    return data;
}

export async function getUsers() {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/users`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );

    return response.json();
}

export const getUser = async (id) => {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/users/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );


    const text =
        await response.text();


    return JSON.parse(text);
};

export async function createNews(formData) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/news`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al crear noticia");
    }

    return data;
}

export async function getNews() {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/news`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener noticias");
    }

    return await response.json();
}

export const getNewsById = async (id) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:8000/api/news/${id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        }
    );

    console.log("Status:", response.status);

    const data = await response.json();

    console.log("JSON:", data);

    return data;
};

export const getDocumentById = async (id) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:8000/api/documents/${id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        }
    );

    console.log("Status:", response.status);

    const data = await response.json();

    console.log("JSON:", data);

    return data;
};

export const updateNews = async (id,newsData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/news/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json",
                "Accept":
                    "application/json",
                Authorization:
                    `Bearer ${token}`,
            },
            body: JSON.stringify(
                newsData
            ),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Error al actualizar noticia"
        );
    }

    return data;
};

export const updateDocument  = async (id,documentsData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/documents/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json",
                "Accept":
                    "application/json",
                Authorization:
                    `Bearer ${token}`,
            },
            body: JSON.stringify(
                documentsData
            ),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Error al actualizar noticia"
        );
    }

    return data;
};

export const createEvent = async (eventData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/events`,
        {
            method: "POST",
            headers: {
                Authorization:`Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(eventData)
        }
    );
    const data = await response.json();
    if (!response.ok) {
        console.log(data);
        throw new Error(
            data.message
        );
    }
    return data;
};

export const createUser = async (userData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        }
    );

    const text = await response.text();

    return text;
};

export const deleteUser = async (userId) => {

    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/users/${userId}`,
        {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al eliminar usuario"
        );
    }

    return data;
};

export const updateUser = async (id, userData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/users/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al actualizar usuario"
        );
    }

    return data;
};

export const createDocument = async (documentData) => {

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("nombre", documentData.nombre);
    formData.append("categoria", documentData.categoria);
    formData.append("autor", documentData.autor);

    if (documentData.archivo) {
        formData.append(
            "archivo",
            documentData.archivo
        );
    }

    const response = await fetch(
        `${API_URL}/documents`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Error al crear documento"
        );
    }

    return data;
};

export const getDocuments = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/documents`,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al obtener documentos"
        );
    }

    return data;
};

export const previewDocument = async (id) => {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/documents/${id}/preview`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        throw new Error(
            "Error al visualizar documento"
        );
    }

    const blob =
        await response.blob();

    const url =
        window.URL.createObjectURL(blob);

    window.open(
        url,
        "_blank"
    );
};

export const getEvents = async () => {
  const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/events`,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al obtener documentos"
        );
    }

    return data;
};

export const downloadDocument = async (id, nombreArchivo) => {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/documents/${id}/download`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            "No fue posible descargar el documento"
        );
    }

    const blob =
        await response.blob();

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = nombreArchivo;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);
};

export async function getPayrolls() {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/payrolls`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener noticias");
    }

    return await response.json();
}

export async function myPayrolls() {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/my-payrolls`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener noticias");
    }

    return await response.json();
}

export const createPayroll = async (payrollData) => {
    
    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    formData.append("titulo", payrollData.titulo);
    formData.append("periodo", payrollData.periodo);
    formData.append("user_id", payrollData.user_id);
    
    if (payrollData.archivo) {
        formData.append(
            "archivo",
            payrollData.archivo
        );
    }
    const response =
        await fetch(
            `${API_URL}/payrolls`,
            {
                method: "POST",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
                body: formData,
            }
        );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Error al crear liquidación"
        );
    }

    return data;
};

export const downloadPayroll = async (id, tituloArchivo) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/payrolls/${id}/download`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            "No fue posible descargar el documento"
        );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tituloArchivo;
    document.body.appendChild(a);
    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);
};

export const previewPayroll = async (id) => {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/payrolls/${id}/preview`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        throw new Error(
            "Error al visualizar liquidación"
        );
    }

    const blob =
        await response.blob();

    const url =
        window.URL.createObjectURL(blob);

    window.open(
        url,
        "_blank"
    );
};

export const getDashboardStats = async () => {

    const token = localStorage.getItem("token");

    const response =
        await fetch(
            `${API_URL}/stats`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Error obteniendo estadísticas"
        );
    }

    return data;
};

export const updatePayroll  = async (id,payrollData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/payrolls/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json",
                "Accept":
                    "application/json",
                Authorization:
                    `Bearer ${token}`,
            },
            body: JSON.stringify(
                payrollData
            ),
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Error al actualizar noticia"
        );
    }

    return data;
};

export const getPayrolltById = async (id) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:8000/api/payrolls/${id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        }
    );

    console.log("Status:", response.status);

    const data = await response.json();

    console.log("JSON:", data);

    return data;
};

export async function getVacations() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/vacations`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );

    return response.json();
}

export const approveVacation = async (id) => {
    const token = localStorage.getItem("token");
    const response =
        await fetch(
            `${API_URL}/vacations/${id}/approve`,
            {
                method: "PATCH",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    return await response.json();
};

export const rejectVacation = async (id) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
            `${API_URL}/vacations/${id}/reject`,
            {
                method: "PATCH",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    return await response.json();
};

export const getMyVacations = async () => {

    const token =localStorage.getItem("token");

    const response = await fetch(
            `${API_URL}/my-vacations`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    Accept:
                        "application/json",
                },
            }
        );

    const data = await response.json();
    console.log("Traer vacaciones desde API",data);

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Error al obtener mis vacaciones"
        );
    }

    return data;
};

export const createVacation = async (vacationData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
            `${API_URL}/vacations`,
            {
                method: "POST",
                headers: {
                    Authorization:`Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fecha_inicio:vacationData.fecha_inicio,
                    fecha_fin: vacationData.fecha_fin,
                    dias_solicitados: vacationData.dias_solicitados,
                    comentario: vacationData.comentario,
                }),
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Error al crear solicitud de vacaciones"
        );
    }

    return data;
};