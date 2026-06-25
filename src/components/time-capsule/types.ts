import type { MutableRefObject } from "react";

export type TimeScene =
  | "frozen"
  | "reverse"
  | "dissolve"
  | "crystal"
  | "reveal"
  | "final";

export type TimelineRef = MutableRefObject<number>;

