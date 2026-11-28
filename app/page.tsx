"use server";
import Link from "next/link";
import {
    LayoutDashboard,
    Building2,
    Phone,
    Settings,
    Plus,
    Search,
    Pencil,
    Trash2,
    UserRound,
    X,
    Eye,
    Menu,
    Mail,
    Briefcase,
    MapPin,
    Users,
} from "lucide-react";

import {Suspense} from "react";
import SummaryCard from "./components/sumaryCard";
import DataTable from "./components/DataTable";
import AddPopupServerWrapper from "./components/AddPopupServerWrapper";
import {getPhoneNumbers} from "./components/DataHandling";
import sql from "@/lib/db";

const branches = ["Head Office", "Kochi Branch", "Kozhikode Branch", "Thiruvananthapuram Branch", "Bengaluru Branch"];

type PageProps = {
    searchParams: Promise<{[key: string]: string | string[] | undefined}>;
};
async function AlertRecipientsList() {
    const result = await sql`SELECT * FROM alert_recipients`;
    const rows = [...result];
    return <DataTable tableData={rows} tableType="phoneno" />;
}
export default async function Home({searchParams}: PageProps) {
    return (
        <>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Home</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage phone numbers, owners and branch assignments</p>
                </div>

                <Link
                    href="?modal=open"
                    className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
                >
                    <Plus size={18} />
                    Add Phone
                </Link>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <SummaryCard title="Total Numbers" value={1} icon={<Phone size={22} />} />

                <SummaryCard title="Assigned Owners" value={1} icon={<Users size={22} />} />

                <SummaryCard title="Branches" value={1} icon={<Building2 size={22} />} />
            </div>

            {/* SEARCH AND FILTER */}
            <div className="bg-white p-4 rounded-xl border mb-4 flex flex-wrap gap-3 justify-between">
                <div className="relative flex-1 min-w-[220px]">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />

                    <input
                        // value={search}
                        // onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search phone, owner or branch..."
                        className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <select
                    // value={filter}
                    // onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm bg-white"
                >
                    <option value="All">All Branches</option>

                    {branches.map((branch) => (
                        <option key={branch} value={branch}>
                            {branch}
                        </option>
                    ))}
                </select>
            </div>

            {/* PHONE DIRECTORY TABLE */}
            <div className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4 border-b flex justify-between">
                    <h2 className="font-semibold">Registered Numbers</h2>

                    <span className="text-sm text-gray-500">1 records</span>
                </div>

                <div className="overflow-x-auto">
                    <Suspense fallback={<p>Loading recipients...</p>}>
                        <AlertRecipientsList />
                    </Suspense>
                </div>
            </div>

            <Suspense fallback={null}>
                <AddPopupServerWrapper searchParams={searchParams} branches={branches} />
            </Suspense>
        </>
    );
}
