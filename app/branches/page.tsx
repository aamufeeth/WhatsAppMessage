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
import DataTable from "../components/DataTable";
export default async function Branches() {
    return (
        <>
            <h2 className="text-2xl font-bold pb-5">Branches</h2>
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
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4 border-b flex justify-between">
                    <h2 className="font-semibold">Registered Numbers</h2>

                    <span className="text-sm text-gray-500">1 records</span>
                </div>

                <div className="overflow-x-auto">
                    <Suspense>
                        <DataTable tableType={'phoneNo'} />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
