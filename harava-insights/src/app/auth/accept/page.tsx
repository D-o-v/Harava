"use client";

import { Suspense, useEffect, useRef, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  Loader2, ArrowRight, CheckCircle, Eye, EyeOff,
  ShieldCheck, ChevronDown, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobePanel } from "@/components/auth/globe-panel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { authApi } from "@/lib/api/endpoints";
import { tokens } from "@/lib/api/tokens";

// ─── Dial codes ───────────────────────────────────────────────────────────────

const DIAL_CODES = [
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "US", dial: "+1",   name: "United States" },
  { code: "GB", dial: "+44",  name: "United Kingdom" },
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "ZA", dial: "+27",  name: "South Africa" },
  { code: "ET", dial: "+251", name: "Ethiopia" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "UG", dial: "+256", name: "Uganda" },
  { code: "EG", dial: "+20",  name: "Egypt" },
  { code: "MA", dial: "+212", name: "Morocco" },
  { code: "CA", dial: "+1",   name: "Canada" },
  { code: "AU", dial: "+61",  name: "Australia" },
  { code: "IN", dial: "+91",  name: "India" },
  { code: "DE", dial: "+49",  name: "Germany" },
  { code: "FR", dial: "+33",  name: "France" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "BR", dial: "+55",  name: "Brazil" },
  { code: "JP", dial: "+81",  name: "Japan" },
];

function toFlag(iso: string) {
  return iso.toUpperCase().split("").map((c) =>
    String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)
  ).join("");
}

// ─── Dial picker ──────────────────────────────────────────────────────────────

