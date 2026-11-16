import sql from '@/lib/db';
import DeleteButton from './DeleteButton';
export default async function DataTable() {
    const rows = await sql`
    SELECT * 
    FROM alert_recipients 
  `;
    console.log(rows);
    return (
        <table className="w-full text-sm text-left">

            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                    <th className="px-5 py-4">Phone Number</th>
                    <th className="px-5 py-4">Manager</th>
                    <th className="px-5 py-4">Branch</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                </tr>
            </thead>

            <tbody className="divide-y">

                {rows.map((record) => (
                    <tr
                        key={record.id}
                        className="hover:bg-gray-50"
                    >
                        <td className="px-5 py-4 font-medium whitespace-nowrap">
                            {record.phone_number}
                        </td>

                        <td className="px-5 py-4">
                            <div className="font-medium">
                                {record.recipient_name || "Not assigned"}
                            </div>
                        </td>

                        <td className="px-5 py-4">
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                                {/* {record.branch_code} */}
                            </span>
                        </td>

                        <td className="px-5 py-4">
                            <div className="flex justify-center gap-2">
                                <DeleteButton id={record.id}/>
                            </div>
                        </td>
                    </tr>
                ))}

                {rows.length === 0 && (
                    <tr>
                        <td
                            colSpan={5}
                            className="text-center py-12 text-gray-400"
                        >
                            No phone numbers found.
                        </td>
                    </tr>
                )}

            </tbody>
        </table>
    )
}