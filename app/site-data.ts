export const siteName = "枫落丰源";
export const siteUrl = "https://www.feng1026.top";
export const description = "和你的日常，就是奇迹";

export const stats = [
  { label: "📔 身份", value: "学生 / Student" },
  { label: "📍 位置", value: "中国 / China" },
  { label: "🏷️ 语言", value: "中文 / Chinese" }
];

export const heroLinks = [
  {
    label: "个人网站",
    href: "https://blog.feng1026.top",
    external: true
  }
];

export const aboutCards = [
  {
    title: "我在做什么",
    desc: "专注于打造有温度的产品体验，把视觉、内容与工程实现统一为一种清晰表达。",
    tags: ["体验设计", "前端工程", "品牌表达"]
  },
  {
    title: "我的工作方式",
    desc: "重视节奏与秩序：先搭结构，再打磨细节，让每一次输出都能长期复用。",
    tags: ["系统化", "高质量", "可持续"]
  },
  {
    title: "期待的合作",
    desc: "喜欢与有审美、有技术追求的团队共创，用小而精的迭代做出影响力。",
    tags: ["共创", "迭代", "增长"]
  }
];

export const aboutDetails = [
  {
    title: "我在做什么",
    subtitle: "把体验、内容与工程打磨成同一种语言",
    body: [
      "我更关注「体验被感知的瞬间」，也关注它背后的系统与实现。",
      "从信息结构、视觉节奏到交互反馈，我会把设计意图落实到可以长期维护的工程细节中。"
    ],
    highlights: ["体验一致性", "设计到交付", "系统化表达"],
    tags: ["体验设计", "前端工程", "品牌表达"]
  },
  {
    title: "我的工作方式",
    subtitle: "先搭结构，再打磨细节",
    body: [
      "我会先把信息和视觉结构搭稳，让目标、路径、组件关系足够清晰。",
      "然后再把节奏、动效、微文案打磨到可复用的层级。"
    ],
    highlights: ["结构优先", "节奏控制", "高质量输出"],
    tags: ["系统化", "高质量", "可持续"]
  },
  {
    title: "期待的合作",
    subtitle: "与有审美与技术追求的团队共创",
    body: [
      "我喜欢和重视细节、敢于验证的团队一起工作。",
      "用小而精的迭代，把体验变成产品的核心竞争力。"
    ],
    highlights: ["共创", "迭代", "增长"],
    tags: ["共创", "迭代", "增长"]
  }
];

export const ogTags = aboutCards[0]?.tags ?? [
  "枫落丰源",
  "个人主页"
];


export type ThemeTokens = {
  bg: string;
  fg: string;
  muted: string;
  card: string;
  card2: string;
  cardTint: string;
  accent: string;
  accent2: string;
  accent3: string;
  ring: string;
  heroGap: string;
  heroGapBottom: string;
};

export const theme = {
  light: {
    bg: "242 248 255",
    fg: "15 23 42",
    muted: "90 110 150",
    card: "250 252 255",
    card2: "236 244 255",
    cardTint: "220 234 255",
    accent: "91 167 255",
    accent2: "134 197 255",
    accent3: "199 217 255",
    ring: "180 200 230",
    heroGap: "clamp(20px, 5.5vh, 72px)",
    heroGapBottom: "clamp(40px, 9vh, 140px)"
  },
  dark: {
    bg: "8 12 24",
    fg: "226 232 240",
    muted: "160 180 210",
    card: "16 24 40",
    card2: "24 36 58",
    cardTint: "30 48 80",
    accent: "102 170 255",
    accent2: "144 200 255",
    accent3: "190 200 255",
    ring: "54 75 110",
    heroGap: "clamp(20px, 5.5vh, 72px)",
    heroGapBottom: "clamp(40px, 9vh, 140px)"
  }
} as const satisfies Record<string, ThemeTokens>;

const toCssVars = (tokens: ThemeTokens) => `
  --bg: ${tokens.bg};
  --fg: ${tokens.fg};
  --muted: ${tokens.muted};
  --card: ${tokens.card};
  --card-2: ${tokens.card2};
  --card-tint: ${tokens.cardTint};
  --accent: ${tokens.accent};
  --accent-2: ${tokens.accent2};
  --accent-3: ${tokens.accent3};
  --ring: ${tokens.ring};
  --hero-gap: ${tokens.heroGap};
  --hero-gap-bottom: ${tokens.heroGapBottom};
`;

export const themeCss = `
:root {
  color-scheme: light dark;
  ${toCssVars(theme.light)}
}
@media (prefers-color-scheme: dark) {
  :root {
    ${toCssVars(theme.dark)}
  }
}
`;
