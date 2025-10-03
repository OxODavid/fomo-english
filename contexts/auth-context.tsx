"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  points: number;
  preferred_language: string;
  profile_image_url?: string;
  course_purchases: any[];
  workbook_purchases: any[];
  course_progress: any[];
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    preferred_language: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    profile_image_url?: string;
    preferred_language?: string;
  }) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  hasPurchasedCourse: (courseId: string) => boolean;
  hasPurchasedWorkbook: (workbookId: string) => boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token and load user profile on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        apiClient.setToken(token);
        try {
          const profile = await apiClient.getProfile();
          setUser(profile);
        } catch (error) {
          console.error("Error loading user profile:", error);
          apiClient.removeToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient.login({ email, password });
      apiClient.setToken(response.access_token);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    preferred_language: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient.register(data);
      apiClient.setToken(response.access_token);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      apiClient.removeToken();
      setUser(null);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    phone?: string;
    profile_image_url?: string;
    preferred_language?: string;
  }): Promise<boolean> => {
    try {
      const updatedUser = await apiClient.updateProfile(data);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const profile = await apiClient.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Refresh profile error:", error);
    }
  };

  const hasPurchasedCourse = (courseId: string): boolean => {
    if (!user) return false;
    return user.course_purchases.some(
      (purchase) =>
        purchase.course?.id === courseId &&
        purchase.payment_status === "completed",
    );
  };

  const hasPurchasedWorkbook = (workbookId: string): boolean => {
    if (!user) return false;
    return user.workbook_purchases.some(
      (purchase) =>
        purchase.workbook?.id === workbookId &&
        purchase.payment_status === "completed",
    );
  };

  const refreshUserData = async () => {
    try {
      const userData = await apiClient.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
        hasPurchasedCourse,
        hasPurchasedWorkbook,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
