"use server";

import { revalidatePath } from "next/cache";

import { getDefaultProductionId } from "@/lib/ingestion/production";
import { createServiceClient } from "@/lib/supabase/server";

import { randomUUID } from "node:crypto";

// ──────────────────────────────────────────────────────────
// Alphabet Soup — Structured import from 4 production PDFs
// ──────────────────────────────────────────────────────────

type ImportResult = {
  ok: boolean;
  tables: Record<string, number>;
  errors: string[];
};

// ── SHOOT DAYS (from One-Liner) ──────────────────────────

const SHOOT_DAYS = [
  {
    day: 1,
    date: "2026-05-11",
    location: "Riverview East",
    title: "INT. Joshi's Hospital Room",
    scenes: ["2", "38pt"],
    dayType: "INT",
    dayNight: "D3",
    unit: "Main",
  },
  {
    day: 2,
    date: "2026-05-12",
    location: "Sts'ailes Nation",
    title: "EXT/INT. Rising Road Girls Home",
    scenes: ["20pt.1", "22", "21", "A22pt"],
    dayType: "EXT",
    dayNight: "D2",
    unit: "Main",
  },
  {
    day: 3,
    date: "2026-05-13",
    location: "Sts'ailes Nation",
    title: "INT/EXT. Rising Road · Yakama Reservation",
    scenes: ["A22pt", "20pt.2", "19"],
    dayType: "INT/EXT",
    dayNight: "D2",
    unit: "Main",
  },
  {
    day: 4,
    date: "2026-05-14",
    location: "Skagit Motel, Hope BC",
    title: "EXT. Blue Rose Motel (Split Day/Night)",
    scenes: ["33", "34pt", "TBD", "31pt", "25pt"],
    dayType: "I/E",
    dayNight: "D3/N2",
    unit: "Main",
  },
  {
    day: 5,
    date: "2026-05-15",
    location: "Riverview North",
    title: "INT. Autopsy Room · Morgue",
    scenes: ["23pt", "51pt"],
    dayType: "INT",
    dayNight: "N2",
    unit: "Main",
  },
  {
    day: 6,
    date: "2026-05-19",
    location: "Minaty Bay, Britannia Beach",
    title: "EXT. Lake · Lars' Homestead",
    scenes: ["34pt", "35pt"],
    dayType: "EXT",
    dayNight: "D3",
    unit: "Main",
  },
  {
    day: 7,
    date: "2026-05-20",
    location: "Minaty Bay, Britannia Beach",
    title: "EXT. Lake · Joshi's LSD Trip",
    scenes: ["35pt"],
    dayType: "EXT",
    dayNight: "D3",
    unit: "Main",
  },
  {
    day: 8,
    date: "2026-05-21",
    location: "Mammoth Studios",
    title: "INT. Willie's Trailer · FBI Plane · Crime Scene",
    scenes: ["2pt", "25pt", "10", "13", "B14"],
    dayType: "INT",
    dayNight: "N1/D2",
    unit: "Main",
  },
  {
    day: 9,
    date: "2026-05-22",
    location: "Blieberger Farm",
    title: "EXT. Woods Near Willie's Trailer",
    scenes: ["15", "17", "18"],
    dayType: "EXT",
    dayNight: "D2",
    unit: "Main",
  },
  {
    day: 10,
    date: "2026-05-25",
    location: "Blieberger Farm",
    title: "EXT. Crime Scene · Willie's Trailer",
    scenes: ["12", "A14", "C14"],
    dayType: "EXT",
    dayNight: "D2",
    unit: "Main",
  },
  {
    day: 11,
    date: "2026-05-27",
    location: "Blieberger Farm",
    title: "EXT. Willie's Trailer · Night Shootout",
    scenes: ["1", "2pt", "3pt"],
    dayType: "EXT",
    dayNight: "N1",
    unit: "Main",
  },
  {
    day: 12,
    date: "2026-05-28",
    location: "Blieberger Farm",
    title: "EXT. Willie's Trailer · Shootout Continuation",
    scenes: ["3pt"],
    dayType: "EXT",
    dayNight: "N1",
    unit: "Main",
  },
  {
    day: 13,
    date: "2026-05-29",
    location: "Blieberger Farm",
    title: "EXT. Woods · Masked Gunman Chase",
    scenes: ["3pt"],
    dayType: "EXT",
    dayNight: "N1",
    unit: "Main",
  },
  {
    day: 14,
    date: "2026-06-01",
    location: "Riverview East",
    title: "INT. FBI HQ Hallway · Bill's Office",
    scenes: ["4", "6", "A46", "5", "7", "46", "47pt", "A49pt", "B49pt"],
    dayType: "INT",
    dayNight: "D2/D4",
    unit: "Main",
  },
  {
    day: 15,
    date: "2026-06-02",
    location: "Riverview ISB",
    title: "INT. FBI Basement · X-Files Division Office · Elevator",
    scenes: ["47", "A49", "48", "B49", "49", "50"],
    dayType: "INT",
    dayNight: "D4/N4",
    unit: "Main",
  },
  {
    day: 16,
    date: "2026-06-03",
    location: "Riverview Penn Hall",
    title: "EXT. Morgue Parking Lot",
    scenes: ["24"],
    dayType: "EXT",
    dayNight: "N2",
    unit: "Main",
  },
  {
    day: 17,
    date: "2026-06-04",
    location: "Dunbar House / Pendrell Suites",
    title: "INT. Harmon & Joshi Homes · Day for Night",
    scenes: ["51pt", "52", "55", "53pt", "54", "53pt"],
    dayType: "INT",
    dayNight: "N4",
    unit: "Main",
  },
  {
    day: 18,
    date: "2026-06-05",
    location: "Golden Eagle Quarry",
    title: "EXT. Ice Cave Entrance (Split Day/Night)",
    scenes: ["45", "42", "40"],
    dayType: "EXT",
    dayNight: "D4/N3",
    unit: "Main",
  },
  {
    day: 19,
    date: "2026-06-08",
    location: "Mammoth Studios",
    title: "INT. Ice Cave",
    scenes: ["41pt"],
    dayType: "INT",
    dayNight: "N3",
    unit: "Main",
  },
  {
    day: 20,
    date: "2026-06-09",
    location: "Mammoth Studios",
    title: "INT. Ice Cave · LSD Lab · Tunnel",
    scenes: ["A42pt", "B42"],
    dayType: "INT",
    dayNight: "N3",
    unit: "Main",
  },
  {
    day: 21,
    date: "2026-06-10",
    location: "Mammoth Studios",
    title: "INT. Ice Cave · Owl Nest · VFX Elements",
    scenes: ["C42pt"],
    dayType: "INT",
    dayNight: "N3",
    unit: "Main",
  },
];

