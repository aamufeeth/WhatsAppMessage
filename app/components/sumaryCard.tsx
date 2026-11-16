export default function SummaryCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="bg-white border rounded-xl p-5 flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-2xl font-bold mt-2">{value}</h2>
            </div>

            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg">
                {icon}
            </div>
        </div>
    );
}