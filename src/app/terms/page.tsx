import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/legal-page";
import { TERMS } from "@/features/legal/texts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الشروط والأحكام" };
export default function Page() { return <LegalPage title="الشروط والأحكام" items={TERMS} />; }