// ── LOCATIONS (deduplicated from One-Liner + Calendar) ───

const LOCATIONS = [
  {
    name: "Riverview East Lawn",
    address: "Riverview Hospital, Coquitlam, BC",
    notes: "FBI HQ Hallway, Joshi's Hospital Room, Bill's Office",
  },
  { name: "Riverview North Lawn", address: "Riverview Hospital, Coquitlam, BC", notes: "Autopsy Room / Morgue" },
  {
    name: "Riverview ISB",
    address: "Riverview Hospital, Coquitlam, BC",
    notes: "FBI Basement, X-Files Division Office, Elevator, Evidence Room",
  },
  {
    name: "Riverview Penn Hall",
    address: "Riverview Hospital, Coquitlam, BC",
    notes: "Morgue Parking Lot (night exterior)",
  },
  {
    name: "Sts'ailes Nation",
    address: "Sts'ailes Nation, Chehalis, BC",
    notes: "Rising Road Girls Home (interior/exterior), Yakama Reservation",
  },
  {
    name: "Skagit Motel",
    address: "Hope, BC",
    notes: "Blue Rose Motel (day/night), Harmon's Motel Room, establishing shots",
  },
  { name: "Minaty Bay", address: "Britannia Beach, BC", notes: "Lars' Lake / Homestead, Joshi's LSD Trip" },
  { name: "Mammoth Studios", address: "Burnaby, BC", notes: "Willie's Trailer, FBI Plane cabin, Ice Cave (stages)" },
  {
    name: "Blieberger Farm",
    address: "Fraser Valley, BC",
    notes: "Willie's Trailer exterior/crime scene, woods, night shootout",
  },
  { name: "Dunbar House", address: "Vancouver, BC", notes: "Harmon's D.C. Home (bedroom, attic, living room)" },
  { name: "Pendrell Suites", address: "Vancouver, BC", notes: "Joshi's D.C. Apartment (kitchen, front door)" },
  { name: "Golden Eagle Quarry", address: "BC", notes: "Ice Cave entrance (day/night exterior)" },
  {
    name: "Stage 49 Production Office",
    address: "2820 Underhill Ave, Burnaby, BC V5A 3C5",
    notes: "Production office, costume office, H&MU trailer, boardroom",
  },
  {
    name: "Willie's Trailer Director Blocking",
    address: "9998 208th Street, Langley, BC",
    notes: "Blocking rehearsal location (prep)",
  },
];

