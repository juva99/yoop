import { GameType } from "@/app/enums/game-type.enum";
import { cn } from "@/lib/utils";
import Image from "next/image";

const GameTypeOption = ({
  value,
  label,
  icon,
  selected,
  onSelect,
}: {
  value: GameType;
  label: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col items-center rounded-lg border-2 p-4 text-center transition-all",
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 hover:border-blue-300",
      )}
    >
      <div className="mb-2 flex h-12 w-12 items-center justify-center">
        <Image src={icon} alt={label} width={40} height={40} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default GameTypeOption;
