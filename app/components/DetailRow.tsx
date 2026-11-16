export default function DetailRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-3 items-start">
            <div className="text-blue-700 mt-1">{icon}</div>

            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}