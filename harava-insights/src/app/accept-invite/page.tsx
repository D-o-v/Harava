"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ArrowRight, CheckCircle, Eye, EyeOff, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobePanel } from "@/components/auth/globe-panel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/lib/toast";
import { previewInvitation, acceptInvitation, getMe, ApiError } from "@/lib/api";
import { defaultRouteForRole } from "@/lib/auth";

// ─── Dial codes ──────────────────────────────────────────────────────────────
// Flag rendered via Unicode regional indicator letters — works Mac, Windows 10+, Android, iOS
// For Windows <10 fallback we show the ISO code as text alongside

const DIAL_CODES: { code: string; dial: string; name: string }[] = [
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "US", dial: "+1",   name: "United States" },
  { code: "GB", dial: "+44",  name: "United Kingdom" },
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "ZA", dial: "+27",  name: "South Africa" },
  { code: "ET", dial: "+251", name: "Ethiopia" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "UG", dial: "+256", name: "Uganda" },
  { code: "SN", dial: "+221", name: "Senegal" },
  { code: "EG", dial: "+20",  name: "Egypt" },
  { code: "MA", dial: "+212", name: "Morocco" },
  { code: "CA", dial: "+1",   name: "Canada" },
  { code: "AU", dial: "+61",  name: "Australia" },
  { code: "IN", dial: "+91",  name: "India" },
  { code: "DE", dial: "+49",  name: "Germany" },
  { code: "FR", dial: "+33",  name: "France" },
  { code: "IT", dial: "+39",  name: "Italy" },
  { code: "ES", dial: "+34",  name: "Spain" },
  { code: "NL", dial: "+31",  name: "Netherlands" },
  { code: "BE", dial: "+32",  name: "Belgium" },
  { code: "SE", dial: "+46",  name: "Sweden" },
  { code: "NO", dial: "+47",  name: "Norway" },
  { code: "DK", dial: "+45",  name: "Denmark" },
  { code: "FI", dial: "+358", name: "Finland" },
  { code: "PL", dial: "+48",  name: "Poland" },
  { code: "PT", dial: "+351", name: "Portugal" },
  { code: "CH", dial: "+41",  name: "Switzerland" },
  { code: "AT", dial: "+43",  name: "Austria" },
  { code: "IE", dial: "+353", name: "Ireland" },
  { code: "BR", dial: "+55",  name: "Brazil" },
  { code: "MX", dial: "+52",  name: "Mexico" },
  { code: "AR", dial: "+54",  name: "Argentina" },
  { code: "CO", dial: "+57",  name: "Colombia" },
  { code: "CL", dial: "+56",  name: "Chile" },
  { code: "PE", dial: "+51",  name: "Peru" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "TR", dial: "+90",  name: "Turkey" },
  { code: "PK", dial: "+92",  name: "Pakistan" },
  { code: "ID", dial: "+62",  name: "Indonesia" },
  { code: "PH", dial: "+63",  name: "Philippines" },
  { code: "VN", dial: "+84",  name: "Vietnam" },
  { code: "TH", dial: "+66",  name: "Thailand" },
  { code: "KR", dial: "+82",  name: "South Korea" },
  { code: "JP", dial: "+81",  name: "Japan" },
  { code: "CN", dial: "+86",  name: "China" },
  { code: "RU", dial: "+7",   name: "Russia" },
  { code: "UA", dial: "+380", name: "Ukraine" },
  { code: "ZM", dial: "+260", name: "Zambia" },
  { code: "ZW", dial: "+263", name: "Zimbabwe" },
];

