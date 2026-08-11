"use client";

import { Shield, Zap, GraduationCap, Crown } from "lucide-react";
import type { LevelInfo } from "@/lib/level-system";

interface Props {
  levelInfo: LevelInfo;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
}

export function LevelBadge({ levelInfo, size = "md", showDescription = false }: Props) {
  const renderIcon = () => {
    const iconSize = size === "sm" ? 14 : size === "md" ? 18 : 22;
    switch (levelInfo.iconName) {
      case "Shield":
        return <Shield size={iconSize} className={levelInfo.colorClass} />;
      case "Zap":
        return <Zap size={iconSize} className={levelInfo.colorClass} />;
      case "GraduationCap":
        return <GraduationCap size={iconSize} className={levelInfo.colorClass} />;
      case "Crown":
        return <Crown size={iconSize} className={levelInfo.colorClass} />;
      default:
        return <Shield size={iconSize} className={levelInfo.colorClass} />;
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1.5",
    md: "px-3 py-1 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5 font-semibold",
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`inline-flex items-center rounded-full border shadow-sm transition-all ${levelInfo.badgeStyle} ${sizeClasses[size]}`}
      >
        {renderIcon()}
        <span>{levelInfo.title}</span>
      </div>
      {showDescription && (
        <p className="text-xs text-slate-400 pl-1">{levelInfo.description}</p>
      )}
    </div>
  );
}
