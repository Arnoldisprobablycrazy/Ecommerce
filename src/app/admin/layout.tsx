// src/app/admin/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AdminSideBar from "@/components/AdminSideBar";
import AdminNavbar from "@/components/AdminNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { createClient } from "../../../utils/supabase/server";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin section of the e-commerce app",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  
  // Get the user session
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/accounts/login');
  }
  
  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  // If there's an error or user is not admin, redirect
  if (profileError || !profile || profile.role !== 'admin') {
    redirect('/');
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
 
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen">
        <AdminSideBar />
        <main className="w-full">
          <AdminNavbar />
          <div className="px-4">
            {children}
          </div>                
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}