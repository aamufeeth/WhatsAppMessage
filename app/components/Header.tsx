"use client";
import Link from "next/link";
import {
    Building2,
    UserRound,
    Menu,
} from "lucide-react";
import GoogleSyncButton from "./GoogleSyncButton";
export default function Header() {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Menu size={21} />
                </button>

                <div className="flex items-center gap-2">
                    <Building2 size={25} className="text-blue-700" />
                    <span className="font-bold text-lg">DELICIA ADMIN</span>
                </div>
            </div>
            <div className="p-6">
                <GoogleSyncButton />
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Administrator</span>

                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <UserRound size={19} />
                </div>
            </div>
        </header>
    );
}
