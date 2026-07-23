import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, getMe } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadUser();

    }, []);

    const loadUser = async () => {

        const token = localStorage.getItem("token");

        if (!token) {

            setLoading(false);

            return;

        }

        try {

            const { data } = await getMe();

            setUser(data.user);

        } catch (error) {

            localStorage.removeItem("token");

            setUser(null);

        } finally {

            setLoading(false);

        }

    };

    const login = async (credentials) => {

        const { data } = await loginUser(credentials);

        localStorage.setItem("token", data.token);

        setUser(data.user);

        return data;

    };

    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                setUser,
                loadUser
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);