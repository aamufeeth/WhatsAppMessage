export default function ActionButton({
    children,
    title,
    danger = false,
}: {
    children: React.ReactNode;
    title: string;
    danger?: boolean;
}) {
    return (
        <button
            title={title}
            className={`p-2 rounded-lg ${danger
                    ? "text-red-500 hover:bg-red-50"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
        >
            {children}
        </button>
    );
}