function DialPicker({
  value,
  onChange,
}: {
  value: (typeof DIAL_CODES)[0];
  onChange: (v: (typeof DIAL_CODES)[0]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const reposition = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow < 260 && r.top > 260 ? r.top - 264 : r.bottom + 4;
    setPos({ top, left: r.left, width: Math.max(r.width, 260) });
  }, []);

  useEffect(() => {
    if (!open) return;
    reposition();
    const onDown = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (dropRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, reposition]);

  const filtered = DIAL_CODES.filter(
    (d) =>
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.dial.includes(q) ||
      d.code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => { setOpen((o) => !o); setQ(""); }}
        className="h-full flex items-center gap-1.5 px-3 border-r border-navy/10 hover:bg-navy/[0.03] transition-colors rounded-l-xl"
      >
        <span style={{ fontFamily: "'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif", fontSize: 18, lineHeight: 1 }}>
          {toFlag(value.code)}
        </span>
        <span className="text-[12px] font-medium text-navy/70 tabular-nums">{value.dial}</span>
        <ChevronDown className={`w-3 h-3 text-navy/30 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && typeof window !== "undefined" && createPortal(
        <div
          ref={dropRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-white border border-navy/10 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-2 border-b border-navy/6">
            <input
              autoFocus
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search country…"
              className="w-full text-[13px] px-3 py-1.5 rounded-lg border border-navy/10 outline-none focus:border-gold/40 bg-transparent"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.map((d) => (
              <button
                key={d.code + d.dial}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onChange(d); setOpen(false); setQ(""); }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-navy/[0.04] transition-colors ${d.code === value.code ? "bg-gold/8" : ""}`}
              >
                <span style={{ fontFamily: "'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif", fontSize: 18, lineHeight: 1, minWidth: 24 }}>
                  {toFlag(d.code)}
                </span>
                <span className="text-[13px] text-navy flex-1 truncate">{d.name}</span>
                <span className="text-[12px] text-navy/40 tabular-nums shrink-0">{d.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-[12px] text-navy/40 text-center py-3">No results</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Password rules ───────────────────────────────────────────────────────────

const RULES = [
  { label: "8+ characters",    test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number",           test: (p: string) => /\d/.test(p) },
];

const inputCls =
  "w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-2.5 text-[13px] text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none transition-all hover:border-navy/15 shadow-sm";

// ─── Inner page ───────────────────────────────────────────────────────────────

function AcceptInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { finalizeFromLoginResponse } = useAuth();
  const token = params.get("token") || "";

  type Preview = Awaited<ReturnType<typeof authApi.previewInvitation>>;
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dialEntry, setDialEntry] = useState(DIAL_CODES[0]);
  const [localPhone, setLocalPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoadError("This invitation link is missing a token.");
      setLoadingPreview(false);
      return;
    }
    authApi.previewInvitation(token)
      .then((p) => {
        setPreview(p);
        setFirstName(p.firstName ?? "");
        setLastName(p.lastName ?? "");
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Invitation link is invalid or expired."))
      .finally(() => setLoadingPreview(false));
  }, [token]);

  const pwValid = RULES.every((r) => r.test(password));
  const fullPhone = dialEntry.dial + localPhone.replace(/^0+/, "").replace(/\s+/g, "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!pwValid) return setError("Password doesn't meet all requirements.");
    if (password !== confirm) return setError("Passwords do not match.");
    setSubmitting(true);
    try {
      const res = await authApi.acceptInvitation({
        token,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: localPhone.trim() ? fullPhone : undefined,
      });
      toast("Welcome to Harava! Your account is ready.", "success");
      if (res.accessToken) {
        const scope = res.scope === "CLIENT" ? "portal" : "staff";
        await finalizeFromLoginResponse(res, scope);
        setDone(true);
        setTimeout(() => router.replace("/finsight"), 1400);
      } else {
        tokens.clearAll();
        setDone(true);
        setTimeout(() => router.replace("/auth/login"), 1400);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not accept invitation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f1a]">
      {/* Globe — left side on large screens */}
      <GlobePanel variant="register" />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f6f7fa] dark:bg-[#080d1a] relative overflow-y-auto min-h-screen">
        <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(193,155,63,0.04),transparent_60%)] pointer-events-none" />

        <div className="relative w-full max-w-[420px] py-10 animate-fade-in">

          {/* Logo — mobile only */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-xl object-cover ring-1 ring-navy/6" />
            <span className="text-xl font-bold text-navy tracking-tight">Harava<span className="text-gold">.</span></span>
          </Link>

          {/* ── Loading ── */}
          {loadingPreview && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gold/8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gold" />
              </div>
              <p className="text-[13px] text-navy/40 font-medium">Verifying your invitation…</p>
            </div>
          )}

          {/* ── Invalid ── */}
          {!loadingPreview && loadError && (
            <div className="text-center py-16 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-navy mb-2">Invitation unavailable</h2>
                <p className="text-[13px] text-navy/45 leading-relaxed max-w-xs mx-auto">{loadError}</p>
              </div>
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold-dark hover:text-gold transition-colors">
                Back to sign in <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* ── Success ── */}
          {done && (
            <div className="text-center py-16 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-navy mb-2">You're all set!</h2>
                <p className="text-[13px] text-navy/45">Redirecting you to your dashboard…</p>
              </div>
              <Loader2 className="w-5 h-5 animate-spin text-gold mx-auto" />
            </div>
          )}

          {/* ── Form ── */}
          {!loadingPreview && !loadError && !done && preview && (
            <>
              {/* Invite badge */}
              <div className="mb-7 flex items-center gap-3 p-4 rounded-2xl bg-white border border-navy/6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gold/15 to-gold/5 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-gold-dark" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-0.5">Invitation verified</p>
                  <p className="text-[13px] font-medium text-navy truncate">
                    Join <span className="text-gold-dark">{preview.organizationName || "Harava"}</span>
                    {" "}as <span className="capitalize">{(preview.role || preview.invitationType || "member").toLowerCase()}</span>
                  </p>
                  {preview.email && <p className="text-[11px] text-navy/35 mt-0.5 truncate">{preview.email}</p>}
                </div>
              </div>

              <h1 className="text-[24px] font-bold text-navy tracking-tight mb-1">Welcome to Harava</h1>
              <p className="text-[13px] text-navy/40 mb-7">Set a password to activate your account.</p>

              {/* Error */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/60 flex items-start gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-navy/55">First name</label>
                    <input
                      type="text" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane" required
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-navy/55">Last name</label>
                    <input
                      type="text" value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe" required
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-navy/55">Phone <span className="text-navy/30 font-normal">(optional)</span></label>
                  <div className="flex bg-white border-[1.5px] border-navy/8 rounded-xl overflow-visible shadow-sm transition-all hover:border-navy/15 focus-within:border-gold focus-within:ring-[3px] focus-within:ring-gold/8">
                    <DialPicker value={dialEntry} onChange={setDialEntry} />
                    <input
                      type="tel"
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value.replace(/[^\d\s\-()+]/g, ""))}
                      placeholder="8012345678"
                      className="flex-1 px-3 py-2.5 text-[13px] text-navy placeholder:text-navy/25 outline-none bg-transparent"
                    />
                  </div>
                  {localPhone && (
                    <p className="text-[10px] text-navy/35 pl-1">
                      Stored as <span className="font-mono font-medium text-navy/50">{fullPhone}</span>
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-navy/55">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      className={inputCls + " pr-11"}
                    />
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1.5">
                      {RULES.map((r) => (
                        <div key={r.label} className={`flex items-center gap-1.5 text-[11px] transition-colors ${r.test(password) ? "text-emerald-600" : "text-navy/30"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${r.test(password) ? "bg-emerald-500" : "bg-navy/15"}`} />
                          {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-navy/55">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className={`${inputCls} pr-11 ${
                        confirm && confirm !== password
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : confirm && confirm === password
                            ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-50"
                            : ""
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="flex items-center gap-1 text-[11px] text-red-500">
                      <AlertCircle className="w-3 h-3 shrink-0" /> Passwords do not match
                    </p>
                  )}
                </div>

                <Button variant="primary" size="lg" className="w-full mt-2" type="submit" disabled={submitting}>
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Activating account…</>
                    : <>Activate account <ArrowRight className="w-4 h-4" /></>
                  }
                </Button>
              </form>

              <p className="text-center text-[12px] text-navy/30 mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-gold-dark hover:text-gold font-semibold transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7fa]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    }>
      <AcceptInner />
    </Suspense>
  );
}
