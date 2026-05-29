import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import DashboardPage from "../pages/dashboard/DashboardPage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfilePage from "../pages/profile/ProfilePage";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
export default function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/"
                    element={<LoginPage />}
                />

                {/* DASHBOARD */}

                <Route

                    path="/dashboard"

                    element={

                            <DashboardLayout>

                                <DashboardPage />

                            </DashboardLayout>
                    }
                />

                {/* PERFIL */}

                <Route

                    path="/dashboard/profile"

                    element={

                    
                        <DashboardLayout>

                            <ProfilePage />

                        </DashboardLayout>

                    }
                />



            </Routes>

        </BrowserRouter>
    );
}