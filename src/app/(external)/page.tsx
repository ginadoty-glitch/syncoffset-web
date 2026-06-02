import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/sets");
  return <>Coming Soon</>;
}