// ── CAST & KEY CREW (from One-Liner cast page + Prep Schedule) ───

const CREW_CONTACTS = [
  { name: "Dawn Harmon", department: "Cast", position: "Cast #1 — Sp. Agent Dawn Harmon", phone: null, email: null },
  { name: "Vir Joshi", department: "Cast", position: "Cast #2 — Sp. Agent Vir Joshi", phone: null, email: null },
  {
    name: "Dana Scully",
    department: "Cast",
    position: "Cast #3 — Dep. Director Dana Scully",
    phone: null,
    email: null,
  },
  {
    name: "Sandra Bill",
    department: "Cast",
    position: "Cast #4 — Dep. Director Sandra Bill",
    phone: null,
    email: null,
  },
  { name: "Salkow Sloane", department: "Cast", position: "Cast #5k — Salkow Sloane (kid)", phone: null, email: null },
  { name: "Willie Sloane", department: "Cast", position: "Cast #6 — Willie Sloane", phone: null, email: null },
  { name: "Kodiak", department: "Cast", position: "Cast #7 — Kodiak", phone: null, email: null },
  { name: "Sheriff Moseley", department: "Cast", position: "Cast #8 — Sheriff Moseley", phone: null, email: null },
  {
    name: "Officer Jenn Tapash",
    department: "Cast",
    position: "Cast #9 — Officer Jenn Tapash",
    phone: null,
    email: null,
  },
  { name: "Wildlife Jim", department: "Cast", position: "Cast #10 — Wildlife Jim", phone: null, email: null },
  { name: "Latit Sloane", department: "Cast", position: "Cast #11 — Latit Sloane", phone: null, email: null },
  { name: "Lars Wilcox", department: "Cast", position: "Cast #12 — Lars Wilcox", phone: null, email: null },
  { name: "Julie", department: "Cast", position: "Cast #13 — Julie", phone: null, email: null },
  { name: "Papsaki", department: "Cast", position: "Cast #14k — Papsaki (kid)", phone: null, email: null },
  {
    name: "Dr. Catalina Andal",
    department: "Cast",
    position: "Cast #15 — Dr. Catalina Andal",
    phone: null,
    email: null,
  },
  { name: "Ryan Coogler", department: "Directing", position: "Director", phone: null, email: null },
  { name: "Marvin Williams", department: "AD", position: "1st Assistant Director", phone: null, email: null },
  { name: "Jenn Y.", department: "Producing", position: "Executive Producer", phone: null, email: null },
  { name: "Will W.", department: "Producing", position: "Line Producer", phone: null, email: null },
  { name: "Simone H.", department: "Producing", position: "Co-Executive Producer", phone: null, email: null },
  { name: "Hans D.", department: "Production", position: "Production Manager", phone: null, email: null },
  { name: "Autumn A.", department: "Camera", position: "Director of Photography", phone: null, email: null },
  { name: "Hannah B.", department: "Art", position: "Production Designer", phone: null, email: null },
  { name: "Nicole S.", department: "Art", position: "Art Director", phone: null, email: null },
  { name: "Troy S.", department: "Grip", position: "Key Grip", phone: null, email: null },
  { name: "Brian B.", department: "Electric", position: "Chief Lighting Technician", phone: null, email: null },
  { name: "Dean G.", department: "Props", position: "Prop Master", phone: null, email: null },
  { name: "James P.", department: "SPFX", position: "SPFX Supervisor", phone: null, email: null },
  { name: "Andy G.", department: "Stunts", position: "Stunt Coordinator", phone: null, email: null },
  { name: "Melissa S.", department: "Stunts", position: "Stunt Coordinator", phone: null, email: null },
  { name: "Jessica C.", department: "Script", position: "Script Supervisor", phone: null, email: null },
  { name: "Michael R.", department: "VFX", position: "VFX Supervisor", phone: null, email: null },
  {
    name: "Chad Belair",
    department: "AD",
    position: "Key 2nd AD",
    phone: "+1 778-883-7702",
    email: "chadrobertbelair@gmail.com",
  },
  { name: "Beth M.", department: "Cast", position: "Dialect Coach", phone: null, email: null },
  { name: "Dezi G.", department: "Consulting", position: "Proximity / Cultural Consultant", phone: null, email: null },
  { name: "Mo G.", department: "Makeup", position: "SPFX Makeup", phone: null, email: null },
  { name: "Tom K.", department: "Transport", position: "Picture Cars", phone: null, email: null },
  { name: "Rob F.", department: "Props", position: "Armourer", phone: null, email: null },
  { name: "Gregory Summers", department: "Safety", position: "First Aid", phone: "778-241-4734", email: null },
];

