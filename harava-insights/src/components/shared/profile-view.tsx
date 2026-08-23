"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useAuth, ROLE_LABELS } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { accountApi, mfaApi } from "@/lib/api/endpoints";
import { useMutation } from "@/lib/api/hooks";
import { Save, KeyRound, ShieldCheck, Mail, Smartphone, Loader2, Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type MfaMethod = "TOTP" | "EMAIL" | "SMS";
type EnrollStep = "idle" | "codeSent";

function PasswordChecks({ current, next, confirm }: { current: string; next: string; confirm: string }) {
  const checks = [
    ["At least 8 characters", next.length >= 8],
    ["One uppercase letter", /[A-Z]/.test(next)],
    ["One lowercase letter", /[a-z]/.test(next)],
    ["One number", /\d/.test(next)],
    ["Different from current password", Boolean(next) && next !== current],
    ["Passwords match", Boolean(confirm) && next === confirm],
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-lg bg-navy/[0.03] px-3 py-2.5">
      {checks.map(([label, valid]) => (
        <p key={label} className={`flex items-center gap-1.5 text-xs ${valid ? "text-emerald-600" : "text-red-500"}`}>
          {valid ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5 text-center font-bold">×</span>}
          {label}
        </p>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MFA_META: Record<MfaMethod, { label: string; icon: React.ReactNode; sentHint: string }> = {
  TOTP: {
    label: "Authenticator app",
    icon: <KeyRound className="w-4 h-4" />,
    sentHint: "Open your authenticator app and enter the 6-digit code.",
  },
  EMAIL: {
    label: "Email",
    icon: <Mail className="w-4 h-4" />,
    sentHint: "We sent a 6-digit code to your email address. Check your inbox.",
  },
  SMS: {
    label: "SMS",
    icon: <Smartphone className="w-4 h-4" />,
    sentHint: "We sent a 6-digit code to your phone number.",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ProfileView() {
  const { user, refreshMe } = useAuth();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setPhone(user.raw?.phoneNumber ?? "");
  }, [user]);

  // ── Change password ────────────────────────────────────────────────────────
  const [pwModal, setPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const changePw = useMutation((c: string, n: string) => accountApi.changePassword(c, n));

  // ── MFA enroll (EMAIL / SMS two-step, TOTP separate) ──────────────────────
  const [enrollModal, setEnrollModal] = useState(false);
  const [enrollMethod, setEnrollMethod] = useState<MfaMethod | null>(null);
  const [enrollStep, setEnrollStep] = useState<EnrollStep>("idle");
  const [enrollCode, setEnrollCode] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailSending, setEmailSending] = useState(false);
  const [totpSecret, setTotpSecret] = useState<{ secret: string; otpauthUri: string; qrCodeDataUri: string } | null>(null);

  const setupMutation = useMutation(async (method: MfaMethod) => {
    if (method === "EMAIL") return mfaApi.emailSetup();
    if (method === "SMS") return mfaApi.smsSetup();
    return mfaApi.totpSetup();
  });

  const enableMutation = useMutation(async (method: MfaMethod, code: string) => {
    if (method === "EMAIL") return mfaApi.emailEnable(code);
    if (method === "SMS") return mfaApi.smsEnable(code);
    return mfaApi.totpEnable(code);
  });

  const startEnroll = async (method: MfaMethod) => {
    setEnrollMethod(method);
    setEnrollCode("");
    setEnrollError("");
    setEnrollStep("idle");

    if (method === "EMAIL") {
      setEmailSending(true);
      try {
        await setupMutation.mutate(method);
        setEnrollStep("codeSent");
        startResendCooldown();
        setEnrollModal(true);
      } catch (e) {
        toast(e instanceof Error ? e.message : "Failed to send code", "error");
      } finally {
        setEmailSending(false);
      }
      return;
    }

    setEnrollModal(true);
    try {
      const res = await setupMutation.mutate(method);
      if (method === "TOTP") setTotpSecret(res as { secret: string; otpauthUri: string; qrCodeDataUri: string });
      setEnrollStep("codeSent");
      startResendCooldown();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start setup";
      setEnrollError(msg.toLowerCase().includes("phone")
        ? "Add a phone number to your account before enabling SMS authentication."
        : msg);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    const t = setInterval(() => setResendCooldown((v) => { if (v <= 1) { clearInterval(t); return 0; } return v - 1; }), 1000);
  };

  const resend = async () => {
    if (!enrollMethod || resendCooldown > 0) return;
    setEnrollError("");
    try {
      await setupMutation.mutate(enrollMethod);
      startResendCooldown();
    } catch (e) {
      if (e instanceof Error && e.message.includes("TOO_MANY")) {
        setEnrollError("Please wait before requesting another code.");
        startResendCooldown();
      } else {
        setEnrollError(e instanceof Error ? e.message : "Failed");
      }
    }
  };

  const confirmEnroll = async () => {
    if (!enrollMethod) return;
    setEnrollError("");
    try {
      const res = await enableMutation.mutate(enrollMethod, enrollCode);
      setEnrollModal(false);
      setEnrollCode("");
      await refreshMe();
      if (res?.backupCodes?.length) showBackupCodes(res.backupCodes);
      else toast(`${MFA_META[enrollMethod].label} MFA enabled`, "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      if (msg.includes("INVALID") || msg.includes("invalid") || msg.includes("expired")) {
        setEnrollError("Incorrect or expired code — request a new one and try again.");
      } else {
        setEnrollError(msg);
      }
    }
  };

  const closeEnroll = () => {
    setEnrollModal(false);
    setEnrollCode("");
    setEnrollError("");
    setEnrollStep("idle");
    setTotpSecret(null);
  };

  // ── Disable MFA ───────────────────────────────────────────────────────────
  const [disableModal, setDisableModal] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [disableError, setDisableError] = useState("");
  const [disableSendLoading, setDisableSendLoading] = useState(false);
  const [disableCooldown, setDisableCooldown] = useState(0);
  const disableMfa = useMutation((code: string) => mfaApi.disable(code));

  const activeMethod = (user?.raw as { mfaMethod?: string })?.mfaMethod as MfaMethod | undefined;
  const needsOtpSend = activeMethod === "EMAIL" || activeMethod === "SMS";

  const openDisable = async () => {
    if (disableSendLoading) return;
    setDisableCode("");
    setDisableError("");
    setDisableCooldown(0);

    if (needsOtpSend) {
      setDisableModal(true);
      setDisableSendLoading(true);
      try {
        if (activeMethod === "EMAIL") await mfaApi.sendEmailOtp();
        else await mfaApi.sendSmsOtp();
        setDisableCooldown(30);
        const t = setInterval(() => setDisableCooldown((v) => { if (v <= 1) { clearInterval(t); return 0; } return v - 1; }), 1000);
      } catch (e) {
        toast(e instanceof Error ? e.message : "Failed to send code", "error");
      } finally {
        setDisableSendLoading(false);
      }
      return;
    }

    setDisableModal(true);
  };

  const sendDisableOtp = async () => {
    setDisableSendLoading(true);
    setDisableError("");
    try {
      if (activeMethod === "EMAIL") await mfaApi.sendEmailOtp();
      else await mfaApi.sendSmsOtp();
      setDisableCooldown(30);
      const t = setInterval(() => setDisableCooldown((v) => { if (v <= 1) { clearInterval(t); return 0; } return v - 1; }), 1000);
    } catch (e) {
      setDisableError(e instanceof Error ? e.message : "Failed to send code");
    } finally {
      setDisableSendLoading(false);
    }
  };

  const confirmDisable = async () => {
    setDisableError("");
    try {
      await disableMfa.mutate(disableCode);
      setDisableModal(false);
      setDisableCode("");
      await refreshMe();
      toast("MFA disabled", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      setDisableError(msg.includes("INVALID") || msg.includes("invalid") ? "Incorrect or expired code." : msg);
    }
  };

  // ── Backup codes ──────────────────────────────────────────────────────────
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [backupModal, setBackupModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const showBackupCodes = (codes: string[]) => { setBackupCodes(codes); setBackupModal(true); };
  const copyAll = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div>
      <DashboardHeader title="Profile" subtitle="Manage your account and preferences" />
      <div className="p-4 sm:p-6 w-full space-y-6">

        {/* Personal Info */}
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-navy/10 flex items-center justify-center text-navy text-2xl font-bold">
                {(firstName[0] ?? "").toUpperCase()}{(lastName[0] ?? "").toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{firstName} {lastName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Badge variant="success" className="mt-1">{ROLE_LABELS[user.role]}</Badge>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input value={user.email} disabled className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader><CardTitle>Products & Access</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {user.products.map((p) => (
                <Badge key={p} variant="success">
                  {p === "finsight" ? "FinSight AI" : p === "accrediai" ? "AccrediAI" : p === "proed" ? "ProEd AI" : "Admin"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {/* Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-navy/40 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-xs text-gray-500">Change your account password</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPwModal(true)}>Change password</Button>
            </div>

            {/* MFA */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-navy/40 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add a second factor to protect your account</p>
                </div>
              </div>
              <div className="ml-8 space-y-2">
                {(["TOTP", "EMAIL", "SMS"] as MfaMethod[]).map((key) => {
                  const meta = MFA_META[key];
                  const isActive = user.mfaEnabled && activeMethod === key;
                  const otherActive = user.mfaEnabled && !isActive;
                  return (
                    <div key={key} className="flex items-center justify-between rounded-lg border border-navy/8 px-4 py-2.5">
                      <div className="flex items-center gap-2.5 text-sm text-gray-800">
                        <span className={isActive ? "text-navy" : "text-navy/30"}>{meta.icon}</span>
                        {meta.label}
                        {isActive && <Badge variant="success" size="sm">Active</Badge>}
                      </div>
                      {isActive ? (
                        <Button variant="outline" size="sm" onClick={openDisable} disabled={disableSendLoading || disableMfa.loading}>Disable</Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={otherActive || (key === "EMAIL" && emailSending)}
                          title={otherActive ? "Disable your current MFA method first" : undefined}
                          onClick={() => startEnroll(key)}
                        >
                          {key === "EMAIL" && emailSending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</> : otherActive ? "Not enabled" : "Enable"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" disabled={saving} onClick={async () => {
            setSaving(true);
            try {
              await accountApi.updateProfile({ firstName, lastName, phoneNumber: phone || undefined });
              await refreshMe();
              toast("Profile saved", "success");
            } catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
            finally { setSaving(false); }
          }}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </Button>
        </div>
      </div>

      {/* ── Change Password Modal ─────────────────────────────────────────── */}
      <Modal isOpen={pwModal} onClose={() => setPwModal(false)} title="Change password">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-navy/60">Current password</label>
            <div className="relative mt-1">
              <input type={showCurrentPw ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="w-full border rounded-lg px-3 py-2 pr-9 text-sm" />
              <button type="button" onClick={() => setShowCurrentPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-navy/60">New password</label>
            <div className="relative mt-1">
              <input type={showNewPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full border rounded-lg px-3 py-2 pr-9 text-sm" />
              <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Min 8 characters with uppercase, lowercase, and a number</p>
          </div>
          <div>
            <label className="text-xs text-navy/60">Confirm new password</label>
            <div className="relative mt-1">
              <input type={showConfirmPw ? "text" : "password"} value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); setPasswordError(""); }} className="w-full border rounded-lg px-3 py-2 pr-9 text-sm" />
              <button type="button" onClick={() => setShowConfirmPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
          <PasswordChecks current={currentPw} next={newPw} confirm={confirmPw} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => { setPwModal(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPasswordError(""); setShowCurrentPw(false); setShowNewPw(false); setShowConfirmPw(false); }}>Cancel</Button>
            <Button variant="primary" disabled={!currentPw || !newPw || !confirmPw || newPw !== confirmPw || newPw === currentPw || changePw.loading} onClick={async () => {
              if (newPw === currentPw) return setPasswordError("New password must be different from your current password.");
              if (newPw !== confirmPw) return setPasswordError("Passwords do not match.");
              try {
                await changePw.mutate(currentPw, newPw);
                toast("Password changed", "success");
                setPwModal(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPasswordError(""); setShowCurrentPw(false); setShowNewPw(false); setShowConfirmPw(false);
              } catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
            }}>
              {changePw.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── MFA Enroll Modal (EMAIL / SMS / TOTP) ────────────────────────── */}
      {enrollMethod && (
        <Modal isOpen={enrollModal} onClose={closeEnroll} title={`Set up ${MFA_META[enrollMethod].label}`}>
          <div className="space-y-4">
            {/* Loading / error before code is sent */}
            {enrollStep === "idle" && (
              <div className="flex flex-col items-center gap-3 py-4">
                {setupMutation.loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-navy/40" />
                    <p className="text-sm text-navy/50">Sending code…</p>
                  </>
                ) : enrollError ? (
                  <p className="text-sm text-red-600 text-center">{enrollError}</p>
                ) : null}
              </div>
            )}

            {/* TOTP: show QR */}
            {enrollStep === "codeSent" && enrollMethod === "TOTP" && totpSecret && (
              <div className="space-y-3">
                <p className="text-xs text-navy/60">Scan this QR code with your authenticator app, then enter the 6-digit code below.</p>
                {totpSecret.qrCodeDataUri && (
                  <img src={totpSecret.qrCodeDataUri} alt="QR code" className="mx-auto w-44 h-44 rounded-lg" />
                )}
                {totpSecret.secret && (
                  <div className="bg-navy/[0.03] border border-navy/8 rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-navy/40 mb-0.5">Manual entry key</p>
                    <p className="font-mono text-xs text-navy tracking-widest break-all">{totpSecret.secret}</p>
                  </div>
                )}
              </div>
            )}

            {/* EMAIL / SMS: sent hint */}
            {enrollStep === "codeSent" && enrollMethod !== "TOTP" && (
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                <div className="text-emerald-500 mt-0.5">{MFA_META[enrollMethod].icon}</div>
                <p className="text-sm text-emerald-800">{MFA_META[enrollMethod].sentHint}</p>
              </div>
            )}

            {/* Code input */}
            {enrollStep === "codeSent" && (
              <div className="space-y-1.5">
                <label className="text-xs text-navy/60">Verification code</label>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={enrollCode}
                  onChange={(e) => { setEnrollCode(e.target.value.replace(/\D/g, "")); setEnrollError(""); }}
                  maxLength={8}
                  placeholder="000000"
                  className="w-full border rounded-lg px-3 py-2.5 text-xl font-mono tracking-[0.4em] text-center outline-none focus:border-navy/30"
                />
                {enrollError && <p className="text-xs text-red-600">{enrollError}</p>}
                {enrollMethod !== "TOTP" && (
                  <button
                    type="button"
                    onClick={resend}
                    disabled={resendCooldown > 0 || setupMutation.loading}
                    className="text-xs text-navy/40 hover:text-navy disabled:opacity-40 flex items-center gap-1 mt-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={closeEnroll}>Cancel</Button>
              <Button
                variant="primary"
                disabled={enrollStep !== "codeSent" || enrollCode.length < 6 || enableMutation.loading}
                onClick={confirmEnroll}
              >
                {enableMutation.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enabling…</> : "Enable"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Disable MFA Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={disableModal} onClose={() => setDisableModal(false)} title="Disable two-factor auth">
        <div className="space-y-4">
          <>
              <p className="text-xs text-navy/60">
                {disableSendLoading
                  ? `Sending a verification code to your ${activeMethod === "EMAIL" ? "email" : "phone"}…`
                  : needsOtpSend
                  ? `Enter the code ${activeMethod === "EMAIL" ? "sent to your email" : "sent to your phone"}, or use a backup code.`
                  : "Enter a current code from your authenticator app, or use a backup code."}
              </p>
              <input
                autoFocus
                inputMode="numeric"
                value={disableCode}
                onChange={(e) => { setDisableCode(e.target.value.replace(/\D/g, "")); setDisableError(""); }}
                maxLength={8}
                placeholder="000000"
                disabled={disableSendLoading}
                className="w-full border rounded-lg px-3 py-2.5 text-xl font-mono tracking-[0.4em] text-center outline-none focus:border-navy/30"
              />
              {disableError && <p className="text-xs text-red-600">{disableError}</p>}
              {needsOtpSend && (
                <button
                  type="button"
                  onClick={sendDisableOtp}
                  disabled={disableCooldown > 0 || disableSendLoading}
                  className="text-xs text-navy/40 hover:text-navy disabled:opacity-40 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  {disableCooldown > 0 ? `Resend in ${disableCooldown}s` : "Resend code"}
                </button>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setDisableModal(false)}>Cancel</Button>
                <Button variant="primary" disabled={disableSendLoading || disableCode.length < 6 || disableMfa.loading} onClick={confirmDisable}>
                  {disableMfa.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Disabling…</> : "Disable"}
                </Button>
              </div>
          </>
        </div>
      </Modal>

      {/* ── Backup Codes Modal ────────────────────────────────────────────── */}
      <Modal isOpen={backupModal} onClose={() => setBackupModal(false)} title="Save your backup codes">
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
            <p className="text-xs text-amber-800 font-medium">These codes will not be shown again.</p>
            <p className="text-xs text-amber-700 mt-0.5">Each code can be used once to sign in if you lose access to your MFA device.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code) => (
              <div key={code} className="font-mono text-sm text-center bg-navy/[0.03] border border-navy/8 rounded-lg py-2 px-3 tracking-widest text-navy">
                {code}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={copyAll} className="flex items-center gap-1.5">
              {copied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
            </Button>
            <Button variant="primary" size="sm" onClick={() => { setBackupModal(false); toast("MFA enabled", "success"); }}>
              I&apos;ve saved these
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
