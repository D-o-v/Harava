"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { CreditCard, Building2, CheckCircle, Download } from "lucide-react";
import { platformApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";

export default function BillingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const tenants = useApi(() => platformApi.listTenants(), []);
  const list = tenants.data ?? [];
  const subscriptionTenants = list.filter((tenant) => tenant.billingMode?.toUpperCase() === "SUBSCRIPTION");
  const openTenants = list.filter((tenant) => tenant.billingMode?.toUpperCase() === "OPEN");

  if (tenants.loading) return <><DashboardHeader title="Billing & Subscriptions" subtitle="Monitor tenant billing posture and subscription eligibility" /><PageLoader message="Loading billing data…" /></>;
  if (tenants.error) return <><DashboardHeader title="Billing & Subscriptions" subtitle="Monitor tenant billing posture and subscription eligibility" /><PageError message={tenants.error} onRetry={tenants.refetch} /></>;

  return (
    <div>
      <DashboardHeader title="Billing & Subscriptions" subtitle="Monitor tenant billing posture and subscription eligibility" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Building2 className="w-8 h-8 text-gold" /><div><p className="text-xl font-bold">{list.length}</p><p className="text-xs text-gray-500">Total tenants</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><CreditCard className="w-8 h-8 text-navy" /><div><p className="text-xl font-bold">{subscriptionTenants.length}</p><p className="text-xs text-gray-500">Subscription tenants</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-8 h-8 text-emerald-600" /><div><p className="text-xl font-bold">{openTenants.length}</p><p className="text-xs text-gray-500">Open access tenants</p></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tenant Billing Posture</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast("Billing export is queued.", "info")}><Download className="w-3 h-3" /> Export</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-150">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Client</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Billing mode</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Tenant status</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Country</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Currency</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{tenant.organizationName}</td>
                    <td className="px-6 py-3 text-center"><Badge variant="default">{tenant.billingMode ?? "UNSPECIFIED"}</Badge></td>
                    <td className="px-6 py-3 text-center"><Badge variant={tenant.status?.toUpperCase() === "ACTIVE" ? "success" : "error"}>{tenant.status}</Badge></td>
                    <td className="px-6 py-3 text-center text-gray-500">{tenant.countryCode ?? "—"}</td>
                    <td className="px-6 py-3 text-center text-gray-500">{tenant.defaultCurrency ?? "—"}</td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/clients?tenantId=${tenant.id}`)}>Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
