import { LogOut, Settings, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { useClerkAuthService } from '@/services/auth'

export function UserNav() {
  const authService = useClerkAuthService()
  const { isLoaded, isSignedIn, user } = authService.getAuthState()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      void navigate('/login')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const handleProfileClick = () => {
    void navigate('/settings/profile')
  }

  const handleSettingsClick = () => {
    void navigate('/settings')
  }

  // Don't render if not loaded or not signed in
  if (!isLoaded || !isSignedIn || !user) {
    return null
  }

  // Generate user initials for fallback avatar
  const firstName = user.firstName?.[0]
  const lastName = user.lastName?.[0]
  const emailFirst = user.email[0]

  const nameInitials = [firstName, lastName]
    .filter(Boolean)
    .join('')
    .toUpperCase()
  const userInitials = (nameInitials || emailFirst?.toUpperCase()) ?? 'U'

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.imageUrl}
              alt={displayName || 'User avatar'}
            />
            <AvatarFallback className="text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
