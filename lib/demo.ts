import type { LeaderboardWithEntries } from "@/lib/types";

export const demoLeaderboards: LeaderboardWithEntries[] = [
  {
    id: "demo-chess",
    name: "Chess Rankings",
    slug: "chess-rankings",
    description: "Weekly ladder for quiet, technical chess competition.",
    measurement: "ELO",
    maxValue: null,
    managerUsername: "chess-rankings",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: [
      { id: "c1", leaderboardId: "demo-chess", name: "Mira Vale", value: 2180, note: "Endgame specialist", createdAt: "", updatedAt: "" },
      { id: "c2", leaderboardId: "demo-chess", name: "Jon Bell", value: 2045, note: "Rapid format", createdAt: "", updatedAt: "" },
      { id: "c3", leaderboardId: "demo-chess", name: "Ari Sol", value: 1992, note: "Opening prep streak", createdAt: "", updatedAt: "" }
    ]
  },
  {
    id: "demo-commits",
    name: "Launch Commits",
    slug: "launch-commits",
    description: "Team contribution board for the current product launch.",
    measurement: "Commits",
    maxValue: 100,
    managerUsername: "launch-commits",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: [
      { id: "l1", leaderboardId: "demo-commits", name: "Ops", value: 84, note: "Infra and release", createdAt: "", updatedAt: "" },
      { id: "l2", leaderboardId: "demo-commits", name: "Design", value: 71, note: "UI polish", createdAt: "", updatedAt: "" },
      { id: "l3", leaderboardId: "demo-commits", name: "Core", value: 66, note: "API work", createdAt: "", updatedAt: "" }
    ]
  }
];
