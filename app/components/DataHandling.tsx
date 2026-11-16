'use server';

import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type ActionState = {
    error?: string;
    message?: string;
    success?: boolean;
} | null;

export async function SaveData(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const manager = (formData.get('manager') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const branch = (formData.get('branch') as string)?.trim();

    if (!manager || !phone || !email || !branch) {
        console.log({ success: false, message: 'All fields are required.' });
    }

    const url = new URL(process.env.DATABASE_URL!);

    try {
        await sql`
      INSERT INTO alert_recipients (recipient_name, phone_number, is_enabled, branch_id)
      VALUES (${manager}, ${phone}, true, ${branch})
    `;

        return { success: true, message: 'Manager saved successfully.' };
        // console.log({ success: true, message: 'Manager saved successfully.' });
    } catch (error: any) {
        // console.error('Database Insert Error:', error);
        return { success: false, message: 'Failed to save manager. Check that the branch code exists.' };
        // console.log({ success: false, message: 'Failed to save manager. Check that the branch code exists.' });
    }
    revalidatePath('/');
    redirect('/');
}

export async function DeleteItem(id: number): Promise<void> {

    console.log(id);
    if (!id) return;

    try {
        await sql`DELETE FROM alert_recipients WHERE id = ${id}`;
    } catch (error) {
        console.error('Failed to delete item:', error);
        throw new Error(error instanceof Error ? error.message : 'Unknown database error');
    }

    revalidatePath('/');
    redirect('/');
}