const ART_LINES = [
  "       /\\                  ",
  "      /  \\                 ",
  "     /    \\                ",
  "    /______\\               ",
  "   /        \\              ",
  "  /          \\             ",
  "  -------------            ",
  "   Z V X . H U B           ",
];

const INFO_LINES = [
  "zvx@zvx-hub",
  "-----------",
  "OS:        Next.js 16 (App Router)",
  "Host:      zvx.is-a.dev (Production)",
  "Kernel:    React 19 / Tailwind v4",
  "Uptime:    99.98% (Operational)",
  "Shell:     zvx-shell 1.0.0",
  "Memory:    Client-Side State Process",
  "Developer: DycandX",
  "Focus:     Computer Eng. Student @ Polines",
  "Projects:  Full-Stack / Embedded IoT",
];

export const NEOFETCH = ART_LINES.map((line, i) =>
  i < INFO_LINES.length ? line + INFO_LINES[i] : line
).join("\n");
