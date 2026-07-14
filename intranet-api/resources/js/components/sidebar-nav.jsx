import React from "react";

import {
    Home,
    Person,
    Description,
    CalendarMonth,
    Group,
    Work,
    Business,
    Logout,
    Sunny,
    Forum
} from "@mui/icons-material";

import {
    useNavigate,
    useLocation,
} from "react-router-dom";

import { useAuth } from "../hooks/AuthContext";

/*
|--------------------------------------------------------------------------
| NAV ITEMS
|--------------------------------------------------------------------------
*/

const navItems = [

    {
        path: "/dashboard",
        label: "Inicio",
        icon: Home,
        roles: ["admin", "user"],
    },

    {
        path: "/dashboard/profile",
        label: "Mi Perfil",
        icon: Person,
        roles: ["admin", "user"],
    },

    {
        path: "/dashboard/documents",
        label: "Documentos",
        icon: Description,
        roles: ["admin", "user"],
    },

    {
        path: "/dashboard/calendar",
        label: "Calendario",
        icon: CalendarMonth,
        roles: ["admin", "user"],
    },

    {
        path: "/dashboard/news",
        label: "Noticias",
        icon: Group,
        roles: ["admin", "user"],
    },

    {
        path: "/dashboard/wall",
        label: "Muro",
        icon: Forum,
        roles: ["admin", "user"],
    },

    {
        path: "/dashboard/users",
        label: "Usuarios",
        icon: Work,
        roles: ["admin"],
    },
    // {
    //     path: "/dashboard/payrolls",
    //     label: "Liquidaciones",
    //     icon: Business,
    //     roles: ["admin"],
    // },
    // {
    //     path: "/dashboard/vacations",
    //     label: "Vacaciones",
    //     icon: Sunny,
    //     roles: ["admin"],
    // },

    {
        path: "/dashboard/labor-documents",
        label: "Documentos Laborales",
        icon: Description,
        roles: ["admin"],
    },
];

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export function SidebarNav({ open, onClose }) {

    /*
    |--------------------------------------------------------------------------
    | NAVIGATION
    |--------------------------------------------------------------------------
    */

    const navigate = useNavigate();

    const location = useLocation();

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        if (onClose) onClose();

        navigate("/");
    };

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    const { user } = useAuth();

    const filteredNavItems =
        navItems.filter(
            item =>
                (user && item.roles.includes(user.role)) ||
                (!user && item.path === "/dashboard/news")
        );

    return (
        <>
            {/* Backdrop overlay for mobile screen viewports */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}
            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-40
                    h-screen
                    w-64
                    bg-primary
                    text-primary-foreground
                    flex
                    flex-col
                    transition-transform
                    duration-300
                    ease-in-out
                    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >

            {/* LOGO */}

            <div
                className="
                    p-6
                    border-b
                    border-primary-foreground/10
                "
            >

                <button

                    onClick={() => {
                        navigate("/dashboard");
                        if (onClose) onClose();
                    }}

                    className="
                        flex
                        items-center
                        gap-3
                        w-full
                        text-left
                    "
                >

                    <div
                        className="
                            w-10
                            h-10
                            overflow-hidden
                            rounded-lg
                            bg-white
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <img
                            src="/imagenes/logoAxioma.jpg"
                            alt="Logo"
                            className="w-full h-full object-contain"
                        />

                    </div>

                    <div>

                        <h2
                            className="
                                font-bold
                                tracking-tight
                            "
                        >
                            AXIOMA S.A.
                        </h2>

                        <p
                            className="
                                text-xs
                                text-primary-foreground/70
                            "
                        >
                            Intranet
                        </p>

                    </div>

                </button>

            </div>

            {/* NAVIGATION */}

            <nav
                className="
                    flex-1
                    p-4
                    space-y-1
                    overflow-y-auto
                "
            >

                {

                    filteredNavItems.map((item) => {

                        const Icon = item.icon;

                        const isActive =
                            location.pathname === item.path;

                        return (

                            <button

                                key={item.path}

                                onClick={() => {
                                    navigate(item.path);
                                    if (onClose) onClose();
                                }}

                                className={`
                                    w-full
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    rounded-lg
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-200

                                    ${isActive
                                        ? "bg-card/15 text-primary-foreground"
                                        : "text-primary-foreground/70 hover:bg-card/10 hover:text-primary-foreground"
                                    }
                                `}
                            >

                                <Icon
                                    className="w-5 h-5"
                                />

                                {item.label}

                            </button>
                        );
                    })
                }

            </nav>

            {/* FOOTER */}

            <div
                className="
                    p-4
                    border-t
                    border-primary-foreground/10
                    space-y-1
                "
            >
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-lg
                            text-sm
                            font-semibold
                            text-primary-foreground/70
                            hover:bg-card/10
                            hover:text-primary-foreground
                            transition-all
                            duration-200
                        "
                    >
                        <Logout className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                ) : (
                    <button
                        onClick={() => navigate("/")}
                        className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-lg
                            text-sm
                            font-semibold
                            text-primary-foreground/70
                            hover:bg-card/10
                            hover:text-primary-foreground
                            transition-all
                            duration-200
                        "
                    >
                        <Logout className="w-5 h-5" />
                        Iniciar Sesión
                    </button>
                )}
            </div>

        </aside>
        </>
    );
}