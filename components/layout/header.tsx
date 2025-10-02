"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  Globe,
  User,
  Settings,
  LogOut,
  Trophy,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { LoginModal } from "@/components/auth/login-modal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.workbook"), href: "/workbook" },
    { name: t("nav.courses"), href: "/courses" },
    { name: t("nav.subscription"), href: "/subscription" },
  ];

  const toggleLocale = () => {
    setLocale(locale === "en" ? "vi" : "en");
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg primary-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gradient">
                FOMO English
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Language Switcher & User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLocale}
                className="flex items-center space-x-1"
              >
                <Globe className="h-4 w-4" />
                <span>{locale === "en" ? "VI" : "EN"}</span>
              </Button>

              {user ? (
                <div
                  className="relative"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all focus:ring-2 focus:ring-primary/20"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile_image_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>

                  {/* Custom Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profile_image_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                            {user.email}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs font-medium text-yellow-600">
                              {user.points} points
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <User className="mr-2 h-4 w-4" />
                          {locale === "en" ? "My Profile" : "Hồ sơ của tôi"}
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          {locale === "en" ? "My Courses" : "Khóa học của tôi"}
                        </Link>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {locale === "en" ? "Logout" : "Đăng xuất"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  className="primary-gradient text-white"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  {t("nav.getStarted")}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLocale}
                    className="flex items-center space-x-1"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{locale === "en" ? "VI" : "EN"}</span>
                  </Button>

                  {user ? (
                    <div className="flex flex-col space-y-2 w-full">
                      <div className="flex items-center space-x-3 p-2 border rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profile_image_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <div className="flex items-center space-x-1">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600">
                              {user.points} points
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          asChild
                        >
                          <Link
                            href="/profile"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <User className="h-4 w-4 mr-1" />
                            {locale === "en" ? "Profile" : "Hồ sơ"}
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleLogout}
                          className="text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="primary-gradient text-white"
                      onClick={() => setIsLoginModalOpen(true)}
                    >
                      {t("nav.getStarted")}
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