// ── PREP TASKS (from Prep Schedule — May 8, 2026) ────────

const PREP_TASKS = [
  {
    title: "Director Blocking Rehearsal — Willie's Trailer",
    due: "2026-05-08T08:00:00",
    assignee: "Ryan C. (Dir)",
    notes: "0800–1200 · 9998 208th Street, Langley · Rubber prop guns on set",
    status: "done",
    priority: "high",
  },
  {
    title: "Salkow Photo Double H&MU Test",
    due: "2026-05-08T08:30:00",
    assignee: "Hair & Makeup",
    notes: "0830–1000 · H&MU Trailer",
    status: "done",
    priority: "normal",
  },
  {
    title: "Internal Costume Meeting (Zoom)",
    due: "2026-05-08T09:00:00",
    assignee: "Costume",
    notes: "0900–1000 · Via Zoom",
    status: "done",
    priority: "normal",
  },
  {
    title: "Cast #8 Sheriff Moseley H&MU Test",
    due: "2026-05-08T09:00:00",
    assignee: "Hair & Makeup",
    notes: "0900–1000 · H&MU Trailer",
    status: "done",
    priority: "normal",
  },
  {
    title: "Cast #8 Dialect Coaching",
    due: "2026-05-08T10:00:00",
    assignee: "Beth M. (Dialect Coach)",
    notes: "1000–1100 · Production Office",
    status: "done",
    priority: "normal",
  },
  {
    title: "Cast #2 Joshi H&MU Test Part 1",
    due: "2026-05-08T10:00:00",
    assignee: "Hair & Makeup",
    notes: "1000–1215 · H&MU Trailer",
    status: "done",
    priority: "normal",
  },
  {
    title: "Cast #1 Harmon H&MU Test",
    due: "2026-05-08T12:00:00",
    assignee: "Hair & Makeup",
    notes: "1200–1500 · H&MU Trailer",
    status: "done",
    priority: "normal",
  },
  {
    title: "Dialect / Joshi / Proximity & Yakama Call",
    due: "2026-05-08T12:15:00",
    assignee: "Dezi G., Beth M.",
    notes: "1215–1300 · Office & Zoom",
    status: "done",
    priority: "normal",
  },
  {
    title: "Studio Budget Meeting (Zoom)",
    due: "2026-05-08T13:00:00",
    assignee: "Ryan C., Jenn Y., Will W.",
    notes: "1300–1400 · Zoom · Studio execs",
    status: "done",
    priority: "high",
  },
  {
    title: "JHSC Safety Meeting",
    due: "2026-05-08T14:30:00",
    assignee: "Will W., Hans D., Safety",
    notes: "1430–1500 · Boardroom",
    status: "done",
    priority: "normal",
  },
  {
    title: "Cast #9 Tapash Dialect Coaching (Zoom)",
    due: "2026-05-08T14:30:00",
    assignee: "Beth M. (Dialect Coach)",
    notes: "1430–1600 · Via Zoom",
    status: "done",
    priority: "normal",
  },
  {
    title: "Cast #7 Kodiak Gun Training",
    due: "2026-05-08T14:45:00",
    assignee: "PJ (Stunts)",
    notes: "1445–1615 · PO Stunt Lockup",
    status: "done",
    priority: "high",
  },
  {
    title: "Plane Buck Logistics Meeting",
    due: "2026-05-08T15:00:00",
    assignee: "Ryan C., DOP, PD, 1st AD, LM",
    notes: "1500–1530 · Boardroom & Zoom",
    status: "done",
    priority: "high",
  },
  {
    title: "Day 1 Director/Cast Rehearsal — Joshi's Hospital Room",
    due: "2026-05-08T16:00:00",
    assignee: "Ryan C. (Dir)",
    notes: "1600–1900 · Riverview · Cast: Harmon, Joshi & ER Doctor",
    status: "done",
    priority: "high",
  },
  {
    title: "Cast #5k Salkow Dialect Coaching (Zoom)",
    due: "2026-05-08T16:00:00",
    assignee: "Beth M. (Dialect Coach)",
    notes: "1600–1730 · Via Zoom",
    status: "done",
    priority: "normal",
  },
  {
    title: "Cast #14k Dialect Coaching (Zoom)",
    due: "2026-05-08T18:00:00",
    assignee: "Beth M. (Dialect Coach)",
    notes: "1800–1900 · Via Zoom",
    status: "done",
    priority: "normal",
  },
  {
    title: "Canadian Casting Session",
    due: "2026-05-08T19:30:00",
    assignee: "Ryan C., Corrine C.",
    notes: "1930 · PO & Zoom",
    status: "done",
    priority: "normal",
  },
  {
    title: "Owl Trainer Meeting",
    due: "2026-05-08T12:00:00",
    assignee: "Ryan C., Jenn Y., Will W.",
    notes: "TBC · Boardroom & Zoom",
    status: "done",
    priority: "normal",
  },
  {
    title: "Transport — Pick up Cast #7 Kodiak from hotel",
    due: "2026-05-08T08:30:00",
    assignee: "Transport",
    notes: "To Blocking Rehearsal Location",
    status: "done",
    priority: "normal",
  },
  {
    title: "Transport — Pick up Cast #2 Joshi from hotel",
    due: "2026-05-08T09:25:00",
    assignee: "Transport",
    notes: "To H&MU Trailer",
    status: "done",
    priority: "normal",
  },
  {
    title: "Transport — Pick up Cast #1 Harmon from hotel",
    due: "2026-05-08T11:25:00",
    assignee: "Transport",
    notes: "To H&MU Trailer",
    status: "done",
    priority: "normal",
  },
  {
    title: "Transport — Cast #1 & #2 Office to Riverview",
    due: "2026-05-08T15:30:00",
    assignee: "Transport",
    notes: "For Day 1 rehearsal",
    status: "done",
    priority: "normal",
  },
  {
    title: "Transport — Cast #7 Kodiak to YVR",
    due: "2026-05-08T16:20:00",
    assignee: "Transport",
    notes: "Depart YVR 1920 · Travels out of Vancouver",
    status: "done",
    priority: "normal",
  },
  {
    title: "Creature Full Fitting — MFP LA",
    due: "2026-05-11T14:00:00",
    assignee: "Mo G. (SPFX MU)",
    notes: "1400–1800 · Day 1 · Mike F., Dane D. (Owl Performer)",
    status: "open",
    priority: "high",
  },
  {
    title: "Cast #13 Julie — Travel YEG to YVR",
    due: "2026-05-11T12:00:00",
    assignee: "Transport",
    notes: "Arrive TBD",
    status: "open",
    priority: "normal",
  },
];

