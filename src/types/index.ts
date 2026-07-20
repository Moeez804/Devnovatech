export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoSrc?: string;
  href: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}