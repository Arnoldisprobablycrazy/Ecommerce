// src/components/NavIcons.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clipboard, LogOut, User, Mail, Shield } from "lucide-react";
import { createClient } from "@utils/supabase/client";
import { User as UserType } from "@supabase/supabase-js";
import { useCartStore } from "@/store/cartStore";
import Cart from "@/components/Cart";

interface Profile {
  id: string;
  username: string;
  role: string;
}

const NavIcons = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();
  
  // Use cart store
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        setProfile(profile);
      }
    };

    getData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          setProfile(profile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-4 xl:gap-6 relative">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                {user?.email?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            {user && (
              <span className="hidden md:inline text-sm text-gray-600">
                {user.email?.split("@")[0]}
              </span>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={10} className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>My Account</span>
              {user && (
                <div className="flex flex-col mt-1">
                  <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </span>
                  {profile?.role && (
                    <span className="text-xs mt-1 font-normal flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Role: {profile.role}
                    </span>
                  )}
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {user ? (
              <>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> 
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" 
                onClick={() => router.push("/orders")}
                >
                  <Clipboard className="mr-2 h-4 w-4" /> 
                  <span>Orders</span>
                </DropdownMenuItem>
                {profile?.role === "admin" && (
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => router.push("/admin")}
                  >
                    <Shield className="mr-2 h-4 w-4" /> 
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" /> 
                  <span>Logout</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem 
                onClick={() => router.push("/accounts/login")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" /> 
                <span>Login</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Image
          src="/notification.png"
          alt="notifications"
          width={22}
          height={22}
          className="cursor-pointer"
        />

        {/* Cart */}
        <div
          className="relative cursor-pointer"
          onClick={toggleCart}
        >
          <Image src="/cart.png" alt="cart" width={22} height={22} />
          
          {/* Floating cart count badge - Render only on client */}
          {isClient && totalItems > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {totalItems > 9 ? '9+' : totalItems}
            </div>
          )}
        </div>
      </div>

      {/* Cart Component */}
      <Cart />
    </>
  );
};

export default NavIcons;