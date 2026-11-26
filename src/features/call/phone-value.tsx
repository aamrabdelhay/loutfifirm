import { AlertTriangle } from "lucide-react";
import { isValidEgyptMobile } from "./phone-check";

/**
 * Shows a phone number. A mobile number that is not a valid 11-digit Egyptian mobile gets a red
 * frame and a "needs correction" note, and is not a tel: link. The frame disappears on its own
 * as soon as the number is corrected in the admin (no flag to clear).
 */
export function PhoneValue({ value, mobile, className = "" }: { value: string; mobile: boolean; className?: string }) {
  if (!mobile || isValidEgyptMobile(value)) return <span className={className} dir="ltr">{value}</span>;
  return (
    <span role="alert" data-phone-invalid className="inline-flex flex-col gap-1 rounded-md border-2 border-red-500 bg-red-500/10 px-2 py-1">
      <span className={className} dir="ltr">{value}</span>
      <span className="flex items-center gap-1 text-xs font-bold text-red-400"><AlertTriangle size={12} />هذا الرقم يحتاج تعديل (لا بد أن يكون 11 رقمًا)</span>
    </span>
  );
}
