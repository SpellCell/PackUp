import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

import VerifyEmail from "../pages/auth/VerifyEmail";

import CreateTrip from "../pages/CreateTrip/CreateTrip";
import ExploreTrips from "../pages/ExploreTrips/ExploreTrips";
import TripDetails from "../pages/TripDetails/TripDetails";
import MyTrips from "../pages/MyTrips/MyTrips";

import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";

import ChatPage from "../pages/Chat/ChatPage";

import JoinTrip from "../pages/JoinTrip/JoinTrip";
import OrganizerRequests from "../pages/JoinRequests/OrganizerRequests";

import Notifications from "../pages/Notifications/Notifications";

import Expenses from "../pages/Expenses/Expenses";
import ExpenseDashboard from "../pages/Expenses/ExpenseDashboard";

const AppRoutes = () => (
    <Routes>

        {/* Public */}

        <Route
            path="/"
            element={<Home />}
        />

        {/* Authentication */}

        <Route
            path="/login"
            element={<Login />}
        />

        <Route
            path="/register"
            element={<Register />}
        />

        <Route
            path="/verify-email"
            element={<VerifyEmail />}
        />

        {/* Dashboard */}

        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
        />

        {/* Trips */}

        <Route
            path="/create-trip"
            element={
                <ProtectedRoute>
                    <CreateTrip />
                </ProtectedRoute>
            }
        />

        <Route
            path="/explore"
            element={
                <ProtectedRoute>
                    <ExploreTrips />
                </ProtectedRoute>
            }
        />

        <Route
            path="/my-trips"
            element={
                <ProtectedRoute>
                    <MyTrips />
                </ProtectedRoute>
            }
        />

        <Route
            path="/trips/:id"
            element={
                <ProtectedRoute>
                    <TripDetails />
                </ProtectedRoute>
            }
        />

        {/* Profile */}

        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            }
        />

        {/* Settings */}

        <Route
            path="/settings"
            element={
                <ProtectedRoute>
                    <Settings />
                </ProtectedRoute>
            }
        />

        {/* Chat */}

        <Route
            path="/chat"
            element={
                <ProtectedRoute>
                    <ChatPage />
                </ProtectedRoute>
            }
        />

        {/* Join Trip */}

        <Route
            path="/join-trip"
            element={
                <ProtectedRoute>
                    <JoinTrip />
                </ProtectedRoute>
            }
        />

        {/* Join Requests */}

        <Route
            path="/join-requests"
            element={
                <ProtectedRoute>
                    <OrganizerRequests />
                </ProtectedRoute>
            }
        />

        {/* Notifications */}

        <Route
            path="/notifications"
            element={
                <ProtectedRoute>
                    <Notifications />
                </ProtectedRoute>
            }
        />

        {/* Expenses */}

        <Route
            path="/expenses"
            element={
                <ProtectedRoute>
                    <Expenses />
                </ProtectedRoute>
            }
        />

        <Route
            path="/expenses/:tripId"
            element={
                <ProtectedRoute>
                    <ExpenseDashboard />
                </ProtectedRoute>
            }
        />

        {/* Unknown */}

        <Route
            path="*"
            element={
                <Navigate
                    to="/"
                    replace
                />
            }
        />

    </Routes>
);

export default AppRoutes;