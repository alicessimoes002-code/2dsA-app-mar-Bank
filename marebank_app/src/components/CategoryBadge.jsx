import { UtensilsCrossed, Bus, Gamepad2, GraduationCap, HeartPulse, ShoppingBag, Smartphone, Wallet } from "lucide-react";

const iconMap = {
  UtensilsCrossed,
  Bus,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Smartphone,
  Wallet,
};

export default function CategoryBadge({ config }) {
  const Icon = iconMap[config.icon] || Wallet;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.light}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
