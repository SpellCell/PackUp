import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import VerifyEmail from "../pages/auth/VerifyEmail";

import CreateTrip from "../pages/CreateTrip/CreateTrip";
import ExploreTrips from "../pages/ExploreTrips/ExploreTrips";
import TripDetails from "../pages/TripDetails/TripDetails";
import ChatPage from "../pages/Chat/ChatPage";
import JoinTrip from "../pages/JoinTrip/JoinTrip";
import OrganizerRequests from "../pages/JoinRequests/OrganizerRequests";


const AppRoutes = () => {

    return (

        <Routes>

            <Route

                path="/"

                element={<Navigate to="/dashboard" replace />}

            />

            <Route

                path="/login"

                element={<Login />}

            />

            <Route

                path="/register"

                element={<Register />}

            />

            <Route

                path="/dashboard"

                element={

                    <ProtectedRoute>

                        <Dashboard />

                    </ProtectedRoute>

                }

            />
            <Route path="/verify-email" element={<VerifyEmail />} />
             
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

    element={<ExploreTrips />}

/>
<Route

    path="/trips/:id"

    element={<TripDetails />}

/>
<Route

    path="/chat"

    element={<ChatPage />}

/>
<Route

    path="/join-trip"

    element={<JoinTrip />}

/>
<Route

    path="/join-requests"

    element={<OrganizerRequests />}

/>
        </Routes>

    );

};

export default AppRoutes;