export type MeowColor = typeof colors[number];
export type MeowReaction = typeof reactions[number];

export const colors = ["#fecde0", "#efeaa2", "#a2ebef", "#a2efcd"] as const;
export const reactions = [
  "🐱", "😼", "❤️", "💙",
  "💖", "✨", "😾"
] as const;