"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Save, Camera, Loader2, ShieldCheck, KeyRound, Mail, Smartphone, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { accountApi, mfaApi } from "@/lib/api/endpoints";
import { useMutation } from "@/lib/api/hooks";

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

export default function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.raw?.phoneNumber ?? "");
  }, [user]);

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  // Change password
  const [pwModal, setPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const changePw = useMutation((c: string, n: string) => accountApi.changePassword(c, n));

  // TOTP
  const [totpModal, setTotpModal] = useState(false);
  const [totpSecret, setTotpSecret] = useState<{ secret: string; otpauthUri: string; qrCodeDataUri: string } | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const setupTotp = useMutation(mfaApi.totpSetup);
  const enableTotp = useMutation((code: string) => mfaApi.totpEnable(code));

  // Disable
  const [disableModal, setDisableModal] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const disableMfa = useMutation((code: string) => mfaApi.disable(code));

  const enableEmail = useMutation((code: string) => mfaApi.emailEnable(code));
  const enableSms = useMutation((code: string) => mfaApi.smsEnable(code));

  const startTotp = async () => {
    try { const r = await setupTotp.mutate(); setTotpSecret(r); setTotpModal(true); }
    catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Profile" subtitle="Manage your account and security" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold">{initials || "—"}</div>
              <div>
                <p className="font-medium text-gray-900">{firstName} {lastName}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <Button variant="ghost" size="sm" className="mt-1"><Camera className="w-3 h-3" /> Change Photo</Button>
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
                <input value={user?.email ?? ""} disabled className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-navy/40 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 font-medium">Password</p>
                  <p className="text-xs text-gray-500">Change your account password</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPwModal(true)}>Change password</Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-navy/40 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">{user?.mfaEnabled ? "MFA is enabled" : "Protect your account with a second factor"}</p>
                </div>
              </div>
              {user?.mfaEnabled ? (
                <Button variant="outline" size="sm" onClick={() => setDisableModal(true)}>Disable MFA</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={startTotp} disabled={setupTotp.loading}>{setupTotp.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Authenticator app"}</Button>
                  <Button variant="ghost" size="sm" onClick={async () => { try { await enableEmail.mutate("prompt"); toast("Email MFA enabled", "success"); await refreshMe(); } catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); } }}><Mail className="w-3 h-3" /> Email</Button>
                  <Button variant="ghost" size="sm" onClick={async () => { try { await enableSms.mutate("prompt"); toast("SMS MFA enabled", "success"); await refreshMe(); } catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); } }}><Smartphone className="w-3 h-3" /> SMS</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Access</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {user?.products.map((p) => <Badge key={p} variant="info">{p}</Badge>)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Scope: {user?.scope}</p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary"><Save className="w-4 h-4" /> Save Changes</Button>
        </div>
      </div>

      <Modal isOpen={pwModal} onClose={() => setPwModal(false)} title="Change password">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-navy/60">Current password</label>
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-navy/60">New password</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
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
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setPwModal(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPasswordError(""); setShowConfirmPw(false); }}>Cancel</Button>
            <Button variant="primary" onClick={async () => {
              if (newPw === currentPw) return setPasswordError("New password must be different from your current password.");
              if (newPw !== confirmPw) return setPasswordError("Passwords do not match.");
              try { await changePw.mutate(currentPw, newPw); toast("Password changed", "success"); setPwModal(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPasswordError(""); setShowConfirmPw(false); }
              catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
            }} disabled={!currentPw || !newPw || !confirmPw || newPw !== confirmPw || newPw === currentPw || changePw.loading}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={totpModal} onClose={() => setTotpModal(false)} title="Set up authenticator">
        <div className="space-y-3">
          {totpSecret?.qrCodeDataUri && (
            <img src={totpSecret.qrCodeDataUri} alt="QR code" className="mx-auto w-48 h-48" />
          )}
          {totpSecret?.otpauthUri && (
            <p className="text-xs break-all bg-navy/2 p-3 rounded font-mono">{totpSecret.otpauthUri}</p>
          )}
          {totpSecret?.secret && (
            <p className="text-xs text-navy/60">Secret: <span className="font-mono">{totpSecret.secret}</span></p>
          )}
          <div>
            <label className="text-xs text-navy/60">Enter the 6-digit code</label>
            <input value={totpCode} onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))} maxLength={8} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-center" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setTotpModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={async () => {
              try { await enableTotp.mutate(totpCode); toast("MFA enabled", "success"); setTotpModal(false); await refreshMe(); }
              catch (e) { toast(e instanceof Error ? e.message : "Invalid code", "error"); }
            }} disabled={totpCode.length < 6 || enableTotp.loading}>Enable</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={disableModal} onClose={() => setDisableModal(false)} title="Disable two-factor auth">
        <div className="space-y-3">
          <p className="text-xs text-navy/60">Enter a current MFA code to confirm.</p>
          <input value={disableCode} onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))} maxLength={8} className="w-full border rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-center" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDisableModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={async () => {
              try { await disableMfa.mutate(disableCode); toast("MFA disabled", "success"); setDisableModal(false); await refreshMe(); }
              catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
            }} disabled={disableCode.length < 6 || disableMfa.loading}>Disable</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
