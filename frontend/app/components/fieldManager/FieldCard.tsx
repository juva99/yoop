import Link from "next/link";
import { PiSoccerBall, PiBasketball } from "react-icons/pi";
import { Field } from "@/app/types/Field";
import { GameType } from "@/app/enums/game-type.enum";

type Props = {
  field: Field;
  border?: boolean;
};

const FieldCard: React.FC<Props> = ({ field, border }) => {
  let icons = [];
  if (field.gameTypes.includes(GameType.FootBall)) {
    icons.push(<PiSoccerBall className="field-icon" />);
  }
  if (field.gameTypes.includes(GameType.BasketBall)) {
    icons.push(<PiBasketball className="field-icon" />);
  }
  return (
    <div className={`py-2 text-sm ${border ? "border-b border-gray-200" : ""}`}>
      <div className="flex flex-col">
        <div className="text-title flex items-center gap-2">
          <span>{field.fieldName}</span>
          {icons.map((icon) => (
            <div>{icon}</div>
          ))}
        </div>
        <span className="font-bold text-gray-500">{field.city}</span>
      </div>
      <div className="text-subtitle flex gap-2 underline">
        <Link href={`/field-manager/field/${field.fieldId}/games`}>
          לצפייה במשחקים
        </Link>
      </div>
    </div>
  );
};

export default FieldCard;
