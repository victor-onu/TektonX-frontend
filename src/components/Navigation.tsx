import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import NotificationBell from '@/components/NotificationBell'
import type { User, UserRole } from '@/types'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Mentorship', href: '/mentorship' },
  { label: 'Our Mentors', href: '/mentors' },
  { label: 'Partners', href: '/partnerships' },
] as const

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'mentor':
      return '/dashboard/mentor'
    case 'mentee':
    default:
      return '/dashboard/mentee'
  }
}

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user: rawUser, logout } = useAuth()
  const user = rawUser as User | null
  const [mobileOpen, setMobileOpen] = useState(false)
  

  function isActive(href: string): boolean {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  function handleLogout() {
    logout()
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.08] bg-black/90 backdrop-blur-xl">
      {/* Shimmer line at top */}
      <div className="shimmer-line absolute top-0 left-0 right-0" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Brand ── */}
        <Link to="/" className="shrink-0 group">
          <img
            src="/logo-white-horizontal.svg"
            alt="TektonX"
            className="h-16 w-auto group-hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'relative px-3 py-2 text-sm font-medium transition-colors rounded-md',
                'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:rounded-full',
                'after:transition-all after:duration-200',
                isActive(link.href)
                  ? 'text-white after:bg-tekton-purple-bright after:opacity-100'
                  : 'text-white/50 hover:text-white after:bg-white/40 after:opacity-0 hover:after:opacity-100',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop right ── */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-purple-deep text-white text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-tekton-purple-bright glow-purple"
                    aria-label="User menu"
                  >
                    {getInitials(user.name)}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black/95 border-white/10 text-white backdrop-blur-xl">
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                    onClick={() => navigate(getDashboardPath(user.role))}
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                    onClick={() => navigate('/profile')}
                  >
                    <UserIcon className="size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-white/10 focus:text-white text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-white/60 hover:text-white hover:bg-white/8 text-sm font-medium"
              >
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90 glow-purple text-sm font-medium px-4"
              >
                <Link to="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <div className="flex md:hidden items-center gap-1">
          {isAuthenticated && user && (
            <NotificationBell />
          )}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-black/98 border-l border-white/[0.08] p-0 backdrop-blur-xl">
              <div className="flex flex-col h-full">
                {/* Sheet brand */}
                <div className="flex items-center px-6 py-5 border-b border-white/[0.08]">
                  <img
                    src="/logo-white-horizontal.svg"
                    alt="TektonX"
                    className="h-10 w-auto"
                  />
                </div>

                {/* Mobile nav links */}
                <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className={cn(
                          'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                          isActive(link.href)
                            ? 'bg-tekton-purple-bright/15 text-white border border-tekton-purple-bright/30'
                            : 'text-white/50 hover:text-white hover:bg-white/5',
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* Mobile auth */}
                <div className="flex flex-col gap-2 px-4 py-5 border-t border-white/[0.08]">
                  {isAuthenticated && user ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          to={getDashboardPath(user.role)}
                          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard className="size-4" />
                          Dashboard
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <UserIcon className="size-4" />
                          Profile
                        </Link>
                      </SheetClose>
                      <button
                        onClick={() => { handleLogout(); setMobileOpen(false) }}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button variant="ghost" asChild className="w-full justify-center text-white/60 hover:text-white hover:bg-white/10 border border-white/10">
                          <Link to="/auth/login">Sign In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="w-full bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90 glow-purple">
                          <Link to="/auth/register">Get Started</Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
