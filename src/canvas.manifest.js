export const manifest = {
  screens: {
    scr_nskbqj: { name: "Dashboard", route: "/", position: { "x": 160, "y": 220 } },
    scr_oejufs: { name: "Residents", route: "/residents", position: { "x": 160, "y": 2200 } },
    scr_ecyaul: { name: "Active Residents", route: "/residents/active", position: { "x": 1560, "y": 2200 } },
    scr_ld5z4f: { name: "Left Residents", route: "/residents/left", position: { "x": 2960, "y": 2200 } },
    scr_o60e30: { name: "Fees", route: "/fees", position: { "x": 160, "y": 4180 } },
    scr_kkqkv5: { name: "Receipts", route: "/receipts", position: { "x": 1560, "y": 4180 } },
    scr_78ioc1: { name: "Rooms & Floors", route: "/rooms", position: { "x": 160, "y": 6160 } },
    scr_e4fvrc: { name: "Attendance", route: "/attendance", position: { "x": 1560, "y": 6160 } },
    scr_f9p9m0: { name: "Reports", route: "/reports", position: { "x": 2960, "y": 6160 } },
    scr_eukmhv: { name: "Settings", route: "/settings", position: { "x": 160, "y": 8140 } }
  },
  sections: {
    sec_mc9es5: { name: "Dashboard", x: 0, y: 0, width: 1520, height: 1180 },
    sec_yyzlqr: { name: "Residents Management", x: 0, y: 1980, width: 4320, height: 1180 },
    sec_n6l4qv: { name: "Financial Management", x: 0, y: 3960, width: 2920, height: 1180 },
    sec_hpckmf: { name: "Operations & Facilities", x: 0, y: 5940, width: 4320, height: 1180 },
    sec_d12k5t: { name: "Settings", x: 0, y: 7920, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_mc9es5", children: [
    { kind: "screen", id: "scr_nskbqj" }]
  },
  { kind: "section", id: "sec_yyzlqr", children: [
    { kind: "screen", id: "scr_oejufs" },
    { kind: "screen", id: "scr_ecyaul" },
    { kind: "screen", id: "scr_ld5z4f" }]
  },
  { kind: "section", id: "sec_n6l4qv", children: [
    { kind: "screen", id: "scr_o60e30" },
    { kind: "screen", id: "scr_kkqkv5" }]
  },
  { kind: "section", id: "sec_hpckmf", children: [
    { kind: "screen", id: "scr_78ioc1" },
    { kind: "screen", id: "scr_e4fvrc" },
    { kind: "screen", id: "scr_f9p9m0" }]
  },
  { kind: "section", id: "sec_d12k5t", children: [
    { kind: "screen", id: "scr_eukmhv" }]
  }]

};