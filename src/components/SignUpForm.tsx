"use client";
import React, { useState } from "react";
import AuthButton from "./AuthButton";
import { useRouter } from "next/navigation";
import { signUp } from "../../actions/auth";
import Link from "next/link";
import Image from "next/image";

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signUp(formData);

    if (result.status === "success") {
      router.push("/accounts/login");
    } else {
      setError(result.status);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <section className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/logo.svg"
                alt="Zukih Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-lg md:text-xl text-gray-900">
              Zukih
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create an Account
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Sign up to get started with Zukih
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              id="username"
              name="username"
              required
              className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-300 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              required
              className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-300 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              required
              className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-300 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mt-4">
            <AuthButton type="Sign up" loading={loading} />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm sm:text-base">
          <p>
            Already have an account?
            <Link
              className="font-semibold text-amber-600 hover:underline ml-1"
              href="/accounts/login"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default SignUpForm;
