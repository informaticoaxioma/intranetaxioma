import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Valida si un usuario es administrador del departamento de tecnología/TI.
 */
export function isTechAdmin(user) {
    if (!user || user.role !== "admin") return false;

    // Si viene el atributo computado del backend
    if (typeof user.can_access_ticketera === "boolean") {
        return user.can_access_ticketera;
    }

    // Validación por departamento en frontend
    const dept = (user.departamento || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    return (
        dept.includes("tecnolog") ||
        dept === "ti" ||
        dept === "it" ||
        dept.includes("inform") ||
        dept.includes("sistemas")
    );
}

/**
 * Ruta protegida exclusiva para administradores del departamento de tecnología.
 */
export default function TechAdminRoute({ children }) {
    const token = localStorage.getItem("token");
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
        user = null;
    }

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!isTechAdmin(user)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
