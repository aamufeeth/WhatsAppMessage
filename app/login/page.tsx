
"use client";

import { useState } from "react";
import type React from "react";
import {
    Building2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        // TODO: Connect Supabase authentication here.
        setError("Authentication is not configured yet.");
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

            <div className="w-full max-w-md">

                {/* BRAND */}
                <div className="flex flex-col items-center mb-8">

                    <div className="w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                        <Building2 size={30} className="text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mt-4">
                        Company Admin
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Phone Management System
                    </p>

                </div>

                {/* LOGIN CARD */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                    <div className="mb-7">
                        <h2 className="text-xl font-bold text-gray-800">
                            Welcome Back
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Sign in to access your administration panel.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-3 text-gray-400"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@company.com"
                                    autoComplete="username"
                                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3 top-3 text-gray-400"
                                />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-11 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* REMEMBER + FORGOT PASSWORD */}
                        <div className="flex items-center justify-between">

                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 accent-blue-700"
                                />
                                Remember me
                            </label>

                            <a
                                href="/forgot-password"
                                className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                            >
                                Forgot password?
                            </a>

                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                                {error}
                            </div>
                        )}

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition"
                        >
                            Sign In
                            <ArrowRight size={18} />
                        </button>

                    </form>

                    {/* SECURITY */}
                    <div className="border-t mt-7 pt-5 flex items-center justify-center gap-2 text-gray-400">
                        <ShieldCheck size={16} />

                        <span className="text-xs">
                            Secure Administration Access
                        </span>
                    </div>

                </div>

                {/* FOOTER */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    {/* © {new Date().getFullYear()} Company Admin. All rights reserved. */}
                </p>

            </div>

        </main>
    );
}
