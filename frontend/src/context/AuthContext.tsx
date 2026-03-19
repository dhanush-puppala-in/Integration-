import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Role, ROLES } from "../utils/constants";
import { authApi } from "../api/auth";

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: Role) => Promise<void>;
  registerChapter: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: Role) => {
    if (role === ROLES.ADMIN) {
      // Mock Admin login until backend supports it
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const mockUser: User = { id: "1", name: "Admin User", role: role };
          const mockToken = "mock-jwt-token";
          setUser(mockUser);
          setToken(mockToken);
          localStorage.setItem("token", mockToken);
          localStorage.setItem("user", JSON.stringify(mockUser));
          resolve();
        }, 500);
      });
    }

    // Call actual backend chapter leader login
    const response = await authApi.loginChapterLeader({ email, password });
    const { accessToken, refreshToken, user: userData } = response.data;
    
    const loggeduser: User = {
      id: userData.id,
      name: userData.name,
      role: role,
    };

    setUser(loggeduser);
    setToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(loggeduser));
  };

  const registerChapter = async (data: any) => {
    // We only register chapter leader based on backend controller provided
    await authApi.registerChapterLeader(data);
    // Registration pending verification according to controller
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, registerChapter, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
