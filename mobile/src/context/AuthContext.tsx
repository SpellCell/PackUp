import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  User,
} from "../services/authService";

import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "../services/notificationSocket";

const TOKEN_KEY = "packup_auth_token";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

function normalizeUser(user: any): User {
  return {
    id: String(
      user?.id ??
        user?._id ??
        ""
    ),
    name: user?.name ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
  };
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    restoreSession();

    return () => {
      disconnectNotificationSocket();
    };
  }, []);

  useEffect(() => {
    if (!token) {
      disconnectNotificationSocket();
      return;
    }

    connectNotificationSocket(token);
  }, [token]);

  async function restoreSession() {
    try {
      const savedToken =
        await SecureStore.getItemAsync(
          TOKEN_KEY
        );

      if (!savedToken) {
        return;
      }

      const response =
        await getCurrentUser(
          savedToken
        );

      const normalizedUser =
        normalizeUser(
          response.user
        );

      setToken(savedToken);
      setUser(normalizedUser);

    } catch {
      await SecureStore.deleteItemAsync(
        TOKEN_KEY
      );

      setToken(null);
      setUser(null);

    } finally {
      setLoading(false);
    }
  }

  async function login(
    email: string,
    password: string
  ) {
    const response =
      await loginUser(
        email,
        password
      );

    await SecureStore.setItemAsync(
      TOKEN_KEY,
      response.token
    );

    const normalizedUser =
      normalizeUser(
        response.user
      );

    setToken(response.token);
    setUser(normalizedUser);
  }

  async function logout() {
    disconnectNotificationSocket();

    setToken(null);
    setUser(null);

    try {
      await SecureStore.deleteItemAsync(
        TOKEN_KEY
      );
    } catch {
      // Auth state is already cleared.
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}