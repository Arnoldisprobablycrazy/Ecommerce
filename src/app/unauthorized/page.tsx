// app/unauthorized/page.tsx
"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Access Denied
        </h1>
        <p className="mt-2 text-gray-600">
          You don’t have permission to view this page.  
          Please contact an administrator if you think this is a mistake.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Login with another account
          </Link>
        </div>
      </div>
    </div>
  );
}
