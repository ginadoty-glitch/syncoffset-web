import { randomUUID } from "node:crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SHOW_ID = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;

if (!SUPABASE_URL || !SUPABASE_KEY || !SHOW_ID) {
  console.error("Missing env vars. Source .env.local first.");
  process.exit(1);
}

const REST = `${SUPABASE_URL}/rest/v1`;
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

async function patch(table, body, filter) {
  const url = `${REST}/${table}?${filter}`;
  const res = await fetch(url, { method: "PATCH", headers: { ...HEADERS, Prefer: "return=minimal" }, body: JSON.stringify(body) });
  if (!res.ok) return { error: { message: `${res.status} ${await res.text()}` } };
  return { error: null };
}

async function insert(table, rows) {
  const res = await fetch(`${REST}/${table}`, { method: "POST", headers: HEADERS, body: JSON.stringify(rows) });
  if (!res.ok) return { error: { message: `${res.status} ${await res.text()}` } };
  return { error: null };
}

const results = {};
const errors = [];
const now = new Date().toISOString();

// 1. Update shows
const { error: showErr } = await patch("shows", {
  name: "Alphabet Soup",
  code: "SOUP",
  location: "Vancouver, BC",
  production_company: "Stage 49 Ltd.",
  production_type: "scripted_television",
  prep_start_date: "2026-04-14",
  principal_photography_start_date: "2026-05-11",
  wrap_date: "2026-06-10",
  estimated_shoot_days: 21,
}, `id=eq.${SHOW_ID}`);
if (showErr) errors.push("shows: " + showErr.message);
else results.shows = 1;

// 2. Demote existing published revisions
await patch("production_schedule_revisions", { revision_scope: "shared_draft" },
  `show_id=eq.${SHOW_ID}&revision_scope=eq.published`);

// 3. Insert new revision
const revisionId = randomUUID();
const { error: revErr } = await insert("production_schedule_revisions", {
  id: revisionId,
  show_id: SHOW_ID,
  revision_name: "Official White One-Line · 21 shoot days · May 11 – Jun 10, 2026",
  revision_source: "csv",
  revision_scope: "published",
  imported_by: "soup-import@syncoffset.local",
  imported_at: now,
  source_fingerprint: "soup-oneliner-white-05102026",
  import_merge_kind: "replaced",
  notes: "Imported from SOUP_ONE LINE_WHITE_05.10.26.pdf",
});
if (revErr) errors.push("production_schedule_revisions: " + revErr.message);
else results.production_schedule_revisions = 1;

