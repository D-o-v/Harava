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
import { Save, KeyRound, ShieldCheck, Mail, Smartphone, Loader2, Eye, EyeOff } from "lucide-react";

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

  // Change password
  const [pwModal, setPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const changePw = useMutation((c: string, n: string) => accountApi.changePassword(c, n));

  // TOTP setup
  const [totpModal, setTotpModal] = useState(false);
  const [totpSecret, setTotpSecret] = useState<{ secret: string; qrCodeUri?: string; qrCode?: string } | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const setupTotp = useMutation(mfaApi.totpSetup);
  const enableTotp = useMutation((code: string) => mfaApi.totpEnable(code));

  // Disable MFA
  const [disableModal, setDisableModal] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const disableMfa = useMutation((code: string) => mfaApi.disable(code));

  const enableEmail = useMutation(mfaApi.emailEnable);
  const enableSms = useMutation(mfaApi.smsEnable);

  const startTotp = async () => {
    try {
      const r = await setupTotp.mutate();
      setTotpSecret(r);
      setTotpModal(true);
    } catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
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
          <CardContent className="space-y-4">
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

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-navy/40 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">{user.mfaEnabled ? "MFA is enabled" : "Add a second factor to protect your account"}</p>
                </div>
              </div>
              {user.mfaEnabled ? (
                <Button variant="outline" size="sm" onClick={() => setDisableModal(true)}>Disable MFA</Button>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={startTotp} disabled={setupTotp.loading}>
                    {setupTotp.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Authenticator app"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={async () => {
                    try { await enableEmail.mutate(); toast("Email MFA enabled", "success"); await refreshMe(); }
                    catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
                  }}>
                    <Mail className="w-3 h-3" /> Email
                  </Button>
                  <Button variant="ghost" size="sm" onClick={async () => {
                    try { await enableSms.mutate(phone); toast("SMS MFA enabled", "success"); await refreshMe(); }
                    catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
                  }}>
                    <Smartphone className="w-3 h-3" /> SMS
                  </Button>
                </div>
              )}
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

      {/* Change Password Modal */}
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
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => { setPwModal(false); setShowCurrentPw(false); setShowNewPw(false); }}>Cancel</Button>
            <Button variant="primary" disabled={!currentPw || !newPw || changePw.loading} onClick={async () => {
              try {
                await changePw.mutate(currentPw, newPw);
                toast("Password changed", "success");
                setPwModal(false); setCurrentPw(""); setNewPw(""); setShowCurrentPw(false); setShowNewPw(false);
              } catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
            }}>
              {changePw.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* TOTP Setup Modal */}
      <Modal isOpen={totpModal} onClose={() => setTotpModal(false)} title="Set up authenticator">
        <div className="space-y-3">
          {totpSecret?.qrCode && (
            <img
              src={totpSecret.qrCode.startsWith("data:") ? totpSecret.qrCode : `data:image/png;base64,${totpSecret.qrCode}`}
              alt="QR code" className="mx-auto w-48 h-48"
            />
          )}
          {totpSecret?.qrCodeUri && !totpSecret.qrCode && (
            <p className="text-xs break-all bg-navy/2 p-3 rounded font-mono">{totpSecret.qrCodeUri}</p>
          )}
          {totpSecret?.secret && (
            <p className="text-xs text-navy/60">Secret: <span className="font-mono">{totpSecret.secret}</span></p>
          )}
          <div>
            <label className="text-xs text-navy/60">Enter the 6-digit code</label>
            <input
              value={totpCode} onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              maxLength={8} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-center"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setTotpModal(false)}>Cancel</Button>
            <Button variant="primary" disabled={totpCode.length < 6 || enableTotp.loading} onClick={async () => {
              try {
                await enableTotp.mutate(totpCode);
                toast("MFA enabled", "success");
                setTotpModal(false); setTotpCode("");
                await refreshMe();
              } catch (e) { toast(e instanceof Error ? e.message : "Invalid code", "error"); }
            }}>
              {enableTotp.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enabling…</> : "Enable"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Disable MFA Modal */}
      <Modal isOpen={disableModal} onClose={() => setDisableModal(false)} title="Disable two-factor auth">
        <div className="space-y-3">
          <p className="text-xs text-navy/60">Enter a current MFA code to confirm.</p>
          <input
            value={disableCode} onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
            maxLength={8} className="w-full border rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-center"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDisableModal(false)}>Cancel</Button>
            <Button variant="primary" disabled={disableCode.length < 6 || disableMfa.loading} onClick={async () => {
              try {
                await disableMfa.mutate(disableCode);
                toast("MFA disabled", "success");
                setDisableModal(false); setDisableCode("");
                await refreshMe();
              } catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
            }}>
              {disableMfa.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Disabling…</> : "Disable"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
