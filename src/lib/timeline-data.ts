export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  description: string;
}

export const TIMELINE: TimelineEntry[] = [
  {
    id: "founded",
    year: "2019",
    title: "Founded with a Vision",
    description: "DevNova Tech started as a small team of developers with a big idea: build software that actually moves businesses forward.",
  },
  {
    id: "expansion",
    year: "2021",
    title: "Expanded Our Craft",
    description: "Grew into a full-stack studio — mobile, web, backend, and cloud — taking on more ambitious client projects.",
  },
  {
    id: "ai",
    year: "2023",
    title: "Embraced AI & Automation",
    description: "Integrated intelligent automation into our delivery process, helping clients ship faster without sacrificing quality.",
  },
  {
    id: "today",
    year: "Today",
    title: "100+ Projects Strong",
    description: "Trusted by startups and enterprises alike, with a growing global client base and a reputation for reliable delivery.",
  },
];