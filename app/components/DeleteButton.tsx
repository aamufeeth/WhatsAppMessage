'use client';
import { DeleteItem } from './DataHandling';
import {Trash2} from "lucide-react";
export default function DeleteButton({ id }: { id: number }) {
    return (
        <button onClick={async () => {
            await DeleteItem(id);
        }}
            title="Delete"
            className="p-2 rounded-lg text-red-500 hover:bg-red-50"
        >
            <Trash2 size={17} />
        </button>
    );
}