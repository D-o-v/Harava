"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, Shield, Users, RefreshCw, Loader2 } from "lucide-react";
import { rolesApi, type Role } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";

function RoleCard({ role, tag }: { role: Role; tag: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5 text-navy/50" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <h3 className="text-[14px] font-semibold text-navy truncate">{role.name}</h3>
              <Badge variant="info" size="sm">{tag}</Badge>
            </div>
            {role.description && (
              <p className="text-[12px] text-navy/45">{role.description}</p>
            )}
            <p className="text-[11px] text-navy/30 mt-1 font-mono">{role.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RolesPage() {
  const staffRoles = useApi(() => rolesApi.staff(), []);
  const companyRoles = useApi(() => rolesApi.company(), []);

  const loading = staffRoles.loading || companyRoles.loading;
  const error = staffRoles.error || companyRoles.error;

  const refetch = () => { staffRoles.refetch(); companyRoles.refetch(); };

  if (loading) return <><DashboardHeader title="Roles & Permissions" subtitle="Staff and company-user role catalogue" /><PageLoader message="Loading roles…" /></>;
  if (error) return <><DashboardHeader title="Roles & Permissions" subtitle="Staff and company-user role catalogue" /><PageError message={error} onRetry={refetch} /></>;

  return (
    <div>
      <DashboardHeader title="Roles & Permissions" subtitle="Staff and company-user role catalogue" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="default">{(staffRoles.data?.length ?? 0) + (companyRoles.data?.length ?? 0)} roles</Badge>
            <Badge variant="info">{staffRoles.data?.length ?? 0} staff</Badge>
            <Badge variant="success">{companyRoles.data?.length ?? 0} company</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {!loading && !error && (
          <>
            {/* Staff Roles */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-navy/40" />
                <h2 className="text-[13px] font-semibold text-navy uppercase tracking-wider">Staff Roles</h2>
                <Badge variant="default" size="sm">{staffRoles.data?.length ?? 0}</Badge>
              </div>
              {(staffRoles.data?.length ?? 0) === 0 ? (
                <p className="text-[13px] text-navy/30 py-4">No staff roles found.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(staffRoles.data ?? []).map((r: Role) => (
                    <RoleCard key={r.id} role={r} tag="Staff" />
                  ))}
                </div>
              )}
            </div>

            {/* Company Roles */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-navy/40" />
                <h2 className="text-[13px] font-semibold text-navy uppercase tracking-wider">Company-User Roles</h2>
                <Badge variant="default" size="sm">{companyRoles.data?.length ?? 0}</Badge>
              </div>
              {(companyRoles.data?.length ?? 0) === 0 ? (
                <p className="text-[13px] text-navy/30 py-4">No company roles found.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(companyRoles.data ?? []).map((r: Role) => (
                    <RoleCard key={r.id} role={r} tag="Company" />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
