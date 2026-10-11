import {
  Award,
  Briefcase,
  Building2,
  Compass,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Network,
  RouteOff,
  Split,
  Store,
  Target,
  TrendingDown,
  UserX,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  award: Award,
  briefcase: Briefcase,
  "building-2": Building2,
  compass: Compass,
  "graduation-cap": GraduationCap,
  handshake: Handshake,
  "heart-handshake": HeartHandshake,
  network: Network,
  "route-off": RouteOff,
  split: Split,
  store: Store,
  target: Target,
  "trending-down": TrendingDown,
  "user-x": UserX,
  users: Users,
  workflow: Workflow,
}

/** Content JSON names icons by their lucide slug; unknown names fall back to a target. */
export function ContentIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Target
  return <Icon aria-hidden="true" className={className} strokeWidth={1.4} />
}