// ── SHOW METADATA ────────────────────────────────────────

const SHOW_UPDATE = {
  name: "Alphabet Soup",
  code: "SOUP",
  location: "Vancouver, BC",
  production_company: "Stage 49 Ltd.",
  production_type: "scripted_television",
  prep_start_date: "2026-04-14",
  principal_photography_start_date: "2026-05-11",
  wrap_date: "2026-06-10",
  estimated_shoot_days: 21,
};

// ── MAIN IMPORT ACTION ──────────────────────────────────

export async function importSoupProductionData(): Promise<ImportResult> {
  const errors: string[] = [];
  const tables: Record<string, number> = {};
  const showId = await getDefaultProductionId();
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // 1. Update shows metadata
  const { error: showErr } = await supabase.from("shows").update(SHOW_UPDATE).eq("id", showId);
  if (showErr) errors.push(`shows: ${showErr.message}`);
  else tables.shows = 1;

  // 2. Schedule revision + days
  const revisionId = randomUUID();
  const { error: revErr } = await supabase.from("production_schedule_revisions").insert({
    id: revisionId,
    show_id: showId,
    revision_name: "Official White One-Line · 21 shoot days · May 11 – Jun 10, 2026",
    revision_source: "csv",
    revision_scope: "published",
    imported_by: "soup-import@syncoffset.local",
    imported_at: now,
    source_fingerprint: "soup-oneliner-white-05102026",
    import_merge_kind: "replaced",
    notes: "Imported from SOUP_ONE LINE_WHITE_05.10.26.pdf · Based on Full Pink Draft 05/09/26",
  });
  if (revErr) {
    errors.push(`production_schedule_revisions: ${revErr.message}`);
  } else {
    tables.production_schedule_revisions = 1;

    // Demote any prior published revisions
    await supabase
      .from("production_schedule_revisions")
      .update({ revision_scope: "shared_draft" })
      .eq("show_id", showId)
      .eq("revision_scope", "published")
      .neq("id", revisionId);

    // Re-set our revision as published (in case the above caught it)
    await supabase.from("production_schedule_revisions").update({ revision_scope: "published" }).eq("id", revisionId);

    const dayRows = SHOOT_DAYS.map((d, idx) => ({
      revision_id: revisionId,
      show_id: showId,
      strip_position: idx,
      shoot_day: `${d.date}T07:00:00`,
      day_type: d.dayType,
      title: `${d.location} · ${d.title}`,
      notes: `D/N: ${d.dayNight} · Unit: ${d.unit} · Scenes: ${d.scenes.join(", ")}`,
      imported_at: now,
      created_by: "soup-import@syncoffset.local",
    }));

    const { error: daysErr } = await supabase.from("production_schedule_days").insert(dayRows);
    if (daysErr) errors.push(`production_schedule_days: ${daysErr.message}`);
    else tables.production_schedule_days = dayRows.length;
  }

  // 3. Locations
  const locationRows = LOCATIONS.map((loc) => ({
    show_id: showId,
    name: loc.name,
    address: loc.address,
    notes: loc.notes,
  }));

  const { error: locErr } = await supabase.from("locations").insert(locationRows);
  if (locErr) errors.push(`locations: ${locErr.message}`);
  else tables.locations = locationRows.length;

  // 4. Crew contacts
  const crewRows = CREW_CONTACTS.map((c) => ({
    show_id: showId,
    name: c.name,
    department: c.department,
    position: c.position,
    phone: c.phone,
    email: c.email,
    imported_by_sub: "soup-import@syncoffset.local",
  }));

  const { error: crewErr } = await supabase.from("crew_contacts").insert(crewRows);
  if (crewErr) errors.push(`crew_contacts: ${crewErr.message}`);
  else tables.crew_contacts = crewRows.length;

  // 5. Production tasks (from prep schedule)
  const taskRows = PREP_TASKS.map((t) => ({
    show_id: showId,
    title: t.title,
    notes: t.notes,
    status: t.status,
    priority: t.priority,
    due_at: t.due,
    assignee_name: t.assignee,
  }));

  const { error: taskErr } = await supabase.from("production_tasks").insert(taskRows);
  if (taskErr) errors.push(`production_tasks: ${taskErr.message}`);
  else tables.production_tasks = taskRows.length;

  // Revalidate all affected pages
  revalidatePath("/dashboard/production-calendar");
  revalidatePath("/dashboard/shooting-schedule");
  revalidatePath("/dashboard/locations");
  revalidatePath("/dashboard/crew");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/cast-lists");

  return {
    ok: errors.length === 0,
    tables,
    errors,
  };
}
