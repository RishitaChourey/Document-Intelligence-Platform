"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  Workflow,
  BarChart3,
  Shield,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Upload Hub", icon: Upload, href: "/upload" },
  { name: "Documents", icon: FileText, href: "/documents" },
  { name: "Categorization", icon: FolderOpen, href: "/categorization" },
  { name: "Workflows", icon: Workflow, href: "/workflows" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Governance", icon: Shield, href: "/governance" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg text-balance">KMRL DocIntel</h1>
            <p className="text-xs text-muted-foreground">Document Intelligence</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "gradient-primary text-white shadow-lg",
                  collapsed && "px-3",
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active Docs</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Today's Uploads</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pending Reviews</span>
              <span className="font-medium text-warning">3</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-6 w-6 h-6 rounded-full border border-border bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>
    </div>
  )
}
