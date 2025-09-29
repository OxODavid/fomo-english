'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function Footer() {
    const { t } = useLanguage()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-muted/50 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg primary-gradient flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    F
                                </span>
                            </div>
                            <span className="text-xl font-bold text-gradient">
                                FOMO English
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('home.main.subtitle')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">{t('nav.home')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {t('nav.about')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/courses"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {t('nav.courses')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/workbook"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {t('nav.workbook')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/subscription"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {t('nav.subscription')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Follow Us</h3>
                        <div className="flex space-x-4">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary"
                            >
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary"
                            >
                                <Youtube className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary"
                            >
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} FOMO English. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
