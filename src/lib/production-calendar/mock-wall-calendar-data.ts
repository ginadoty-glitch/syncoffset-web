import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";

import type {
  CalendarDayRow,
  CalendarDaySceneRow,
  ProductionCalendarDayCell,
  ProductionCalendarMonthData,
} from "./calendar-types";

type MockDaySpec = {
  date: string;
  day: CalendarDayRow;
  scenes: CalendarDaySceneRow[];
  obligations?: { obligation_type: string; label: string; time_label: string | null }[];
  departmentFlags?: { department: string; label: string }[];
};

function buildGrid(year: number, month: number): Date[] {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(monthStart);
  return eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
  });
}

/** Visual-review mock — August 2024 Block 03 strip calendar (reference PDF). Not operational truth. */
const AUGUST_2024_MOCK_DAYS: MockDaySpec[] = [
  {
    date: "2024-08-05",
    day: {
      id: "mock-prep-1",
      calendar_date: "2024-08-05",
      day_number: null,
      day_type: "prep",
      shoot_location: "NS STUDIOS",
      unit_label: "",
      zone_color: "van",
      notes: "1300 — TECH SURVEY DAY 1",
    },
    scenes: [],
    obligations: [{ obligation_type: "survey", label: "TECH SURVEY DAY 1", time_label: "1300" }],
  },
  {
    date: "2024-08-06",
    day: {
      id: "mock-prep-2",
      calendar_date: "2024-08-06",
      day_number: null,
      day_type: "prep",
      shoot_location: "NS STUDIOS",
      unit_label: "",
      zone_color: "van",
      notes: "0800 — TECH SURVEY DAY 2",
    },
    scenes: [],
    obligations: [{ obligation_type: "survey", label: "TECH SURVEY DAY 2", time_label: "0800" }],
  },
  {
    date: "2024-08-12",
    day: {
      id: "mock-shoot-1",
      calendar_date: "2024-08-12",
      day_number: 1,
      day_type: "shoot",
      shoot_location: "NANAIMO",
      unit_label: "MAIN UNIT",
      zone_color: "island",
      notes: "",
    },
    scenes: [
      {
        scene_number: "156",
        interior_exterior: "INT",
        description: "",
        set_name: null,
        location_label: "TURNERS CABIN",
      },
      {
        scene_number: "151pt",
        interior_exterior: "INT",
        description: "",
        set_name: null,
        location_label: "TURNERS CABIN · MAIN ROOM",
      },
    ],
  },
  {
    date: "2024-08-13",
    day: {
      id: "mock-shoot-2",
      calendar_date: "2024-08-13",
      day_number: 2,
      day_type: "shoot",
      shoot_location: "NS STUDIOS",
      unit_label: "MAIN UNIT",
      zone_color: "van",
      notes: "",
    },
    scenes: [
      {
        scene_number: "523",
        interior_exterior: "EXT",
        description: "",
        set_name: null,
        location_label: "YOSEMITE · EL-O-WIN · ROCKY RIDGE",
      },
      {
        scene_number: "554",
        interior_exterior: "EXT",
        description: "",
        set_name: null,
        location_label: "YOSEMITE · EL-O-WIN",
      },
      {
        scene_number: "560pt",
        interior_exterior: "EXT",
        description: "",
        set_name: null,
        location_label: "ROCKY RIDGE",
      },
    ],
  },
  {
    date: "2024-08-14",
    day: {
      id: "mock-shoot-3",
      calendar_date: "2024-08-14",
      day_number: 3,
      day_type: "shoot",
      shoot_location: "NORTH VAN.",
      unit_label: "MAIN UNIT",
      zone_color: "north",
      notes: "",
    },
    scenes: [
      {
        scene_number: "368",
        interior_exterior: "E/I",
        description: "",
        set_name: null,
        location_label: "TURNERS CABIN",
      },
      {
        scene_number: "434",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "TURNERS CABIN · FRONT",
      },
      { scene_number: "449", interior_exterior: "E", description: "", set_name: null, location_label: "HORSE STABLES" },
    ],
  },
  {
    date: "2024-08-15",
    day: {
      id: "mock-shoot-4",
      calendar_date: "2024-08-15",
      day_number: 4,
      day_type: "shoot",
      shoot_location: "DEROCHE",
      unit_label: "B1 — SPLINTER UNIT (STUDIO)",
      zone_color: "east",
      notes: "",
    },
    scenes: [
      {
        scene_number: "105pt10",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "YNP — EL CAP",
      },
      { scene_number: "110pt", interior_exterior: "E", description: "", set_name: null, location_label: "OPEN MEADOW" },
    ],
  },
  {
    date: "2024-08-16",
    day: {
      id: "mock-shoot-5",
      calendar_date: "2024-08-16",
      day_number: 5,
      day_type: "shoot",
      shoot_location: "DEROCHE",
      unit_label: "MAIN UNIT",
      zone_color: "east",
      notes: "",
    },
    scenes: [
      {
        scene_number: "421",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "OPEN MEADOW · SQUATTERS VILLAGE",
      },
      { scene_number: "423", interior_exterior: "E", description: "", set_name: null, location_label: "OPEN MEADOW" },
      {
        scene_number: "422",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "SQUATTERS VILLAGE",
      },
      { scene_number: "429", interior_exterior: "E", description: "", set_name: null, location_label: "TREES" },
      { scene_number: "430", interior_exterior: "E", description: "", set_name: null, location_label: "TREES" },
    ],
  },
  {
    date: "2024-08-17",
    day: {
      id: "mock-shoot-6",
      calendar_date: "2024-08-17",
      day_number: 6,
      day_type: "shoot",
      shoot_location: "PORT MOODY",
      unit_label: "MAIN UNIT",
      zone_color: "van",
      notes: "",
    },
    scenes: [
      {
        scene_number: "457",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "OPEN MEADOW · SQUATTERS VILLAGE",
      },
      {
        scene_number: "458",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "SQUATTERS VILLAGE",
      },
      { scene_number: "431", interior_exterior: "E", description: "", set_name: null, location_label: "OPEN MEADOW" },
    ],
  },
  {
    date: "2024-08-19",
    day: {
      id: "mock-shoot-7",
      calendar_date: "2024-08-19",
      day_number: 7,
      day_type: "shoot",
      shoot_location: "COQUITLAM",
      unit_label: "MAIN UNIT",
      zone_color: "van",
      notes: "",
    },
    scenes: [
      {
        scene_number: "335",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "BEGAY HOUSE · WOODED PATH",
      },
      { scene_number: "336", interior_exterior: "E", description: "", set_name: null, location_label: "WOODED PATH" },
      {
        scene_number: "301pt",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "BEGAY HOUSE (FB)",
      },
    ],
  },
  {
    date: "2024-08-20",
    day: {
      id: "mock-shoot-8",
      calendar_date: "2024-08-20",
      day_number: 8,
      day_type: "shoot",
      shoot_location: "WHISTLER",
      unit_label: "MAIN UNIT",
      zone_color: "north",
      notes: "",
    },
    scenes: [
      {
        scene_number: "303",
        interior_exterior: "EXT",
        description: "",
        set_name: null,
        location_label: "ROAD (FALLEN TREE)",
      },
      { scene_number: "304", interior_exterior: "E/I", description: "", set_name: null, location_label: "LUCY'S TENT" },
      { scene_number: "322", interior_exterior: "E", description: "", set_name: null, location_label: "TRAIL (FB)" },
      { scene_number: "426", interior_exterior: "E", description: "", set_name: null, location_label: "GULCH" },
    ],
  },
  {
    date: "2024-08-21",
    day: {
      id: "mock-shoot-9",
      calendar_date: "2024-08-21",
      day_number: 9,
      day_type: "shoot",
      shoot_location: "WHISTLER",
      unit_label: "B2 — SECOND UNIT",
      zone_color: "north",
      notes: "REDUCED 2nd UNIT",
    },
    scenes: [
      {
        scene_number: "331",
        interior_exterior: "E/I",
        description: "",
        set_name: null,
        location_label: "RANGERS STATION · FRONT",
      },
      {
        scene_number: "404",
        interior_exterior: "E/I",
        description: "",
        set_name: null,
        location_label: "VISITORS CENTER",
      },
      {
        scene_number: "405",
        interior_exterior: "E/I",
        description: "",
        set_name: null,
        location_label: "VISITORS CENTER",
      },
    ],
  },
  {
    date: "2024-08-22",
    day: {
      id: "mock-tech-1",
      calendar_date: "2024-08-22",
      day_number: null,
      day_type: "tech-scout",
      shoot_location: "WHISTLER",
      unit_label: "",
      zone_color: "north",
      notes: "0900 — LOCATION SCOUT",
    },
    scenes: [],
    obligations: [{ obligation_type: "scout", label: "LOCATION SCOUT", time_label: "0900" }],
  },
  {
    date: "2024-08-23",
    day: {
      id: "mock-shoot-10",
      calendar_date: "2024-08-23",
      day_number: 10,
      day_type: "shoot",
      shoot_location: "WHISTLER",
      unit_label: "MAIN UNIT",
      zone_color: "north",
      notes: "",
    },
    scenes: [
      {
        scene_number: "323B",
        interior_exterior: "E/I",
        description: "",
        set_name: null,
        location_label: "TURNER'S BLAZER · ROAD",
      },
      { scene_number: "317", interior_exterior: "E", description: "", set_name: null, location_label: "MOUNTAIN HWY" },
      { scene_number: "308", interior_exterior: "E", description: "", set_name: null, location_label: "STEEP ROAD" },
    ],
  },
  {
    date: "2024-08-24",
    day: {
      id: "mock-shoot-11",
      calendar_date: "2024-08-24",
      day_number: 11,
      day_type: "shoot",
      shoot_location: "MAPLE RIDGE",
      unit_label: "MAIN UNIT",
      zone_color: "east",
      notes: "",
    },
    scenes: [
      {
        scene_number: "420",
        interior_exterior: "E",
        description: "",
        set_name: null,
        location_label: "FOREST (NEAR MINE)",
      },
    ],
  },
  {
    date: "2024-08-25",
    day: {
      id: "mock-travel-1",
      calendar_date: "2024-08-25",
      day_number: null,
      day_type: "travel",
      shoot_location: "COMPANY MOVE",
      unit_label: "",
      zone_color: "van",
      notes: "Company move — Whistler to Mission base",
    },
    scenes: [],
  },
  {
    date: "2024-08-26",
    day: {
      id: "mock-holiday-1",
      calendar_date: "2024-08-26",
      day_number: null,
      day_type: "holiday",
      shoot_location: "BC DAY",
      unit_label: "",
      zone_color: "van",
      notes: "Stat holiday — no photography",
    },
    scenes: [],
  },
  {
    date: "2024-08-28",
    day: {
      id: "mock-prep-3",
      calendar_date: "2024-08-28",
      day_number: null,
      day_type: "prep",
      shoot_location: "BLOCK 3",
      unit_label: "",
      zone_color: "van",
      notes: "PREP 08/28/2024 · WHITE ONELINER 08/28/2024",
    },
    scenes: [],
  },
  {
    date: "2024-08-30",
    day: {
      id: "mock-wrap-1",
      calendar_date: "2024-08-30",
      day_number: null,
      day_type: "wrap",
      shoot_location: "NS STUDIOS",
      unit_label: "",
      zone_color: "van",
      notes: "Block 03 wrap — stage return",
    },
    scenes: [],
  },
  {
    date: "2024-08-31",
    day: {
      id: "mock-dark-1",
      calendar_date: "2024-08-31",
      day_number: null,
      day_type: "dark-day",
      shoot_location: "",
      unit_label: "",
      zone_color: "van",
      notes: "Dark day — crew rest",
    },
    scenes: [],
  },
];

export function buildMockWallCalendarMonth(year: number, month: number): ProductionCalendarMonthData {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const mockByDate = new Map(AUGUST_2024_MOCK_DAYS.map((entry) => [entry.date, entry]));

  const cells: ProductionCalendarDayCell[] = buildGrid(year, month).map((d) => {
    const date = format(d, "yyyy-MM-dd");
    const mock = mockByDate.get(date);

    return {
      date,
      inMonth: d.getMonth() === month - 1,
      day: mock?.day ?? null,
      scenes: mock?.scenes ?? [],
      obligations: mock?.obligations ?? [],
      departmentFlags: mock?.departmentFlags ?? [],
      workOrderCount: 0,
      transportCount: 0,
    };
  });

  return {
    year,
    month,
    monthLabel: format(monthStart, "MMMM yyyy"),
    calendarName: "BLOCK 03 · WHITE ONELINER (MOCK REVIEW)",
    cells,
    persistenceAvailable: false,
    tablesAvailable: false,
    loadError: null,
  };
}

/** Default mock month for visual review — August 2024 reference strip. */
export function buildDefaultMockWallCalendarMonth(): ProductionCalendarMonthData {
  return buildMockWallCalendarMonth(2024, 8);
}
