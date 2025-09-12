import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from 'lucide-react'
import { SidebarTrigger } from './ui/sidebar'

const AdminNavbar = () => {
  return (
    <nav className="p-4 flex items-center justify-between sticky top-0">
      <SidebarTrigger/>
      {/* right  side */}
      <div className="flex items-center gap-4">
        <Link href="/admin">DashBoard</Link>
        
        <DropdownMenu>
  <DropdownMenuTrigger><Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </DropdownMenuTrigger>
  <DropdownMenuContent sideOffset={10}>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem><User/>Profile</DropdownMenuItem>
    <DropdownMenuItem><Settings/>Settings</DropdownMenuItem>
    <DropdownMenuItem variant="destructive"><LogOut/>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
      </div>
    </nav>
  )
}

export default AdminNavbar
