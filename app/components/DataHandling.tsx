"use server";

import sql from "@/lib/db";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

type ActionState = {
    error?: string;
    message?: string;
    success?: boolean;
} | null;

function formatWhatsAppNumber(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
        return `91${digits}`;
    }
    if (digits.length === 11 && digits.startsWith("0")) {
        return `91${digits.slice(1)}`;
    }
    return digits;
};

export async function getPhoneNumbers() {
    return await sql`SELECT * FROM alert_recipients`
}

export async function SaveData(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const manager = (formData.get("manager") as string)?.trim();
    const phone = formatWhatsAppNumber((formData.get("phone") as string)?.trim());
    const email = (formData.get("email") as string)?.trim();
    const branch = (formData.get("branch") as string)?.trim();

    if (!manager || !phone || !email || !branch) {
        console.log({success: false, message: "All fields are required."});
    }

    const url = new URL(process.env.DATABASE_URL!);

    try {
        await sql`
      INSERT INTO alert_recipients (client_id, recipient_name, phone_number, is_enabled, branch_id)
      VALUES (1, ${manager}, ${phone}, true, ${branch})
    `;

        return {success: true, message: "Manager saved successfully."};
        // console.log({ success: true, message: 'Manager saved successfully.' });
    } catch (error: any) {
        // console.error('Database Insert Error:', error);
        return {success: false, message: "Failed to save manager. Check that the branch code exists."};
        //console.log({ success: false, message: 'Failed to save manager. Check that the branch code exists.' });
    }
    revalidatePath("/");
    redirect("/");
}

export async function DeleteItem(id: number): Promise<void> {
    if (!id) return;

    try {
        await sql`DELETE FROM alert_recipients WHERE id = ${id}`;
    } catch (error) {
        console.error("Failed to delete item:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown database error");
    }

    revalidatePath("/");
    redirect("/");
}