// 4. 21 shoot days
const SHOOT_DAYS = [
  { day: 1, date: "2026-05-11", location: "Riverview East", title: "INT. Joshi Hospital Room", scenes: ["2","38pt"], dayType: "INT", dayNight: "D3", unit: "Main" },
  { day: 2, date: "2026-05-12", location: "Sts'ailes Nation", title: "EXT/INT. Rising Road Girls Home", scenes: ["20pt.1","22","21","A22pt"], dayType: "EXT", dayNight: "D2", unit: "Main" },
  { day: 3, date: "2026-05-13", location: "Sts'ailes Nation", title: "INT/EXT. Rising Road · Yakama Reservation", scenes: ["A22pt","20pt.2","19"], dayType: "INT/EXT", dayNight: "D2", unit: "Main" },
  { day: 4, date: "2026-05-14", location: "Skagit Motel, Hope BC", title: "EXT. Blue Rose Motel (Split Day/Night)", scenes: ["33","34pt","TBD","31pt","25pt"], dayType: "I/E", dayNight: "D3/N2", unit: "Main" },
  { day: 5, date: "2026-05-15", location: "Riverview North", title: "INT. Autopsy Room · Morgue", scenes: ["23pt","51pt"], dayType: "INT", dayNight: "N2", unit: "Main" },
  { day: 6, date: "2026-05-19", location: "Minaty Bay", title: "EXT. Lake · Lars Homestead", scenes: ["34pt","35pt"], dayType: "EXT", dayNight: "D3", unit: "Main" },
  { day: 7, date: "2026-05-20", location: "Minaty Bay", title: "EXT. Lake · Joshi LSD Trip", scenes: ["35pt"], dayType: "EXT", dayNight: "D3", unit: "Main" },
  { day: 8, date: "2026-05-21", location: "Mammoth Studios", title: "INT. Willie Trailer · FBI Plane · Crime Scene", scenes: ["2pt","25pt","10","13","B14"], dayType: "INT", dayNight: "N1/D2", unit: "Main" },
  { day: 9, date: "2026-05-22", location: "Blieberger Farm", title: "EXT. Woods Near Willie Trailer", scenes: ["15","17","18"], dayType: "EXT", dayNight: "D2", unit: "Main" },
  { day: 10, date: "2026-05-25", location: "Blieberger Farm", title: "EXT. Crime Scene · Willie Trailer", scenes: ["12","A14","C14"], dayType: "EXT", dayNight: "D2", unit: "Main" },
  { day: 11, date: "2026-05-27", location: "Blieberger Farm", title: "EXT. Willie Trailer · Night Shootout", scenes: ["1","2pt","3pt"], dayType: "EXT", dayNight: "N1", unit: "Main" },
  { day: 12, date: "2026-05-28", location: "Blieberger Farm", title: "EXT. Willie Trailer · Shootout Continuation", scenes: ["3pt"], dayType: "EXT", dayNight: "N1", unit: "Main" },
  { day: 13, date: "2026-05-29", location: "Blieberger Farm", title: "EXT. Woods · Masked Gunman Chase", scenes: ["3pt"], dayType: "EXT", dayNight: "N1", unit: "Main" },
  { day: 14, date: "2026-06-01", location: "Riverview East", title: "INT. FBI HQ Hallway · Bill Office", scenes: ["4","6","A46","5","7","46","47pt","A49pt","B49pt"], dayType: "INT", dayNight: "D2/D4", unit: "Main" },
  { day: 15, date: "2026-06-02", location: "Riverview ISB", title: "INT. FBI Basement · X-Files Division", scenes: ["47","A49","48","B49","49","50"], dayType: "INT", dayNight: "D4/N4", unit: "Main" },
  { day: 16, date: "2026-06-03", location: "Riverview Penn Hall", title: "EXT. Morgue Parking Lot", scenes: ["24"], dayType: "EXT", dayNight: "N2", unit: "Main" },
  { day: 17, date: "2026-06-04", location: "Dunbar House / Pendrell Suites", title: "INT. Harmon & Joshi Homes · Day for Night", scenes: ["51pt","52","55","53pt","54","53pt"], dayType: "INT", dayNight: "N4", unit: "Main" },
  { day: 18, date: "2026-06-05", location: "Golden Eagle Quarry", title: "EXT. Ice Cave Entrance (Split)", scenes: ["45","42","40"], dayType: "EXT", dayNight: "D4/N3", unit: "Main" },
  { day: 19, date: "2026-06-08", location: "Mammoth Studios", title: "INT. Ice Cave", scenes: ["41pt"], dayType: "INT", dayNight: "N3", unit: "Main" },
  { day: 20, date: "2026-06-09", location: "Mammoth Studios", title: "INT. Ice Cave · LSD Lab · Tunnel", scenes: ["A42pt","B42"], dayType: "INT", dayNight: "N3", unit: "Main" },
  { day: 21, date: "2026-06-10", location: "Mammoth Studios", title: "INT. Ice Cave · Owl Nest · VFX Elements", scenes: ["C42pt"], dayType: "INT", dayNight: "N3", unit: "Main" },
];

const dayRows = SHOOT_DAYS.map((d, idx) => ({
  revision_id: revisionId,
  show_id: SHOW_ID,
  strip_position: idx,
  shoot_day: d.date + "T07:00:00",
  day_type: d.dayType,
  title: d.location + " · " + d.title,
  notes: "D/N: " + d.dayNight + " · Unit: " + d.unit + " · Scenes: " + d.scenes.join(", "),
  imported_at: now,
  created_by: "soup-import@syncoffset.local",
}));

const { error: daysErr } = await insert("production_schedule_days", dayRows);
if (daysErr) errors.push("production_schedule_days: " + daysErr.message);
else results.production_schedule_days = dayRows.length;

