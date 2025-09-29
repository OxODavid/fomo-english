"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  subscriptionStatus: "none" | "active" | "expired"
  subscriptionPlan?: string
  subscriptionExpiry?: Date
  purchasedCourses: string[]
  joinedCommunity: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateSubscription: (plan: string, expiry: Date) => void
  addPurchasedCourse: (courseId: string) => void
  hasAccess: (type: "course" | "subscription", id?: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("fomo-english-user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        // Convert expiry date string back to Date object
        if (parsedUser.subscriptionExpiry) {
          parsedUser.subscriptionExpiry = new Date(parsedUser.subscriptionExpiry)
        }
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("fomo-english-user")
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("fomo-english-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("fomo-english-user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - in real app, this would come from your backend
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        subscriptionStatus: "none",
        purchasedCourses: [],
        joinedCommunity: false,
      }

      setUser(mockUser)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        subscriptionStatus: "none",
        purchasedCourses: [],
        joinedCommunity: false,
      }

      setUser(newUser)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateSubscription = (plan: string, expiry: Date) => {
    if (user) {
      setUser({
        ...user,
        subscriptionStatus: "active",
        subscriptionPlan: plan,
        subscriptionExpiry: expiry,
        joinedCommunity: true,
      })
    }
  }

  const addPurchasedCourse = (courseId: string) => {
    if (user && !user.purchasedCourses.includes(courseId)) {
      setUser({
        ...user,
        purchasedCourses: [...user.purchasedCourses, courseId],
      })
    }
  }

  const hasAccess = (type: "course" | "subscription", id?: string): boolean => {
    if (!user) return false

    if (type === "subscription") {
      return user.subscriptionStatus === "active" && user.subscriptionExpiry && user.subscriptionExpiry > new Date()
    }

    if (type === "course" && id) {
      return user.purchasedCourses.includes(id)
    }

    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateSubscription,
        addPurchasedCourse,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
