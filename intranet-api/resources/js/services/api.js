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
        `${API_URL}/news/${id}`,
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
        `${API_URL}/api/documents/${id}`,
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

export const updateNews = async (id, newsData) => {

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

export const updateDocument = async (id, documentsData) => {

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
                Authorization: `Bearer ${token}`,
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
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
        if (
            userData[key] !== null &&
            userData[key] !== ""
        ) {
            formData.append(
                key,
                userData[key]
            );
        }

    });
    const response = await fetch(
        `${API_URL}/register`,
        {
            method: "POST",

            headers: {

                Accept: "application/json",

                Authorization: `Bearer ${token}`

            },
            body: formData
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(
            data.message ||
            "Error al crear usuario"
        );
    }

    return data;
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
    const formData = new FormData();

    formData.append("_method", "PUT");

    Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined) {
            if (key === "foto_perfil" && !(userData[key] instanceof File)) {
                return;
            }
            formData.append(key, userData[key]);
        }
    });

    const response = await fetch(
        `${API_URL}/users/${id}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: formData,
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

export const updatePayroll = async (id, payrollData) => {

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
        `${API_URL}/api/payrolls/${id}`,
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

    const token = localStorage.getItem("token");

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
    console.log("Traer vacaciones desde API", data);

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
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fecha_inicio: vacationData.fecha_inicio,
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

export const getLaborDocuments = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/labor-documents`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al obtener documentos laborales"
        );
    }

    return data;
};

export const getMyLaborDocuments = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/my-labor-documents`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al obtener mis documentos laborales"
        );
    }

    return data;
};

export const getLaborDocumentById = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/labor-documents/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );

    const data = await response.json();
    return data;
};

export const createLaborDocument = async (laborDocumentData) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("user_id", laborDocumentData.user_id);
    formData.append("tipo_documento", laborDocumentData.tipo_documento);
    if (laborDocumentData.fecha_emision) {
        formData.append("fecha_emision", laborDocumentData.fecha_emision);
    }
    if (laborDocumentData.fecha_vencimiento) {
        formData.append("fecha_vencimiento", laborDocumentData.fecha_vencimiento);
    }
    if (laborDocumentData.observaciones) {
        formData.append("observaciones", laborDocumentData.observaciones);
    }
    if (laborDocumentData.archivo) {
        formData.append("archivo", laborDocumentData.archivo);
    }

    const response = await fetch(
        `${API_URL}/labor-documents`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al crear documento laboral"
        );
    }

    return data;
};

export const updateLaborDocument = async (id, laborDocumentData) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("user_id", laborDocumentData.user_id);
    formData.append("tipo_documento", laborDocumentData.tipo_documento);
    if (laborDocumentData.fecha_emision) {
        formData.append("fecha_emision", laborDocumentData.fecha_emision);
    }
    if (laborDocumentData.fecha_vencimiento) {
        formData.append("fecha_vencimiento", laborDocumentData.fecha_vencimiento);
    }
    if (laborDocumentData.observaciones) {
        formData.append("observaciones", laborDocumentData.observaciones);
    }
    if (laborDocumentData.archivo) {
        formData.append("archivo", laborDocumentData.archivo);
    }

    const response = await fetch(
        `${API_URL}/labor-documents/${id}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al actualizar documento laboral"
        );
    }

    return data;
};

export const deleteLaborDocument = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/labor-documents/${id}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al eliminar documento laboral"
        );
    }

    return data;
};

export const previewLaborDocument = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/labor-documents/${id}/preview`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Error al visualizar documento laboral");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
};

export const downloadLaborDocument = async (id, nombreArchivo) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/labor-documents/${id}/download`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("No fue posible descargar el documento laboral");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};

export const getWallPosts = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/wall`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener publicaciones");
    }
    return data;
};

export const createWallPost = async (formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/wall/posts`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al crear publicación");
    }
    return data;
};

export const deleteWallPost = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/wall/posts/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar publicación");
    }
    return data;
};

export const createWallComment = async (postId, contentData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/wall/posts/${postId}/comments`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(contentData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al agregar comentario");
    }
    return data;
};

export const deleteWallComment = async (commentId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/wall/comments/${commentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar comentario");
    }
    return data;
};

export const reactToWallPost = async (postId, reactionData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/wall/posts/${postId}/react`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(reactionData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al reaccionar a la publicación");
    }
    return data;
};

export const deleteDocument = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/documents/${id}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar el documento");
    }
    return data;
};

export const deleteNews = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/news/${id}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar la noticia");
    }
    return data;
};

export const getEventById = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/events/${id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener el evento");
    }
    return data;
};

export const updateEvent = async (id, eventData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/events/${id}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(eventData)
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el evento");
    }
    return data;
};

export const deleteEvent = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/events/${id}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar el evento");
    }
    return data;
};

export const updateMyAvatar = async (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("foto_perfil", file);

    const response = await fetch(
        `${API_URL}/me/avatar`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al actualizar la foto de perfil"
        );
    }

    return data;
};