// 5. Locations
const LOCATIONS = [
  { name: "Riverview East Lawn", address: "Riverview Hospital, Coquitlam, BC", notes: "FBI HQ Hallway, Joshi Hospital Room, Bill Office" },
  { name: "Riverview North Lawn", address: "Riverview Hospital, Coquitlam, BC", notes: "Autopsy Room / Morgue" },
  { name: "Riverview ISB", address: "Riverview Hospital, Coquitlam, BC", notes: "FBI Basement, X-Files Division Office, Elevator" },
  { name: "Riverview Penn Hall", address: "Riverview Hospital, Coquitlam, BC", notes: "Morgue Parking Lot (night exterior)" },
  { name: "Sts'ailes Nation", address: "Sts'ailes Nation, Chehalis, BC", notes: "Rising Road Girls Home, Yakama Reservation" },
  { name: "Skagit Motel", address: "Hope, BC", notes: "Blue Rose Motel (day/night)" },
  { name: "Minaty Bay", address: "Britannia Beach, BC", notes: "Lars Lake / Homestead, Joshi LSD Trip" },
  { name: "Mammoth Studios", address: "Burnaby, BC", notes: "Willie Trailer, FBI Plane cabin, Ice Cave (stages)" },
  { name: "Blieberger Farm", address: "Fraser Valley, BC", notes: "Willie Trailer exterior/crime scene, woods, night shootout" },
  { name: "Dunbar House", address: "Vancouver, BC", notes: "Harmon D.C. Home" },
  { name: "Pendrell Suites", address: "Vancouver, BC", notes: "Joshi D.C. Apartment" },
  { name: "Golden Eagle Quarry", address: "BC", notes: "Ice Cave entrance (day/night exterior)" },
  { name: "Stage 49 Production Office", address: "2820 Underhill Ave, Burnaby, BC", notes: "Production office, costume office" },
  { name: "Willie Trailer Blocking Location", address: "9998 208th Street, Langley, BC", notes: "Blocking rehearsal location (prep)" },
];

const locRows = LOCATIONS.map(l => ({ show_id: SHOW_ID, name: l.name, address: l.address, notes: l.notes }));
const { error: locErr } = await insert("locations", locRows);
if (locErr) errors.push("locations: " + locErr.message);
else results.locations = locRows.length;

// 6. Crew contacts
const CREW = [
  { name: "Dawn Harmon", dept: "Cast", pos: "Cast #1 — Sp. Agent Dawn Harmon" },
  { name: "Vir Joshi", dept: "Cast", pos: "Cast #2 — Sp. Agent Vir Joshi" },
  { name: "Dana Scully", dept: "Cast", pos: "Cast #3 — Dep. Director Dana Scully" },
  { name: "Sandra Bill", dept: "Cast", pos: "Cast #4 — Dep. Director Sandra Bill" },
  { name: "Salkow Sloane", dept: "Cast", pos: "Cast #5k — Salkow Sloane (kid)" },
  { name: "Willie Sloane", dept: "Cast", pos: "Cast #6 — Willie Sloane" },
  { name: "Kodiak", dept: "Cast", pos: "Cast #7 — Kodiak" },
  { name: "Sheriff Moseley", dept: "Cast", pos: "Cast #8 — Sheriff Moseley" },
  { name: "Officer Jenn Tapash", dept: "Cast", pos: "Cast #9 — Officer Jenn Tapash" },
  { name: "Wildlife Jim", dept: "Cast", pos: "Cast #10 — Wildlife Jim" },
  { name: "Latit Sloane", dept: "Cast", pos: "Cast #11 — Latit Sloane" },
  { name: "Lars Wilcox", dept: "Cast", pos: "Cast #12 — Lars Wilcox" },
  { name: "Julie", dept: "Cast", pos: "Cast #13 — Julie" },
  { name: "Papsaki", dept: "Cast", pos: "Cast #14k — Papsaki (kid)" },
  { name: "Dr. Catalina Andal", dept: "Cast", pos: "Cast #15 — Dr. Catalina Andal" },
  { name: "Ryan Coogler", dept: "Directing", pos: "Director" },
  { name: "Marvin Williams", dept: "AD", pos: "1st Assistant Director" },
  { name: "Jenn Y.", dept: "Producing", pos: "Executive Producer" },
  { name: "Will W.", dept: "Producing", pos: "Line Producer" },
  { name: "Simone H.", dept: "Producing", pos: "Co-Executive Producer" },
  { name: "Hans D.", dept: "Production", pos: "Production Manager" },
  { name: "Autumn A.", dept: "Camera", pos: "Director of Photography" },
  { name: "Hannah B.", dept: "Art", pos: "Production Designer" },
  { name: "Nicole S.", dept: "Art", pos: "Art Director" },
  { name: "Troy S.", dept: "Grip", pos: "Key Grip" },
  { name: "Brian B.", dept: "Electric", pos: "Chief Lighting Technician" },
  { name: "Dean G.", dept: "Props", pos: "Prop Master" },
  { name: "James P.", dept: "SPFX", pos: "SPFX Supervisor" },
  { name: "Andy G.", dept: "Stunts", pos: "Stunt Coordinator" },
  { name: "Melissa S.", dept: "Stunts", pos: "Stunt Coordinator" },
  { name: "Jessica C.", dept: "Script", pos: "Script Supervisor" },
  { name: "Michael R.", dept: "VFX", pos: "VFX Supervisor" },
  { name: "Chad Belair", dept: "AD", pos: "Key 2nd AD", phone: "+1 778-883-7702", email: "chadrobertbelair@gmail.com" },
  { name: "Beth M.", dept: "Cast", pos: "Dialect Coach" },
  { name: "Dezi G.", dept: "Consulting", pos: "Proximity / Cultural Consultant" },
  { name: "Mo G.", dept: "Makeup", pos: "SPFX Makeup" },
  { name: "Tom K.", dept: "Transport", pos: "Picture Cars" },
  { name: "Rob F.", dept: "Props", pos: "Armourer" },
  { name: "Gregory Summers", dept: "Safety", pos: "First Aid", phone: "778-241-4734" },
];

