import type { Metadata } from "next";
import { hasPassword } from "@/lib/auth";
import { AdminGate } from "./gate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "لوحة الإدارة — أ.د/ حسام لطفي",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const passwordSet = await hasPassword().catch(() => false);
  return <AdminGate passwordSet={passwordSet} />;
}
