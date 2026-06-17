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
import DocumentsPage from "../pages/documents/DocumentsPage";
import CreateDocumentsPage from "../pages/documents/CreateDocumentsPage";
import EditDocumentsPage from "../pages/documents/EditDocumentsPage";
import NewsPage from "../pages/news/NewsPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import UsersPage from "../pages/users/UsersPage";
import CreateUsersPage from "../pages/users/CreateUsersPage";
import EditUsersPage from "../pages/users/EditUsersPage";
import NewsDetailPage from "../pages/news/NewsDetailPage";
import PayrollsPage from "../pages/payroll/PayrollsPage";
import CreatePayrollsPage from "../pages/payroll/CreatePayrollsPage";
import EditPayrollPage from "../pages/payroll/EditPayrollPage";
import VacationsPage from "../pages/vacations/VacationsPage";


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

                <Route

                    path="/dashboard/documents/crear"

                    element={
                    <AdminRoute>
                        <DashboardLayout>
                            <CreateDocumentsPage />
                        </DashboardLayout>
                    </AdminRoute>
                    }
                />

                <Route

                    path="/dashboard/documents/editar/:id"

                    element={
                    <AdminRoute>
                        <DashboardLayout>
                            <EditDocumentsPage />
                        </DashboardLayout>
                    </AdminRoute>
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

                <Route
                    path="/dashboard/news/:id"
                    element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <NewsDetailPage />
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

                <Route

                    path="/dashboard/users/editar/:id"

                    element={
                        <AdminRoute>
                            <DashboardLayout>
                                <EditUsersPage />
                            </DashboardLayout>
                        </AdminRoute>
                    }
                />

                <Route

                    path="/dashboard/users/create"

                    element={
                        <AdminRoute>
                            <DashboardLayout>
                                <CreateUsersPage />
                            </DashboardLayout>
                        </AdminRoute>
                    }
                />

                {/* ADMIN PAYROLLS */}
                <Route

                    path="/dashboard/payrolls"

                    element={
                        <AdminRoute>
                            <DashboardLayout>
                                <PayrollsPage/>
                            </DashboardLayout>
                        </AdminRoute>
                    }
                />

                <Route

                    path="/dashboard/payrolls/crear"

                    element={
                        <AdminRoute>
                            <DashboardLayout>
                                <CreatePayrollsPage/>
                            </DashboardLayout>
                        </AdminRoute>
                    }
                />

                <Route

                    path="/dashboard/payrolls/editar/:id"

                    element={
                        <AdminRoute>
                            <DashboardLayout>
                                <EditPayrollPage/>
                            </DashboardLayout>
                        </AdminRoute>
                    }
                />

                {/* ADMIN VACACIONES */}
                <Route

                    path="/dashboard/vacations"

                    element={
                        <AdminRoute>
                            <DashboardLayout>
                                <VacationsPage/>
                            </DashboardLayout>
                        </AdminRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}