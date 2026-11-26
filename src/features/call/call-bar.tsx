import { getContent } from "@/lib/content";
import { CallButton } from "./call-button";
import { dialableFromContact } from "./phone-check";

/** Server wrapper: dials only a valid number. While the office mobile is invalid, the button is not shown. */
export async function CallBar() {
  try {
    const { contact } = await getContent();
    const number = dialableFromContact(contact as { mobile?: string; callNumber?: string; phones?: { label: string; value: string }[] });
    if (!number) return null;
    return <CallButton number={number} label="اتصل بالمكتب" />;
  } catch {
    return null;
  }
}
