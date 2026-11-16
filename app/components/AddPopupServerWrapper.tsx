import { Suspense } from 'react';
import AddPopup from './AddPopup';

type SearchParamsPromise = Promise<{ [key: string]: string | string[] | undefined }>;

// Tiny Server Component wrapper that lives inside <Suspense>
export default async function AddPopupServerWrapper({
    searchParams,
    branches,
}: {
    searchParams: SearchParamsPromise;
    branches: any[]; // use your actual Branch[] type
}) {
    const resolvedSearchParams = await searchParams;
    const isModalOpen = resolvedSearchParams.modal === 'open';

    if (!isModalOpen) return null;

    // Renders your existing Client Component!
    return <AddPopup branches={branches} />;
}