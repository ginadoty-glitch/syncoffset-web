const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const showId = "a6bd49da-b65c-4e7a-8ef0-42f86eaef84c";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

(async () => {
  const ins = await sb.from("shipments").insert({
    show_id: showId,
    direction: "inbound",
    origin: "test",
    destination: "test",
    status: "preparing",
  }).select("id").single();
  console.log("insert", ins.error?.message ?? ins.data?.id);
  const sel = await sb.from("shipments").select("id").eq("show_id", showId).limit(1);
  console.log("select", sel.error?.message ?? sel.data?.length);
})();
