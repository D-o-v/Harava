"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function NoAccessPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-[#f6f7fa] p-6">
      <section className="max-w-md rounded-2xl border border-navy/8 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-500"><ShieldX className="h-6 w-6" /></div>
        <h1 className="text-xl font-bold text-navy">You don’t have access to this page</h1>
        <p className="mt-2 text-sm text-navy/50">Contact your workspace administrator if you think this is a mistake.</p>
        <Link href="/finsight" className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-navy px-5 text-sm font-medium text-white hover:bg-navy-light">Return to your workspace</Link>
      </section>
    </main>
  );
}