// Convert ISO code to flag emoji — regional indicator letters
function toFlag(iso: string): string {
  return iso
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

// ─── Dial code picker ────────────────────────────────────────────────────────

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
        className="h-full flex items-center gap-1.5 px-3 border-r border-navy/10 hover:bg-navy/3 transition-colors rounded-l-xl"
      >
        {/* Flag — cross-platform emoji font stack */}
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
                className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-navy/4 transition-colors ${
                  d.code === value.code ? "bg-gold/8" : ""
                }`}
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

// ─── Password rules ──────────────────────────────────────────────────────────

const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter",  test: (p: string) => /[a-z]/.test(p) },
  { label: "One number",            test: (p: string) => /\d/.test(p) },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AcceptInvitePageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7fa]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    }>
      <AcceptInvitePage />
    </Suspense>
  );
}

function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { toast } = useToast();

  const [previewing, setPreviewing] = useState(true);
  const [previewError, setPreviewError] = useState("");
  const [orgName, setOrgName] = useState("");
  const [role, setRole] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dialEntry, setDialEntry] = useState(DIAL_CODES[0]); // default Nigeria
  const [localPhone, setLocalPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) {
      setPreviewError("Invalid invitation link — no token found.");
      setPreviewing(false);
      return;
    }
    previewInvitation(token)
      .then((d) => { setOrgName(d.organizationName); setRole(d.role); setInviteEmail(d.email); })
      .catch((err) => setPreviewError(err instanceof ApiError ? err.message : "This invitation is invalid or has expired."))
      .finally(() => setPreviewing(false));
  }, [token]);

  const pwValid = RULES.every((r) => r.test(password));

  // Compose E.164: strip leading zeros from local part, prepend dial code
  const fullPhone = dialEntry.dial + localPhone.replace(/^0+/, "").replace(/\s+/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!firstName.trim()) { setFieldErrors({ firstName: "Required" }); return; }
    if (!lastName.trim())  { setFieldErrors({ lastName: "Required" }); return; }
    if (!localPhone.trim()) { setFieldErrors({ phoneNumber: "Enter your phone number" }); return; }
    if (!pwValid) { setFieldErrors({ password: "Password doesn't meet all requirements" }); return; }
    if (password !== confirmPassword) { setFieldErrors({ confirmPassword: "Passwords do not match" }); return; }

    setLoading(true);
    try {
      await acceptInvitation(token, password, firstName.trim(), lastName.trim(), fullPhone);
      try {
        const me = await getMe();
        const userRole = (me as any).role ?? "OWNER";
        setDone(true);
        toast("Welcome to Harava! Your account is ready.", "success");
        setTimeout(() => router.replace(defaultRouteForRole(userRole)), 1200);
      } catch {
        setDone(true);
        toast("Welcome to Harava! Your account is ready.", "success");
        setTimeout(() => router.replace("/finsight"), 1200);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f1a]">
      <GlobePanel variant="login" />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f6f7fa] dark:bg-[#080d1a] relative overflow-y-auto">
        <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(193,155,63,0.03),transparent_60%)]" />

        <div className="relative w-full max-w-[420px] py-8 animate-fade-in">
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-xl object-cover ring-1 ring-navy/6" />
            <span className="text-xl font-bold text-navy tracking-tight">Harava<span className="text-gold">.</span></span>
          </Link>

          {/* Loading */}
          {previewing && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
              <p className="text-[13px] text-navy/40">Verifying your invitation…</p>
            </div>
          )}

          {/* Invalid */}
          {!previewing && previewError && (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-navy mb-1">Invitation invalid</h2>
                <p className="text-[13px] text-navy/50">{previewError}</p>
              </div>
              <Link href="/auth/login" className="inline-block text-[13px] font-medium text-gold-dark hover:text-gold transition-colors">
                Go to login →
              </Link>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-navy mb-1">You're all set!</h2>
                <p className="text-[13px] text-navy/50">Redirecting you to your dashboard…</p>
              </div>
              <Loader2 className="w-5 h-5 animate-spin text-gold mx-auto" />
            </div>
          )}

          {/* Form */}
          {!previewing && !previewError && !done && (
            <>
              {/* Invite banner */}
              <div className="mb-7 p-4 rounded-2xl bg-white border border-navy/6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gold/10 to-gold/5 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-navy">You've been invited</p>
                    <p className="text-[12px] text-navy/50 mt-0.5">
                      Join <span className="font-medium text-navy">{orgName}</span> as <span className="font-medium text-navy">{role}</span>
                    </p>
                    {inviteEmail && <p className="text-[11px] text-navy/35 mt-0.5">{inviteEmail}</p>}
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-navy mb-1 tracking-tight">Set up your account</h1>
              <p className="text-[14px] text-navy/40 mb-6">Create a password to get started</p>

              {error && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200/60 animate-fade-in">
                  <p className="text-[12px] font-semibold text-red-700 mb-1">Could not create your account</p>
                  <p className="text-[13px] text-red-600">{error}</p>
                  {Object.keys(fieldErrors).length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {Object.entries(fieldErrors).map(([field, msg]) => (
                        <li key={field} className="text-[12px] text-red-500 flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0">•</span>
                          <span><span className="font-medium capitalize">{field.replace(/([A-Z])/g, " $1").trim()}</span>: {msg}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-navy/60">First name</label>
                    <input
                      type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane" required
                      className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-2.5 text-sm text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none transition-all hover:border-navy/15 shadow-sm"
                    />
                    {fieldErrors.firstName && <p className="text-[11px] text-red-600">{fieldErrors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-navy/60">Last name</label>
                    <input
                      type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe" required
                      className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-2.5 text-sm text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none transition-all hover:border-navy/15 shadow-sm"
                    />
                    {fieldErrors.lastName && <p className="text-[11px] text-red-600">{fieldErrors.lastName}</p>}
                  </div>
                </div>

                {/* Phone with dial picker */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-navy/60">Phone number</label>
                  <div className={`flex bg-white border-[1.5px] rounded-xl overflow-visible shadow-sm transition-all ${
                    fieldErrors.phoneNumber ? "border-red-300" : "border-navy/8 hover:border-navy/15 focus-within:border-gold focus-within:ring-[3px] focus-within:ring-gold/8"
                  }`}>
                    <DialPicker value={dialEntry} onChange={setDialEntry} />
                    <input
                      type="tel"
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value.replace(/[^\d\s\-()]/g, ""))}
                      placeholder="8012345678"
                      required
                      className="flex-1 px-3 py-2.5 text-sm text-navy placeholder:text-navy/25 outline-none bg-transparent"
                    />
                  </div>
                  {/* Preview of full number */}
                  {localPhone && (
                    <p className="text-[11px] text-navy/40 pl-1">
                      Will be sent as <span className="font-mono font-medium text-navy/60">{fullPhone}</span>
                    </p>
                  )}
                  {fieldErrors.phoneNumber && <p className="text-[11px] text-red-600">{fieldErrors.phoneNumber}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-navy/60">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password" required
                      className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-2.5 pr-11 text-sm text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none transition-all hover:border-navy/15 shadow-sm"
                    />
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      {RULES.map((r) => (
                        <div key={r.label} className={`flex items-center gap-1.5 text-[11px] ${r.test(password) ? "text-emerald-600" : "text-navy/35"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.test(password) ? "bg-emerald-500" : "bg-navy/15"}`} />
                          {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                  {fieldErrors.password && <p className="text-[11px] text-red-600">{fieldErrors.password}</p>}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-navy/60">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"} value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password" required
                      className={`w-full bg-white border-[1.5px] rounded-xl px-4 py-2.5 pr-11 text-sm text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/8 outline-none transition-all shadow-sm ${
                        confirmPassword && confirmPassword !== password ? "border-red-300 focus:border-red-400"
                        : confirmPassword && confirmPassword === password ? "border-emerald-300 focus:border-emerald-400"
                        : "border-navy/8 hover:border-navy/15 focus:border-gold"
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && <p className="text-[11px] text-red-600">{fieldErrors.confirmPassword}</p>}
                </div>

                <Button variant="primary" size="lg" className="w-full mt-2" type="submit" disabled={loading}>
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                    : <>Accept & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </form>

              <p className="text-center text-[12px] text-navy/30 mt-5">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-gold-dark hover:text-gold font-medium transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
