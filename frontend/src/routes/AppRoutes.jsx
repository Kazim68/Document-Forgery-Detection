import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from '../components/SignUp.jsx';
import SignIn from '../components/SignIn.jsx';
import OtpVerification from '../components/OtpVerfication.jsx';
import Dashboard from '../components/Dashboard.jsx';
import NotFound from '../components/NotFound.jsx';
import LandingPage from '../components/LandingPage.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import PrivateRoute from './ProtectedRoutes.jsx';
import GuestRoute from './GuestRoutes.jsx';
import AdminRoute from './AdminRoutes.jsx';

const AppRoutes = () => {
    return (
        <>

            <BrowserRouter>
                <Routes>


                    {/* Default Landing */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Guest Routes */}
                    <Route path="/signup" element={
                        <GuestRoute>
                            <SignUp />
                        </GuestRoute>
                    } />
                    <Route path="/signin" element={
                        <GuestRoute>
                            <SignIn />
                        </GuestRoute>
                    } />
                    <Route path="/verify-otp" element={
                        <GuestRoute>
                            <OtpVerification />
                        </GuestRoute>
                    } />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />



                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />


                </Routes>
            </BrowserRouter>


        </>
    );
};

export default AppRoutes;