import React, { useState } from "react";

import { SidebarNav } from "../components/sidebar-nav"
import { HeaderNav } from "../components/header-nav"

export default function DashboardLayout({
    children
}) {

    return (

        <div className="min-h-screen bg-background">

            {/* SIDEBAR */}

            <SidebarNav />

            {/* CONTENT */}

            <div className="ml-64">

                {/* HEADER */}

                <HeaderNav />

                {/* MAIN */}

                <main className="p-6">

                    {children}

                </main>

            </div>

        </div>
    );
}
