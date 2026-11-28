import sql from "@/lib/db";
import DeleteButton from "./DeleteButton";
import {getPhoneNumbers} from "./DataHandling";
import {Key} from "lucide-react";
interface DataTableProps {
    tableData?: Record<string, any>[];
    tableType?: string;
}
export default async function DataTable({tableData = [], tableType}: DataTableProps) {
    const excludedPhoneKeys = ["id", "client_id", "is_enabled", "created_at"];
    const visiblePhoneKeys =
        tableData.length > 0 ? Object.keys(tableData[0]).filter((key) => !excludedPhoneKeys.includes(key)) : [];
    return (
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                    {tableType == "phoneno" &&
                        visiblePhoneKeys.map((key) => (
                            <th className="px-5 py-4" key={key}>
                                {key}
                            </th>
                        ))}
                    <th className="px-5 py-4 text-center">Actions</th>
                </tr>
            </thead>

            <tbody className="divide-y">
                {tableData?.map((record: any) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">{record.branch_id}</span>
                        </td>

                        <td className="px-5 py-4">
                            <div className="font-medium">{record.recipient_name || "Not assigned"}</div>
                        </td>

                        <td className="px-5 py-4 font-medium whitespace-nowrap">{record.phone_number}</td>

                        <td className="px-5 py-4">
                            <div className="flex justify-center gap-2">
                                <DeleteButton id={record.id} />
                            </div>
                        </td>
                    </tr>
                ))}

                {tableData?.length === 0 && (
                    <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400">
                            No phone numbers found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
