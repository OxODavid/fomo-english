"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAdmin = adminUser?.role === "admin";

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        try {
          // Set token for API calls
          apiClient.setToken(token);

          // Try to get current admin user profile
          const profile = await apiClient.getProfile();
          if (profile.role === "admin") {
            setAdminUser(profile);
          } else {
            // Not an admin, clear token
            localStorage.removeItem("admin_token");
            apiClient.removeToken();
          }
        } catch (error) {
          console.error("Failed to initialize admin auth:", error);
          localStorage.removeItem("admin_token");
          apiClient.removeToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("🔐 Attempting admin login for:", email);

      // Mock admin login for development
      if (email === "admin@fomoenglish.com" && password === "admin123") {
        console.log("🔄 Using mock admin login");
        const mockAdminUser = {
          id: "admin-1",
          email: "admin@fomoenglish.com",
          name: "Admin User",
          role: "admin",
        };

        const mockToken = "mock-admin-token-" + Date.now();

        localStorage.setItem("admin_token", mockToken);
        apiClient.setToken(mockToken);
        setAdminUser(mockAdminUser);

        console.log("✅ Mock admin login successful");
        toast({
          title: "Welcome back!",
          description: "Successfully logged in as admin (mock mode).",
        });

        return true;
      }

      // Try real API login
      const response = await apiClient.login({ email, password });
      console.log("📥 Login response:", response);

      if (response.user.role !== "admin") {
        console.log("❌ User is not admin, role:", response.user.role);
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        return false;
      }

      // Store admin token separately
      console.log("💾 Storing admin token:", response.access_token);
      localStorage.setItem("admin_token", response.access_token);
      apiClient.setToken(response.access_token);
      setAdminUser(response.user);

      console.log("✅ Admin login successful");
      toast({
        title: "Welcome back!",
        description: "Successfully logged in as admin.",
      });

      return true;
    } catch (error: any) {
      console.error("❌ Admin login failed:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    apiClient.removeToken();
    setAdminUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isLoading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
