"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/endpoints";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { tokens } from "@/lib/api/tokens";

function AcceptInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { finalizeFromLoginResponse } = useAuth();
  const token = params.get("token") || "";

  const [preview, setPreview] = useState<Awaited<ReturnType<typeof authApi.previewInvitation>> | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoadError("This invitation link is missing a token.");
      setLoadingPreview(false);
      return;
    }
    (async () => {
      try {
        const p = await authApi.previewInvitation(token);
        setPreview(p);
        setFirstName(p.firstName ?? "");
        setLastName(p.lastName ?? "");
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Invitation link is invalid or expired.");
      } finally {
        setLoadingPreview(false);
      }
    })();
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setSubmitting(true);
    setError("");
    try {
      const res = await authApi.acceptInvitation({ token, password, firstName, lastName, phoneNumber: phoneNumber || undefined });
      toast("Invitation accepted!", "success");
      if (res.accessToken) {
        const scope = res.scope === "CLIENT" ? "portal" : "staff";
        await finalizeFromLoginResponse(res, scope);
        router.replace(scope === "portal" ? "/finsight" : "/finsight");
      } else {
        // Backend may require separate login after accept
        tokens.clearAll();
        router.replace("/auth/login");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not accept invitation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fa] dark:bg-[#080d1a] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-navy/5">
        <Link href="/" className="flex items-center gap-2.5 mb-6">
          <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-xl object-cover" />
          <span className="text-xl font-bold text-navy tracking-tight">Harava<span className="text-gold">.</span></span>
        </Link>

        {loadingPreview ? (
          <div className="flex items-center gap-2 text-navy/60 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Verifying invitation…</div>
        ) : loadError ? (
          <>
            <h1 className="text-xl font-bold text-navy mb-2">Invitation unavailable</h1>
            <p className="text-sm text-navy/60 mb-6">{loadError}</p>
            <Link href="/auth/login" className="text-sm text-gold-dark font-semibold">Back to sign in →</Link>
          </>
        ) : preview ? (
          <>
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-4 h-4" /> Invitation verified
            </div>
            <h1 className="text-2xl font-bold text-navy mb-1">Welcome to {preview.organizationName || "Harava"}</h1>
            <p className="text-sm text-navy/60 mb-6">
              You&apos;ve been invited as <b>{preview.role || preview.invitationType || "member"}</b>
              {preview.companyName ? ` for ${preview.companyName}` : ""}. Set a password to activate <b>{preview.email}</b>.
            </p>

            {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-navy/60">First name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-navy/60">Last name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-navy/60">Phone (optional)</label>
                <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+234…" className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-navy/60">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-navy/60">Confirm password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Activating…</> : <>Activate account <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-navy/60"><Loader2 className="w-4 h-4 animate-spin" /></div>}>
      <AcceptInner />
    </Suspense>
  );
}
