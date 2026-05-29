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

                        <PrivateRoute>

                            <DashboardLayout>

                                <DashboardPage />

                            </DashboardLayout>

                        </PrivateRoute>
                    }
                />

                {/* NEWS */}

                <Route

                    path="/dashboard/news"

                    element={

                        <PrivateRoute>

                            <DashboardLayout>

                                <NewsPage />

                            </DashboardLayout>

                        </PrivateRoute>
                    }
                />

                {/* DOCUMENTOS */}

                <Route

                    path="/dashboard/documents"

                    element={

                        <PrivateRoute>

                            <DashboardLayout>

                                <DocumentsPage />

                            </DashboardLayout>

                        </PrivateRoute>
                    }
                />

                {/* CALENDARIO */}

                <Route

                    path="/dashboard/calendar"

                    element={

                        <PrivateRoute>

                            <DashboardLayout>

                                <CalendarPage />

                            </DashboardLayout>

                        </PrivateRoute>
                    }
                />

                {/* PERFIL */}

                <Route

                    path="/dashboard/profile"

                    element={

                        <PrivateRoute>

                            <DashboardLayout>

                                <ProfilePage />

                            </DashboardLayout>

                        </PrivateRoute>
                    }
                />

                {/* ADMIN USERS */}

                <Route

                    path="/dashboard/users"

                    element={

                        <AdminRoute>

                            <DashboardLayout>

                                <UsersPage />

                            </DashboardLayout>

                        </AdminRoute>
                    }
                />
                {/* 404 */}

                <Route
                    path="*"
                    element={
                        <Navigate to="/" />
                    }
                /> 

            </Routes>

        </BrowserRouter>
    );
}