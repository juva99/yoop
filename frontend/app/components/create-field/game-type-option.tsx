import { GameType, gameTypeDict } from "@/app/enums/game-type.enum";
import { cn } from "@/lib/utils";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";

const getGameTypeIcon = (type: GameType) => {
  switch (type) {
    case GameType.FootBall:
      return <PiSoccerBall size={40} />;
    case GameType.BasketBall:
      return <PiBasketball size={40} />;
    default:
      return null; // Default case
  }
};

const GameTypeOption = ({
  value,
  selected,
  onSelect,
}: {
  value: GameType;
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
        {getGameTypeIcon(value)}
      </div>
      <span className="text-sm font-medium">{gameTypeDict[value]}</span>
    </div>
  );
};

export default GameTypeOption;
