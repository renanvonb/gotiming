import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CalendarSearch,
  Check,
  Eraser,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleChevronLeft,
  Clock,
  Copy,
  Download,
  Expand,
  FileText,
  Grid3X3,
  History,
  Home,
  Inbox,
  Info,
  LayoutGrid,
  Menu,
  Moon,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  Store,
  Sun,
  Table as TableIcon,
  Trash2,
  Upload,
  User,
  WandSparkles,
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
export const CalendarSearchIcon = withDefaults(CalendarSearch);
export const CheckIcon = withDefaults(Check);
export const CheckCircleIcon = withDefaults(CircleCheck);
export const ChevronLeftIcon = withDefaults(ChevronLeft);
export const ChevronRightIcon = withDefaults(ChevronRight);
export const CircleChevronLeftIcon = withDefaults(CircleChevronLeft);
export const ClockIcon = withDefaults(Clock);
export const CopyIcon = withDefaults(Copy);
export const ControlIcon = withDefaults(SlidersHorizontal);
export const DeleteIcon = withDefaults(Trash2);
export const DownloadIcon = withDefaults(Download);
export const EditIcon = withDefaults(Pencil);
export const EraserIcon = withDefaults(Eraser);
export const ExclamationIcon = withDefaults(CircleAlert);
export const ExpandIcon = withDefaults(Expand);
export const FilePdfIcon = withDefaults(FileText);
export const HistoryIcon = withDefaults(History);
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
export const ResetIcon = withDefaults(RotateCcw);
export const SaveIcon = withDefaults(Save);
export const SearchIcon = withDefaults(Search);
export const SettingsIcon = withDefaults(Settings);
export const StarIcon = withDefaults(Star);
export const StoreIcon = withDefaults(Store);
export const SunIcon = withDefaults(Sun);
export const TableIconRe = withDefaults(TableIcon);
export const ThunderIcon = withDefaults(Zap);
export const UserIcon = withDefaults(User);
export const WandIcon = withDefaults(WandSparkles);

/* Ícone de Soluções (grade de pontos) — SVG fornecido, fill via currentColor. */
export function SolutionsIcon({ size = 20, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="10.0002" cy="3.33366" r="1.66667" />
      <circle cx="10.0002" cy="9.99967" r="1.66667" />
      <circle cx="10.0002" cy="16.6667" r="1.66667" />
      <circle cx="16.6667" cy="3.33366" r="1.66667" />
      <circle cx="16.6667" cy="9.99967" r="1.66667" />
      <circle cx="16.6667" cy="16.6667" r="1.66667" />
      <circle cx="3.33317" cy="9.99967" r="1.66667" />
      <circle cx="3.33317" cy="16.6667" r="1.66667" />
      <path d="M4.99984 3.33366C4.99984 4.25413 4.25365 5.00033 3.33317 5.00033C2.4127 5.00033 1.6665 4.25413 1.6665 3.33366C1.6665 2.41318 2.4127 1.66699 3.33317 1.66699C4.25365 1.66699 4.99984 2.41318 4.99984 3.33366Z" />
    </svg>
  );
}

/* clock-plus do lucide com o "+" rotacionado 45° (centro 19,19) para virar "×". */
export function ClockXIcon({ size = DEFAULT_SIZE, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={DEFAULT_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 6v6l3.644 1.822" />
      <path d="M21.92 13.267a10 10 0 1 0-8.653 8.653" />
      <g transform="rotate(45 19 19)">
        <path d="M16 19h6" />
        <path d="M19 16v6" />
      </g>
    </svg>
  );
}
