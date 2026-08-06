import {
  Film, Dumbbell, Plane, Building2, HeartPulse, ShoppingBag, Briefcase, Users, GraduationCap,
  Clock, ShieldCheck, RefreshCw, Handshake,
  FileText, PhoneCall, FileCheck2, Clapperboard, Receipt, Repeat, BadgeCheck,
  HelpCircle, ClipboardList, CalendarClock,
  Timer, Mail,
  Clock3, Wallet, Target, Sparkles,
  MessageCircleMore, Phone, MapPin,
  type LucideIcon,
} from 'lucide-react'

/*
  Every icon field across every collection/global is stored as a string
  key (Payload can't persist a component reference), resolved back to
  the real lucide-react component here. One shared map so every
  consumer (Nav, IndustryWheel, ContactPageContent, HowItWorksPage,
  etc.) stays in sync automatically.
*/
export const ICON_MAP: Record<string, LucideIcon> = {
  Film, Dumbbell, Plane, Building2, HeartPulse, ShoppingBag, Briefcase, Users, GraduationCap,
  Clock, ShieldCheck, RefreshCw, Handshake,
  FileText, PhoneCall, FileCheck2, Clapperboard, Receipt, Repeat, BadgeCheck,
  HelpCircle, ClipboardList, CalendarClock,
  Timer, Mail,
  Clock3, Wallet, Target, Sparkles,
  MessageCircleMore, Phone, MapPin,
}

export function resolveIcon(name: string | null | undefined, fallback: LucideIcon = HelpCircle): LucideIcon {
  return (name && ICON_MAP[name]) || fallback
}
