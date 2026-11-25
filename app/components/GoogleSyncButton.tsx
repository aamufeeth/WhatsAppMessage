"use client";

import React from "react";
import {useRouter} from "next/navigation";

export default function GoogleSyncButton() {
    const router = useRouter();
    const handleGoogleSync = () => {
        console.log("Google Sync initiated")
        router.push("https://whats-app-message-theta.vercel.app/api/auth/google");
    };

    return (
        <button
            onClick={handleGoogleSync}
            className="flex items-center justify-center gap-3
      rounded-lg border border-gray-300 bg-white
      px-5 py-3 text-sm font-semibold text-gray-700
      shadow-sm transition-all duration-200
      hover:bg-gray-50 hover:shadow-md
      active:scale-95"
        >
            {/* Google Icon */}
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill="#4285F4"
                    d="M43.6 24.5c0-1.6-.1-3.2-.4-4.7H24v9h11a9.5 9.5 0 0 1-4.1 6.2v5.2h6.7c3.9-3.6 6-8.9 6-15.7z"
                />
                <path
                    fill="#34A853"
                    d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.2c-1.8 1.2-4.1 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2H5.9v5.4A20 20 0 0 0 24 44z"
                />
                <path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.4H5.9a20 20 0 0 0 0 18.4z" />
                <path
                    fill="#EA4335"
                    d="M24 12.2c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 6 29.5 4 24 4A20 20 0 0 0 5.9 14.8l6.9 5.4c1.6-4.7 6-8 11.2-8z"
                />
            </svg>

            <span>Sync With Google</span>
        </button>
    );
}
