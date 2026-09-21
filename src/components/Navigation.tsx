import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import logoBlackHorizontal from '@/assets/marketing/logo-black-horizontal.svg'
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
  { label: 'Join Community', href: '/join' },
] as const

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'community_manager':
      return '/dashboard/community-manager'
    case 'mentor':
      return '/dashboard/mentor'
    case 'mentee':
    default:
      return '/dashboard/mentee'
  }
}

export default function Navigation({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user: rawUser, logout } = useAuth()
  const user = rawUser as User | null
  const [mobileOpen, setMobileOpen] = useState(false)
  const isLight = variant === 'light'

  function isActive(href: string): boolean {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  function handleLogout() {
    logout()
  }

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl',
        isLight ? 'border-[rgba(20,17,24,0.07)] bg-white/90' : 'border-white/[0.08] bg-black/90',
      )}
    >
      {/* Shimmer line at top */}
      <div className="shimmer-line absolute top-0 left-0 right-0" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Brand ── */}
        <Link to="/" className="shrink-0 group">
          <img
            src={isLight ? logoBlackHorizontal : '/logo-white-horizontal.svg'}
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
                  ? isLight
                    ? 'text-[#141118] after:bg-tekton-purple-bright after:opacity-100'
                    : 'text-white after:bg-tekton-purple-bright after:opacity-100'
                  : isLight
                    ? 'text-[#5C5661] hover:text-[#141118] after:bg-[rgba(20,17,24,0.3)] after:opacity-0 hover:after:opacity-100'
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
                <DropdownMenuContent
                  align="end"
                  className={cn(
                    'w-48 backdrop-blur-xl',
                    isLight ? 'bg-white/95 border-[rgba(20,17,24,0.08)] text-[#141118]' : 'bg-black/95 border-white/10 text-white',
                  )}
                >
                  <DropdownMenuItem
                    className={cn(
                      'cursor-pointer',
                      isLight ? 'focus:bg-[rgba(20,17,24,0.05)] focus:text-[#141118]' : 'focus:bg-white/10 focus:text-white',
                    )}
                    onClick={() => navigate(getDashboardPath(user.role))}
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      'cursor-pointer',
                      isLight ? 'focus:bg-[rgba(20,17,24,0.05)] focus:text-[#141118]' : 'focus:bg-white/10 focus:text-white',
                    )}
                    onClick={() => navigate('/profile')}
                  >
                    <UserIcon className="size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={isLight ? 'bg-[rgba(20,17,24,0.08)]' : 'bg-white/10'} />
                  <DropdownMenuItem
                    className={cn(
                      'cursor-pointer',
                      isLight
                        ? 'focus:bg-[rgba(220,38,38,0.08)] focus:text-red-600 text-red-500'
                        : 'focus:bg-white/10 focus:text-white text-red-400',
                    )}
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
                className={cn(
                  'text-sm font-medium',
                  isLight ? 'text-[#5C5661] hover:text-[#141118] hover:bg-[rgba(20,17,24,0.05)]' : 'text-white/60 hover:text-white hover:bg-white/8',
                )}
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
              <Button
                variant="ghost"
                size="icon"
                className={isLight ? 'text-[#5C5661] hover:text-[#141118] hover:bg-[rgba(20,17,24,0.05)]' : 'text-white/60 hover:text-white hover:bg-white/10'}
              >
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={cn(
                'w-[85vw] max-w-xs p-0 backdrop-blur-xl',
                isLight ? 'bg-white/98 border-l border-[rgba(20,17,24,0.08)]' : 'bg-black/98 border-l border-white/[0.08]',
              )}
            >
              <div className="flex flex-col h-full">
                {/* Sheet brand */}
                <div className={cn('flex items-center px-6 py-5 border-b', isLight ? 'border-[rgba(20,17,24,0.08)]' : 'border-white/[0.08]')}>
                  <img
                    src={isLight ? logoBlackHorizontal : '/logo-white-horizontal.svg'}
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
                            ? isLight
                              ? 'bg-tekton-purple-bright/10 text-[#141118] border border-tekton-purple-bright/30'
                              : 'bg-tekton-purple-bright/15 text-white border border-tekton-purple-bright/30'
                            : isLight
                              ? 'text-[#5C5661] hover:text-[#141118] hover:bg-[rgba(20,17,24,0.05)]'
                              : 'text-white/50 hover:text-white hover:bg-white/5',
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* Mobile auth */}
                <div className={cn('flex flex-col gap-2 px-4 py-5 border-t', isLight ? 'border-[rgba(20,17,24,0.08)]' : 'border-white/[0.08]')}>
                  {isAuthenticated && user ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          to={getDashboardPath(user.role)}
                          className={cn(
                            'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                            isLight ? 'text-[#5C5661] hover:text-[#141118] hover:bg-[rgba(20,17,24,0.05)]' : 'text-white/60 hover:text-white hover:bg-white/5',
                          )}
                        >
                          <LayoutDashboard className="size-4" />
                          Dashboard
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/profile"
                          className={cn(
                            'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                            isLight ? 'text-[#5C5661] hover:text-[#141118] hover:bg-[rgba(20,17,24,0.05)]' : 'text-white/60 hover:text-white hover:bg-white/5',
                          )}
                        >
                          <UserIcon className="size-4" />
                          Profile
                        </Link>
                      </SheetClose>
                      <button
                        onClick={() => { handleLogout(); setMobileOpen(false) }}
                        className={cn(
                          'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-red-500/10',
                          isLight ? 'text-red-500' : 'text-red-400',
                        )}
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          asChild
                          className={cn(
                            'w-full justify-center border',
                            isLight
                              ? 'text-[#5C5661] hover:text-[#141118] hover:bg-[rgba(20,17,24,0.05)] border-[rgba(20,17,24,0.12)]'
                              : 'text-white/60 hover:text-white hover:bg-white/10 border-white/10',
                          )}
                        >
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
