import React, { useState } from "react";

import { SidebarNav } from "../components/sidebar-nav"
import { HeaderNav } from "../components/header-nav"

export default function DashboardLayout({
    children
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="min-h-screen bg-background animate-fade-in">

            {/* SIDEBAR */}

            <SidebarNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* CONTENT */}

            <div className="ml-0 md:ml-64 transition-all duration-300">

                {/* HEADER */}

                <HeaderNav onMenuClick={() => setSidebarOpen(true)} />

                {/* MAIN */}

                <main className="p-4 md:p-6">

                    {children}

                </main>

            </div>

        </div>
    );
}
