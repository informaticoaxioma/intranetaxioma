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

    const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al crear evento");
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