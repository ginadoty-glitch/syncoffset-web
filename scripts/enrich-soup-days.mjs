/**
 * Alphabet Soup — full scheduling intelligence import (Shadow JSON v2).
 * Source: SOUP_ONE LINE_WHITE_05.10.26.pdf + SOUP_PROD CALENDAR_WHITE_05.10.26.pdf
 *
 * Preserves per the parser doctrine:
 * - Multiple setups per day with per-setup INT/EXT, D/N, D-number, scenes
 * - Total pages per day
 * - Split shoot day flags
 * - Work periods (DAY WORK / NIGHT WORK)
 * - Company moves + destination
 * - Pre-light notes
 * - VFX element shoots
 * - Omitted scenes
 * - Production events (rehearsals, meetings)
 * - Milestones (BEGIN/END PRINC. PHOTOG.)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SHOW_ID = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;

if (!SUPABASE_URL || !SUPABASE_KEY || !SHOW_ID) {
  console.error("Missing env vars. Source .env.local first.");
  process.exit(1);
}

const REST = `${SUPABASE_URL}/rest/v1`;
const H = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};
const H_READ = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

function v2(obj) {
  return "SYNCO_SHADOW_JSON:v2:" + JSON.stringify({ v: 2, ...obj });
}

const DAYS = [
  // ── DAY 1 · Mon May 11 · Riverview East ──
  {
    pos: 0, date: "2026-05-11", dayType: "shoot", title: "Riverview East",
    notes: v2({
      setups: [
        { setName: "JOSHI'S HOSPITAL ROOM", intExt: "INT", dayNight: "D", dNumber: "D3", scenes: ["2", "38pt"], sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [{ label: "BEGIN PRINC. PHOTOG.", markerType: "milestone" }],
      events: [], zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "5 4/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 2 · Tue May 12 · Sts'ailes Nation ──
  {
    pos: 1, date: "2026-05-12", dayType: "shoot", title: "Sts'ailes Nation",
    notes: v2({
      setups: [
        { setName: "RISING ROAD GIRLS HOME", subSets: ["DRIVEWAY"], intExt: "EXT", dayNight: "D", dNumber: "D2", scenes: ["20pt.1"], sortOrder: 0 },
        { setName: "RISING ROAD GIRLS HOME", subSets: ["DRIVEWAY"], intExt: "EXT", dayNight: "D", dNumber: "D2", scenes: ["22"], sortOrder: 1 },
        { setName: "RISING ROAD GIRLS HOME", subSets: ["ENTRY"], intExt: "INT", dayNight: "D", dNumber: "D2", scenes: ["21"], cameraNote: "CAMERA MOVES INSIDE", sortOrder: 2 },
        { setName: "RISING ROAD GIRLS HOME", subSets: ["KITCHEN"], intExt: "INT", dayNight: "D", dNumber: "D2", scenes: ["A22pt"], cameraNote: "CAMERA MOVES TO KITCHEN", sortOrder: 3 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "east",
      companyMove: false, companyMoveDestination: null,
      totalPages: "3 7/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 3 · Wed May 13 · Sts'ailes Nation ──
  {
    pos: 2, date: "2026-05-13", dayType: "shoot", title: "Sts'ailes Nation",
    notes: v2({
      setups: [
        { setName: "RISING ROAD GIRLS HOME", subSets: ["KITCHEN"], intExt: "INT", dayNight: "D", dNumber: "D2", scenes: ["A22pt"], sortOrder: 0 },
        { setName: "RISING SISTERS GIRLS HOME", intExt: "EXT", dayNight: "D", dNumber: "D2", scenes: ["20pt.2"], cameraNote: "CAMERA MOVES OUTSIDE", sortOrder: 1 },
        { setName: "YAKAMA NATION RESERVATION", subSets: ["BORDER"], intExt: "EXT", dayNight: "D", dNumber: "D2", scenes: ["19"], setupNote: "REDUCED UNIT MOVES TO CHEHALIS RD.", sortOrder: 2 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "east",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1 5/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: ["A39"],
    }),
  },
  // ── DAY 4 · Thu May 14 · Skagit Motel ──
  {
    pos: 3, date: "2026-05-14", dayType: "shoot", title: "Skagit Motel",
    notes: v2({
      setups: [
        { setName: "BLUE ROSE MOTEL", intExt: "EXT", dayNight: "D", dNumber: "D3", scenes: ["33"], sortOrder: 0 },
        { setName: "BLUE ROSE MOTEL", intExt: "EXT", dayNight: "D", dNumber: "D3", scenes: ["34pt"], setupNote: "SHOOT SHERIFF MOSELEY'S & TAPASH'S V.O.", sortOrder: 1 },
        { setName: "FRASER RIVER", intExt: "EXT", dayNight: "D", scenes: ["TBD"], setupNote: "SPLINTER CAM SHOTS · DRONE SHOTS OF YAKAMA LANDSCAPE", sortOrder: 2 },
        { setName: "HARMON'S ROOM", subSets: ["BLUE ROSE MOTEL"], intExt: "I/E", dayNight: "D", dNumber: "D3", scenes: ["31pt"], setupNote: "SHOT DUSK FOR DAWN", sortOrder: 3 },
        { setName: "BLUE ROSE MOTEL", intExt: "EXT", dayNight: "N", dNumber: "N2", scenes: ["25pt"], sortOrder: 4 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "east",
      companyMove: false, companyMoveDestination: null,
      totalPages: "5 6/8", splitDay: true,
      workPeriods: [
        { label: "DAY WORK", setupIndexes: [0, 1, 2, 3] },
        { label: "NIGHT WORK", setupIndexes: [4] },
      ],
      preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 5 · Fri May 15 · Riverview North ──
  {
    pos: 4, date: "2026-05-15", dayType: "shoot", title: "Riverview North",
    notes: v2({
      setups: [
        { setName: "AUTOPSY ROOM", subSets: ["MORGUE"], intExt: "INT", dayNight: "N", dNumber: "N2", scenes: ["23pt"], sortOrder: 0 },
        { setName: "B-SIDE PHONE CALL", intExt: "INT", dayNight: "N", scenes: ["51pt"], sortOrder: 1 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "4 2/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 6 · Tue May 20 · Minaty Bay ──
  {
    pos: 5, date: "2026-05-20", dayType: "shoot", title: "Minaty Bay",
    notes: v2({
      setups: [
        { setName: "LAKE", intExt: "EXT", dayNight: "D", dNumber: "D3", scenes: ["34pt", "35pt"], sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], zone: "north",
      events: [{ eventType: "rehearsal", title: "REHEARSE JOSHI'S LSD TRIP AT WRAP" }],
      companyMove: false, companyMoveDestination: null,
      totalPages: "4 1/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 7 · Wed May 21 · Minaty Bay ──
  {
    pos: 6, date: "2026-05-21", dayType: "shoot", title: "Minaty Bay",
    notes: v2({
      setups: [
        { setName: "LAKE", intExt: "EXT", dayNight: "D", dNumber: "D3", scenes: ["35pt"], setupNote: "JOSHI'S LSD TRIP · HARMON STAGE 1/2/3 LOOKS", sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "north",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1 1/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 8 · Thu May 22 · Mammoth Studios ──
  {
    pos: 7, date: "2026-05-22", dayType: "shoot", title: "Mammoth Studios",
    notes: v2({
      setups: [
        { setName: "WILLIE'S TRAILER", subSets: ["BEDROOM"], intExt: "INT", dayNight: "N", dNumber: "N1", scenes: ["2pt"], sortOrder: 0 },
        { setName: "BLUE ROSE MOTEL", intExt: "EXT", dayNight: "N", dNumber: "N2", scenes: ["25pt"], setupNote: "VFX ELEMENT SHOT", sortOrder: 1 },
        { setName: "CABIN", subSets: ["PASSENGER JET"], intExt: "INT", dayNight: "D", dNumber: "D2", scenes: ["10"], sortOrder: 2 },
        { setName: "WILLIE'S TRAILER", subSets: ["CRIME SCENE"], intExt: "INT", dayNight: "D", dNumber: "D2", scenes: ["13", "B14"], sortOrder: 3 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "2 3/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: ["VFX ELEMENT SHOT"],
      omittedScenes: ["D14"],
    }),
  },
  // ── DAY 9 · Fri May 23 · Blieberger Farm ──
  {
    pos: 8, date: "2026-05-23", dayType: "shoot", title: "Blieberger Farm",
    notes: v2({
      setups: [
        { setName: "WOODS NEAR WILLIE'S TRAILER", intExt: "EXT", dayNight: "D", dNumber: "D2", scenes: ["15", "17", "18"], sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "east",
      companyMove: false, companyMoveDestination: null,
      totalPages: "5 2/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: ["16"],
    }),
  },
  // ── DAY 10 · Mon May 26 · Blieberger Farm ──
  {
    pos: 9, date: "2026-05-26", dayType: "shoot", title: "Blieberger Farm",
    notes: v2({
      setups: [
        { setName: "CRIME SCENE", subSets: ["WILLIE'S TRAILER"], intExt: "EXT", dayNight: "D", dNumber: "D2", scenes: ["12", "A14", "C14"], sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "east",
      companyMove: false, companyMoveDestination: null,
      totalPages: "3 5/8", splitDay: false,
      workPeriods: [],
      preLightNotes: ["LIGHTING PRE-LIGHT AFTER CAMERA WRAP"],
      vfxElements: [], omittedScenes: ["14"],
    }),
  },
  // ── DAY 11 · Wed May 27 · Blieberger Farm ──
  {
    pos: 10, date: "2026-05-27", dayType: "shoot", title: "Blieberger Farm",
    notes: v2({
      setups: [
        { setName: "WILLIE'S TRAILER", intExt: "EXT", dayNight: "N", dNumber: "N1", scenes: ["1"], sortOrder: 0 },
        { setName: "WILLIE'S TRAILER", subSets: ["BEDROOM"], intExt: "INT", dayNight: "N", dNumber: "N1", scenes: ["2pt"], sortOrder: 1 },
        { setName: "WILLIE'S TRAILER", intExt: "EXT", dayNight: "N", dNumber: "N1", scenes: ["3pt"], sortOrder: 2 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "east",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1 3/8", splitDay: false,
      workPeriods: [],
      preLightNotes: ["PRE-LIGHT WILLIE'S TRAILER (FOR NIGHT WORK)"],
      vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 12 · Thu May 28 · Blieberger Farm ──
  {
    pos: 11, date: "2026-05-28", dayType: "shoot", title: "Blieberger Farm",
    notes: v2({
      setups: [
        { setName: "WILLIE'S TRAILER", intExt: "EXT", dayNight: "N", dNumber: "N1", scenes: ["3pt"], sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "east",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1 1/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 13 · Fri May 29 · Blieberger Farm ──
  {
    pos: 12, date: "2026-05-29", dayType: "shoot", title: "Blieberger Farm",
    notes: v2({
      setups: [
        { setName: "WOODS NEAR WILLIE'S TRAILER", intExt: "EXT", dayNight: "N", dNumber: "N1", scenes: ["3pt"], setupNote: "CLEAN UP SHOOT OUT IF NEEDED", sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [],
      events: [{ eventType: "production_meeting", title: "PRODUCTION MEETING" }],
      zone: "east",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 14 · Mon Jun 1 · Riverview East ──
  {
    pos: 13, date: "2026-06-01", dayType: "shoot", title: "Riverview East",
    notes: v2({
      setups: [
        { setName: "FBI HQ HALLWAY", intExt: "INT", dayNight: "D", dNumber: "D2", scenes: ["4", "6"], sortOrder: 0 },
        { setName: "FBI HQ HALLWAY", intExt: "INT", dayNight: "D", dNumber: "D4", scenes: ["A46"], sortOrder: 1 },
        { setName: "BILL'S OFFICE", subSets: ["FBI HQ"], intExt: "INT", dayNight: "D", dNumber: "D2", scenes: ["5", "7"], sortOrder: 2 },
        { setName: "BILL'S OFFICE", subSets: ["FBI HQ"], intExt: "INT", dayNight: "D", dNumber: "D4", scenes: ["46", "47pt", "A49pt", "B49pt"], setupNote: "SHOOT BILL'S V.O. FOR SCS. 47, 48, A49, B49", sortOrder: 3 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "5 3/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 15 · Tue Jun 2 · Riverview ISB ──
  {
    pos: 14, date: "2026-06-02", dayType: "shoot", title: "Riverview ISB",
    notes: v2({
      setups: [
        { setName: "FBI HQ BASEMENT HALLWAY", intExt: "INT", dayNight: "D", dNumber: "D4", scenes: ["47", "A49"], sortOrder: 0 },
        { setName: "X-FILES DIVISION OFFICE", subSets: ["FBI HQ"], intExt: "INT", dayNight: "D", dNumber: "D4", scenes: ["48", "B49"], sortOrder: 1 },
        { setName: "ELEVATOR", subSets: ["PENTAGON"], intExt: "INT", dayNight: "N", dNumber: "N4", scenes: ["49"], cameraNote: "PUSH TO:", sortOrder: 2 },
        { setName: "EVIDENCE ROOM", subSets: ["FBI HQ"], intExt: "INT", dayNight: "N", dNumber: "N4", scenes: ["50"], sortOrder: 3 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "3 4/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 16 · Wed Jun 3 · Riverview Penn Hall ──
  {
    pos: 15, date: "2026-06-03", dayType: "shoot", title: "Riverview Penn Hall",
    notes: v2({
      setups: [
        { setName: "MORGUE PARKING LOT", intExt: "EXT", dayNight: "N", dNumber: "N2", scenes: ["24"], sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [{ label: "TO BE CONFIRMED: HORSETHIEF TRAIL", markerType: "note" }],
      events: [], zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "3 1/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 17 · Thu Jun 4 · Dunbar House → Pendrell Suites ──
  {
    pos: 16, date: "2026-06-04", dayType: "shoot", title: "Dunbar House",
    notes: v2({
      setups: [
        { setName: "HARMON'S BEDROOM", subSets: ["HARMON'S D.C. HOME"], intExt: "INT", dayNight: "N", dNumber: "N4", scenes: ["51pt"], setupNote: "DAY FOR NIGHT", sortOrder: 0 },
        { setName: "ATTIC", subSets: ["HARMON'S D.C. HOME"], intExt: "INT", dayNight: "N", dNumber: "N4", scenes: ["52"], sortOrder: 1 },
        { setName: "LIVING ROOM", subSets: ["HARMON'S D.C. HOME"], intExt: "INT", dayNight: "N", dNumber: "N4", scenes: ["55"], sortOrder: 2 },
        { setName: "JOSHI'S KITCHEN", subSets: ["JOSHI'S D.C. APARTMENT"], intExt: "INT", dayNight: "N", dNumber: "N4", scenes: ["53pt"], sortOrder: 3 },
        { setName: "JOSHI'S KID'S HOME (NYC)", intExt: "INT", dayNight: "N", dNumber: "N4", scenes: ["53pt"], setupNote: "B SIDE", sortOrder: 4 },
        { setName: "FRONT DOOR", subSets: ["JOSHI'S D.C. APARTMENT"], intExt: "I/E", dayNight: "N", dNumber: "N4", scenes: ["54", "53pt"], sortOrder: 5 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "van",
      companyMove: true, companyMoveDestination: "Pendrell Suites",
      secondaryLocation: "Pendrell Suites",
      totalPages: "3 2/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 18 · Fri Jun 5 · Golden Eagle Quarry ──
  {
    pos: 17, date: "2026-06-05", dayType: "shoot", title: "Golden Eagle Quarry",
    notes: v2({
      setups: [
        { setName: "ICE CAVE", subSets: ["ENTRANCE"], intExt: "EXT", dayNight: "D", dNumber: "D4", scenes: ["45"], sortOrder: 0 },
        { setName: "ICE CAVE", subSets: ["ENTRANCE"], intExt: "EXT", dayNight: "N", dNumber: "N3", scenes: ["42"], sortOrder: 1 },
        { setName: "ICE CAVE", subSets: ["ENTRANCE"], intExt: "EXT", dayNight: "N", dNumber: "N3", scenes: ["40"], sortOrder: 2 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "north",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1 7/8", splitDay: true,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 19 · Mon Jun 8 · Mammoth Studios ──
  {
    pos: 18, date: "2026-06-08", dayType: "shoot", title: "Mammoth Studios",
    notes: v2({
      setups: [
        { setName: "ICE CAVE", intExt: "INT", dayNight: "N", dNumber: "N3", scenes: ["41pt"], sortOrder: 0 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1 6/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 20 · Tue Jun 9 · Mammoth Studios ──
  {
    pos: 19, date: "2026-06-09", dayType: "shoot", title: "Mammoth Studios",
    notes: v2({
      setups: [
        { setName: "LSD LAB", subSets: ["ICE CAVE"], intExt: "INT", dayNight: "N", dNumber: "N3", scenes: ["A42pt"], sortOrder: 0 },
        { setName: "TUNNEL", subSets: ["ICE CAVE"], intExt: "INT", dayNight: "N", dNumber: "N3", scenes: ["B42"], sortOrder: 1 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [], events: [], zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1 1/8", splitDay: false,
      workPeriods: [], preLightNotes: [], vfxElements: [], omittedScenes: [],
    }),
  },
  // ── DAY 21 · Wed Jun 10 · Mammoth Studios ──
  {
    pos: 20, date: "2026-06-10", dayType: "shoot", title: "Mammoth Studios",
    notes: v2({
      setups: [
        { setName: "NEST", subSets: ["ICE CAVE"], intExt: "INT", dayNight: "N", dNumber: "N3", scenes: ["C42pt"], sortOrder: 0 },
        { setName: "TUNNEL", subSets: ["ICE CAVE"], intExt: "INT", dayNight: "N", dNumber: "N3", scenes: ["C42pt"], sortOrder: 1 },
      ],
      units: [{ unitLabel: "MAIN UNIT" }],
      markers: [{ label: "END OF PRINC. PHOTOG.", markerType: "milestone" }],
      events: [],
      zone: "van",
      companyMove: false, companyMoveDestination: null,
      totalPages: "1 4/8", splitDay: false,
      workPeriods: [], preLightNotes: [],
      vfxElements: ["CRIME SCENE PHOTOS FOR SC.46", "VFX ELEMENTS: MUZZLE FLASHES, BULLET HITS, EXPLOSIONS"],
      omittedScenes: [],
    }),
  },
];

const COMPANY_DAYS_OFF = [
  { date: "2026-05-16", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
  { date: "2026-05-17", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
  { date: "2026-05-18", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
  { date: "2026-05-19", dayType: "holiday", title: "VICTORIA DAY", notes: "COMPANY DAY OFF · VICTORIA DAY WILL REPLACE MEMORIAL DAY FOR ALL US CREW" },
  { date: "2026-05-24", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
  { date: "2026-05-25", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
  { date: "2026-05-30", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
  { date: "2026-05-31", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
  { date: "2026-06-06", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
  { date: "2026-06-07", dayType: "dark-day", title: "", notes: "COMPANY DAY OFF" },
];

(async () => {
  // 0. Find the published revision
  const revRes = await fetch(
    `${REST}/production_schedule_revisions?show_id=eq.${SHOW_ID}&revision_scope=eq.published&select=id&limit=1`,
    { headers: H_READ },
  );
  if (!revRes.ok) { console.error("Cannot find revision:", revRes.status); process.exit(1); }
  const revRows = await revRes.json();
  if (revRows.length === 0) { console.error("No published revision found for show", SHOW_ID); process.exit(1); }
  const REV_ID = revRows[0].id;
  console.log("Published revision:", REV_ID);

  // 1. Delete existing days
  const delRes = await fetch(`${REST}/production_schedule_days?revision_id=eq.${REV_ID}`, { method: "DELETE", headers: H });
  if (!delRes.ok) { console.error("Delete failed:", delRes.status, await delRes.text()); process.exit(1); }
  console.log("Deleted old days");

  // 2. Insert shoot days
  const shootRows = DAYS.map(d => ({
    revision_id: REV_ID, show_id: SHOW_ID, strip_position: d.pos,
    shoot_day: d.date + "T07:00:00", day_type: d.dayType, title: d.title,
    notes: d.notes, imported_at: new Date().toISOString(), created_by: "soup-v2-full@syncoffset.local",
  }));
  const r1 = await fetch(`${REST}/production_schedule_days`, { method: "POST", headers: H, body: JSON.stringify(shootRows) });
  if (!r1.ok) { console.error("Shoot days:", r1.status, await r1.text()); process.exit(1); }
  console.log(`${shootRows.length} shoot days inserted (v2 full scheduling intelligence)`);

  // 3. Insert company days off
  const offRows = COMPANY_DAYS_OFF.map((d, i) => ({
    revision_id: REV_ID, show_id: SHOW_ID, strip_position: 100 + i,
    shoot_day: d.date + "T07:00:00", day_type: d.dayType, title: d.title,
    notes: d.notes, imported_at: new Date().toISOString(), created_by: "soup-v2-full@syncoffset.local",
  }));
  const r2 = await fetch(`${REST}/production_schedule_days`, { method: "POST", headers: H, body: JSON.stringify(offRows) });
  if (!r2.ok) { console.error("Days off:", r2.status, await r2.text()); process.exit(1); }
  console.log(`${offRows.length} company days off inserted`);

  // 4. Store production header metadata on the revision
  const revPatch = {
    notes: "Director: Ryan Coogler · 1st AD: Marvin Williams · Stage 49 Ltd. · 2820 Underhill Ave, Burnaby, BC V5A 3C5 · 604.637.1999 · alphabetsoup.office@wdtvs.com · Full Pink Draft · 21 Days Principal Photography · 6 Days Local Location · 11 Days Regional Location · 4 Days Stage",
  };
  const r3 = await fetch(`${REST}/production_schedule_revisions?id=eq.${REV_ID}`, { method: "PATCH", headers: H, body: JSON.stringify(revPatch) });
  if (!r3.ok) console.warn("Revision metadata update:", r3.status, await r3.text());
  else console.log("Revision notes updated with production metadata");

  console.log(`\nTotal: ${shootRows.length + offRows.length} calendar entries`);
})();
