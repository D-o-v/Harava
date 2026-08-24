"use client";

import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

/** Render an affordance only when the signed-in user has the required key. */
export function Can({ permission, children }: { permission: string; children: ReactNode }) {
  const { can } = useAuth();
  return can(permission) ? <>{children}</> : null;
}
