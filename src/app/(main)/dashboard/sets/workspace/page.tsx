import { redirect } from "next/navigation";

/** Legacy entry — navigable flow starts at /dashboard/sets */
export default function SetsWorkspaceRedirectPage() {
  redirect("/dashboard/sets");
}
