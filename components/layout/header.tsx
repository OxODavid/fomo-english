'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Menu, X, Globe, User, Settings, LogOut } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { LoginModal } from '@/components/auth/login-modal'

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const { locale, setLocale, t } = useLanguage()
    const { user, logout } = useAuth()

    const navigation = [
        { name: t('nav.home'), href: '/' },
        { name: t('nav.about'), href: '/about' },
        { name: t('nav.workbook'), href: '/workbook' },
        { name: t('nav.courses'), href: '/courses' },
        { name: t('nav.subscription'), href: '/subscription' },
    ]

    const toggleLocale = () => {
        setLocale(locale === 'en' ? 'vi' : 'en')
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg primary-gradient flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    F
                                </span>
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
                                <span>{locale === 'en' ? 'VI' : 'EN'}</span>
                            </Button>

                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-8 w-8 rounded-full"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                        forceMount
                                    >
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                <p className="font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">
                                                <User className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    size="sm"
                                    className="primary-gradient text-white"
                                    onClick={() => setIsLoginModalOpen(true)}
                                >
                                    {t('nav.getStarted')}
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
                                        <span>
                                            {locale === 'en' ? 'VI' : 'EN'}
                                        </span>
                                    </Button>

                                    {user ? (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm">
                                                {user.name}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="primary-gradient text-white"
                                            onClick={() =>
                                                setIsLoginModalOpen(true)
                                            }
                                        >
                                            {t('nav.getStarted')}
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
    )
}
