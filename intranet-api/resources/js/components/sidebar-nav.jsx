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
} from "@mui/icons-material";

import {
    useNavigate,
    useLocation,
} from "react-router-dom";

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
    },

    {
        path: "/dashboard/profile",
        label: "Mi Perfil",
        icon: Person,
    },

    {
        path: "/dashboard/documents",
        label: "Documentos",
        icon: Description,
    },

    {
        path: "/dashboard/calendar",
        label: "Calendario",
        icon: CalendarMonth,
    },

    {
        path: "/dashboard/news",
        label: "Noticias",
        icon: Group,
    },

    {
        path: "/dashboard/users",
        label: "Usuarios",
        icon: Work,
    },
    {
        path: "/dashboard/payrolls",
        label: "Liquidaciones",
        icon: Business,
    },
];

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export function SidebarNav() {

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

        navigate("/");
    };

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <aside
            className="
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
            "
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

                    onClick={() =>
                        navigate("/dashboard")
                    }

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
                            rounded-lg
                            bg-card/10
                            backdrop-blur
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <Business
                            className="w-6 h-6"
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
                    navItems.map((item) => {

                        const Icon = item.icon;

                        const isActive =
                            location.pathname === item.path;

                        return (

                            <button

                                key={item.path}

                                onClick={() =>
                                    navigate(item.path)
                                }

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

                                    ${
                                        isActive
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

                    <Logout
                        className="w-5 h-5"
                    />

                    Cerrar Sesión

                </button>

            </div>

        </aside>
    );
}