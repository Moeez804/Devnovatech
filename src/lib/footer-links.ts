export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "#services" },
      { label: "Mobile Development", href: "#services" },
      { label: "AI & Automation", href: "#services" },
      { label: "Cloud Solutions", href: "#services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case Studies", href: "#portfolio" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
];