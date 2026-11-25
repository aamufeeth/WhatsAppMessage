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
import AddPopup from "./components/AddPopup";
import GoogleSyncButton from "./components/GoogleSyncButton";
import AddPopupServerWrapper from "./components/AddPopupServerWrapper";

const branches = ["Head Office", "Kochi Branch", "Kozhikode Branch", "Thiruvananthapuram Branch", "Bengaluru Branch"];

type PageProps = {
    searchParams: Promise<{[key: string]: string | string[] | undefined}>;
};

export default async function Home({searchParams}: PageProps) {
    const menuItems = [
        {name: "Dashboard", icon: LayoutDashboard},
        {name: "Branches", icon: Building2},
        {name: "Phone Directory", icon: Phone},
        {name: "Settings", icon: Settings},
    ];

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            {/* HEADER */}
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

            <div className="flex">
                <aside className="w-60 min-h-[calc(100vh-64px)] bg-white border-r p-4 shrink-0">
                    <p className="text-xs font-semibold text-gray-400 mb-4">MAIN MENU</p>
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.name}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition`}
                                >
                                    <Icon size={19} />
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>
                </aside>
                <main className="flex-1 min-w-0 p-6">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Phone Directory</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage phone numbers, owners and branch assignments
                            </p>
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
                            <Suspense>
                                <DataTable />
                            </Suspense>
                        </div>
                    </div>
                </main>
            </div>

            <Suspense fallback={null}>
                <AddPopupServerWrapper searchParams={searchParams} branches={branches} />
            </Suspense>

            {/* {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">

            <div className="p-5 border-b flex justify-between">
              <h2 className="font-bold text-lg">
                Owner Details
              </h2>

              <Link href="?" scroll={false}>
                <X size={20} />
              </Link>
            </div>

            <div className="p-6">

              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UserRound size={30} />
                </div>
              </div>

              <div className="space-y-4">

                <DetailRow
                  icon={<Phone size={18} />}
                  label="Phone Number"
                  value=""
                />

                <DetailRow
                  icon={<Mail size={18} />}
                  label="Email"
                  value=""
                />

                <DetailRow
                  icon={<Briefcase size={18} />}
                  label="Designation"
                  value=""
                />

                <DetailRow
                  icon={<MapPin size={18} />}
                  label="Branch Office"
                  value=""
                />

              </div>

              <button
                className="w-full mt-6 bg-blue-700 text-white rounded-lg py-2.5 text-sm"
              >
                Edit Owner Details
              </button>

            </div>
          </div>
        </div>
      )} */}
        </div>
    );
}
