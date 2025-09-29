"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, User, HelpCircle, Languages } from "lucide-react"
import { useEffect } from "react"

export function Header() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Avoid re-injecting
    const existing = document.getElementById("google-translate-script")
    if (existing) return
    ;(window as any).googleTranslateElementInit = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = (window as any).google
      if (!g?.translate) return
      new g.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "ml", // Malayalam only per request
          autoDisplay: false,
        },
        "google_translate_element",
      )
    }

    const s = document.createElement("script")
    s.id = "google-translate-script"
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    s.async = true
    document.body.appendChild(s)
  }, [])

  function translateToMalayalam() {
    if (typeof document === "undefined") return
    const value = "/en/ml"
    // Set cookie for current host and root path
    document.cookie = `googtrans=${value}; path=/`
    // Also set with domain to cover subpaths
    document.cookie = `googtrans=${value}; domain=${window.location.hostname}; path=/`
    // Reload to apply translation across the app
    window.location.reload()
  }

  return (
    <header className="gradient-secondary border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Add DocIntel logo */}
          <img
            src="/images/docintel-logo.png"
            alt="DocIntel - Intelligent Information Management"
            width={36}
            height={36}
            className="rounded-md"
          />
          <div>
            {/* Brand name to DocIntel, keep context in subtitle */}
            <h1 className="text-2xl font-bold text-balance">DocIntel</h1>
            <p className="text-sm text-muted-foreground">KMRL Document Intelligence Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search documents..." className="pl-10 w-64 bg-background/50" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive">3</Badge>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={translateToMalayalam}
            aria-label="Translate to Malayalam"
            className="gap-2"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">മലയാളം</span>
          </Button>

          {/* User */}
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden md:inline">Admin</span>
          </Button>
        </div>
      </div>

      <div id="google_translate_element" className="sr-only" aria-hidden="true" />
    </header>
  )
}
