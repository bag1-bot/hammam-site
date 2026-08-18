import Link from "next/link";
import { redirect } from "next/navigation";
import { HammamForm } from "@/components/admin/HammamForm";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function NewHammamPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/hammams" className="text-sm text-[var(--gold-deep)]">
          ← Back
        </Link>
        <h1 className="display mt-2 text-4xl">New hammam</h1>
      </div>
      <HammamForm />
    </div>
  );
}
