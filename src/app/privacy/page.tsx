import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/legal-page";
import { PRIVACY } from "@/features/legal/texts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "سياسة الخصوصية" };
export default function Page() { return <LegalPage title="سياسة الخصوصية" items={PRIVACY} />; }
