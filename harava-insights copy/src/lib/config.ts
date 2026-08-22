export const siteConfig = {
  name: "Harava Insights",
  description:
    "AI-powered platform for Financial Intelligence, Accreditation Compliance, and Professional Education",
  products: [
    {
      id: "finsight",
      name: "FinSight AI",
      description: "Accounting, CFO Advisory & Financial Intelligence",
      color: "emerald",
      href: "/finsight",
    },
    {
      id: "accrediai",
      name: "AccrediAI",
      description: "CARF & Joint Commission Accreditation Compliance",
      color: "blue",
      href: "/accrediai",
    },
    {
      id: "proed",
      name: "ProEd AI",
      description: "Professional Education & Training",
      color: "violet",
      href: "/proed",
    },
  ],
} as const;

export type Product = (typeof siteConfig.products)[number];
