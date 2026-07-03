export type Leaderboard = {
  id: string;
  name: string;
  slug: string;
  description: string;
  measurement: string;
  maxValue: number | null;
  managerUsername: string;
  createdAt: string;
  updatedAt: string;
};

export type LeaderboardEntry = {
  id: string;
  leaderboardId: string;
  name: string;
  value: number;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type LeaderboardWithEntries = Leaderboard & {
  entries: LeaderboardEntry[];
};
