"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Shield, 
  Trophy, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  Settings,
  ChevronRight 
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Rosters", href: "/admin/rosters", icon: Shield },
  { name: "Tournaments", href: "/admin/tournaments", icon: Trophy },
  { name: "Teams", href: "/admin/teams", icon: Users },
  { name: "Support Tickets", href: "/admin/tickets", icon: MessageSquare },
  { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40" />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-white font-bold text-xl">RETALIATION</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? "bg-brand-primary text-white" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bio Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-400 italic">
              "We're finally retaliating."
            </p>
            <p className="text-xs text-brand-primary font-bold mt-1">
              RETALIATION ESPORTS
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
