export type Difficulty = "easy" | "normal" | "expert";

export type HsbColor = { h: number; s: number; b: number };
export type RgbColor = { r: number; g: number; b: number };
export type LabColor = { l: number; a: number; b: number };

export type ContentVisual =
  | { kind: "solid" }
  | { kind: "mask"; foregroundSrc: string; maskSrc?: string }
  | { kind: "image"; imageSrc: string };

export type ContentTarget = {
  id: string;
  prompt: string;
  difficulty: Difficulty;
  targetHex: `#${string}`;
  visual: ContentVisual;
};

export type ContentPack = {
  id: string;
  name: string;
  version: string;
  license: string;
  sourceUrl?: string;
  targets: ContentTarget[];
};

export type GameDefinition = {
  id: string;
  title: string;
  roundCount: number;
  packIds: string[];
  dailySeedNamespace: string;
};

export type GameRound = {
  id: string;
  gameId: string;
  dateSeed: string;
  roundIndex: number;
  packId: string;
  targetId: string;
  prompt: string;
  difficulty: Difficulty;
  targetHex: `#${string}`;
  visual: ContentVisual;
};

export type RoundSubmission = {
  packId: string;
  targetId: string;
  guessHex: string;
  hintUsed: boolean;
};

export type RoundScore = RoundSubmission & {
  targetHex: `#${string}`;
  deltaE00: number;
  score: number;
};
