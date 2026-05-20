import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleChevronLeft,
  Clock,
  Download,
  Expand,
  FileText,
  Grid3X3,
  Home,
  Inbox,
  Info,
  LayoutGrid,
  Menu,
  Moon,
  Pencil,
  Plus,
  Printer,
  Save,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  Sun,
  Table as TableIcon,
  Trash2,
  Upload,
  User,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const DEFAULT_SIZE = 14;
const DEFAULT_STROKE = 1.75;

function withDefaults<P extends LucideProps>(Cmp: ComponentType<P>): ComponentType<P> {
  const Wrapped = (props: P) =>
    <Cmp size={DEFAULT_SIZE} strokeWidth={DEFAULT_STROKE} aria-hidden="true" {...props} />;
  Wrapped.displayName = Cmp.displayName ?? Cmp.name ?? "Icon";
  return Wrapped as ComponentType<P>;
}

export const ArrowLeftIcon = withDefaults(ArrowLeft);
export const BellIcon = withDefaults(Bell);
export const CalendarIcon = withDefaults(CalendarDays);
export const CheckIcon = withDefaults(Check);
export const CheckCircleIcon = withDefaults(CircleCheck);
export const ChevronLeftIcon = withDefaults(ChevronLeft);
export const ChevronRightIcon = withDefaults(ChevronRight);
export const CircleChevronLeftIcon = withDefaults(CircleChevronLeft);
export const ClockIcon = withDefaults(Clock);
export const ControlIcon = withDefaults(SlidersHorizontal);
export const DeleteIcon = withDefaults(Trash2);
export const DownloadIcon = withDefaults(Download);
export const EditIcon = withDefaults(Pencil);
export const ExclamationIcon = withDefaults(CircleAlert);
export const ExpandIcon = withDefaults(Expand);
export const FilePdfIcon = withDefaults(FileText);
export const HomeIcon = withDefaults(Home);
export const ImportIcon = withDefaults(Upload);
export const InboxIcon = withDefaults(Inbox);
export const InfoIcon = withDefaults(Info);
export const MenuIcon = withDefaults(Menu);
export const ModulesIcon = withDefaults(LayoutGrid);
export const AppsIcon = withDefaults(Grid3X3);
export const MoonIcon = withDefaults(Moon);
export const PlusIcon = withDefaults(Plus);
export const PrinterIcon = withDefaults(Printer);
export const SaveIcon = withDefaults(Save);
export const SearchIcon = withDefaults(Search);
export const SettingsIcon = withDefaults(Settings);
export const StarIcon = withDefaults(Star);
export const SunIcon = withDefaults(Sun);
export const TableIconRe = withDefaults(TableIcon);
export const ThunderIcon = withDefaults(Zap);
export const UserIcon = withDefaults(User);
