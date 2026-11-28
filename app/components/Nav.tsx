import Link from "next/link";
interface NavItem {
    name: string;
    icon: React.ComponentType<{ size?: number }>;

}
export default function Nav({NavItems}: {NavItems: NavItem[]}) {
    const size = 19;
    return (
        <aside className="w-60 min-h-[calc(100vh-64px)] bg-white border-r p-4 shrink-0">
            <p className="text-xs font-semibold text-gray-400 mb-4">MAIN MENU</p>
            <nav className="space-y-2">
                {NavItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link href={item.name === "Home" ? '/' : (item.name).toLocaleLowerCase()}
                            key={item.name}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition`}
                        >
                            <Icon size={size} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