const crewRows = CREW.map(c => ({
  show_id: SHOW_ID,
  name: c.name,
  department: c.dept,
  position: c.pos,
  phone: c.phone || null,
  email: c.email || null,
  imported_by_sub: "soup-import@syncoffset.local",
}));

const { error: crewErr } = await insert("crew_contacts", crewRows);
if (crewErr) errors.push("crew_contacts: " + crewErr.message);
else results.crew_contacts = crewRows.length;

// 7. Prep tasks
const TASKS = [
  { title: "Director Blocking Rehearsal — Willie Trailer", due: "2026-05-08T08:00:00", assignee: "Ryan C. (Dir)", notes: "0800–1200 · 9998 208th Street, Langley", status: "done", priority: "high" },
  { title: "Salkow Photo Double H&MU Test", due: "2026-05-08T08:30:00", assignee: "Hair & Makeup", notes: "0830–1000 · H&MU Trailer", status: "done", priority: "normal" },
  { title: "Internal Costume Meeting (Zoom)", due: "2026-05-08T09:00:00", assignee: "Costume", notes: "0900–1000 · Via Zoom", status: "done", priority: "normal" },
  { title: "Cast #8 Sheriff Moseley H&MU Test", due: "2026-05-08T09:00:00", assignee: "Hair & Makeup", notes: "0900–1000 · H&MU Trailer", status: "done", priority: "normal" },
  { title: "Cast #8 Dialect Coaching", due: "2026-05-08T10:00:00", assignee: "Beth M.", notes: "1000–1100 · Production Office", status: "done", priority: "normal" },
  { title: "Cast #2 Joshi H&MU Test Part 1", due: "2026-05-08T10:00:00", assignee: "Hair & Makeup", notes: "1000–1215 · H&MU Trailer", status: "done", priority: "normal" },
  { title: "Cast #1 Harmon H&MU Test", due: "2026-05-08T12:00:00", assignee: "Hair & Makeup", notes: "1200–1500 · H&MU Trailer", status: "done", priority: "normal" },
  { title: "Dialect / Joshi / Proximity & Yakama Call", due: "2026-05-08T12:15:00", assignee: "Dezi G., Beth M.", notes: "1215–1300 · Office & Zoom", status: "done", priority: "normal" },
  { title: "Studio Budget Meeting (Zoom)", due: "2026-05-08T13:00:00", assignee: "Ryan C., Jenn Y., Will W.", notes: "1300–1400 · Zoom", status: "done", priority: "high" },
  { title: "JHSC Safety Meeting", due: "2026-05-08T14:30:00", assignee: "Will W., Hans D.", notes: "1430–1500 · Boardroom", status: "done", priority: "normal" },
  { title: "Cast #9 Tapash Dialect Coaching", due: "2026-05-08T14:30:00", assignee: "Beth M.", notes: "1430–1600 · Via Zoom", status: "done", priority: "normal" },
  { title: "Cast #7 Kodiak Gun Training", due: "2026-05-08T14:45:00", assignee: "PJ (Stunts)", notes: "1445–1615 · PO Stunt Lockup", status: "done", priority: "high" },
  { title: "Plane Buck Logistics Meeting", due: "2026-05-08T15:00:00", assignee: "Ryan C., DOP, PD, 1st AD", notes: "1500–1530 · Boardroom", status: "done", priority: "high" },
  { title: "Day 1 Director/Cast Rehearsal — Joshi Hospital", due: "2026-05-08T16:00:00", assignee: "Ryan C.", notes: "1600–1900 · Riverview", status: "done", priority: "high" },
  { title: "Cast #5k Salkow Dialect Coaching", due: "2026-05-08T16:00:00", assignee: "Beth M.", notes: "1600–1730 · Via Zoom", status: "done", priority: "normal" },
  { title: "Cast #14k Dialect Coaching (Zoom)", due: "2026-05-08T18:00:00", assignee: "Beth M.", notes: "1800–1900 · Via Zoom", status: "done", priority: "normal" },
  { title: "Canadian Casting Session", due: "2026-05-08T19:30:00", assignee: "Ryan C., Corrine C.", notes: "1930 · PO & Zoom", status: "done", priority: "normal" },
  { title: "Owl Trainer Meeting", due: "2026-05-08T12:00:00", assignee: "Ryan C., Jenn Y., Will W.", notes: "TBC · Boardroom & Zoom", status: "done", priority: "normal" },
  { title: "Transport — Pick up Cast #7 from hotel", due: "2026-05-08T08:30:00", assignee: "Transport", notes: "To Blocking Rehearsal Location", status: "done", priority: "normal" },
  { title: "Transport — Pick up Cast #2 from hotel", due: "2026-05-08T09:25:00", assignee: "Transport", notes: "To H&MU Trailer", status: "done", priority: "normal" },
  { title: "Transport — Pick up Cast #1 from hotel", due: "2026-05-08T11:25:00", assignee: "Transport", notes: "To H&MU Trailer", status: "done", priority: "normal" },
  { title: "Transport — Cast #1 & #2 to Riverview", due: "2026-05-08T15:30:00", assignee: "Transport", notes: "For Day 1 rehearsal", status: "done", priority: "normal" },
  { title: "Transport — Cast #7 to YVR", due: "2026-05-08T16:20:00", assignee: "Transport", notes: "Depart YVR 1920", status: "done", priority: "normal" },
  { title: "Creature Full Fitting — MFP LA", due: "2026-05-11T14:00:00", assignee: "Mo G. (SPFX MU)", notes: "1400–1800 · Day 1", status: "open", priority: "high" },
  { title: "Cast #13 Julie — Travel YEG to YVR", due: "2026-05-11T12:00:00", assignee: "Transport", notes: "Arrive TBD", status: "open", priority: "normal" },
];

const taskRows = TASKS.map(t => ({
  show_id: SHOW_ID,
  title: t.title,
  notes: t.notes,
  status: t.status,
  priority: t.priority,
  due_at: t.due,
  assignee_name: t.assignee,
}));

const { error: taskErr } = await insert("production_tasks", taskRows);
if (taskErr) errors.push("production_tasks: " + taskErr.message);
else results.production_tasks = taskRows.length;

// Report
console.log("=== IMPORT RESULTS ===");
console.log(JSON.stringify(results, null, 2));
if (errors.length > 0) {
  console.log("=== ERRORS ===");
  errors.forEach(e => console.log("  " + e));
}
const total = Object.values(results).reduce((a, b) => a + b, 0);
console.log(`\n=== TOTAL: ${total} records across ${Object.keys(results).length} tables ===`);
