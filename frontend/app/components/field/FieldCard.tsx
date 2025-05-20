import Link from "next/link";
import { PiSoccerBall, PiBasketball } from "react-icons/pi";
import { Field } from "@/app/types/Field";
import { GameType } from "@/app/enums/game-type.enum";

type Props = {
  field: Field;
};

const GameTypeIcon = (type: GameType) => {
  if (type === GameType.FootBall) {
    return <PiSoccerBall className="field-icon" />;
  }
  if (type === GameType.BasketBall) {
    return <PiBasketball className="field-icon" />;
  }
  return null;
};

const FieldCard: React.FC<Props> = ({ field }) => {
  return (
    <div className="field-card bg-white border border-blue-100 shadow-lg rounded-[18px] p-5 w-full max-800 mx-auto">
      <div className="field-header flex justify-start items-center mb-4">
        <div className="field-icon-container flex ml-3 mr-0 text-blue-700 text-2xl ">
          {GameTypeIcon(field.gameTypes[0])}
        </div>

        <div className="field-info flex items-center text-right ">
          <span className="field-name text-[#00aaff] font-bold text-lg ml-5">{field.fieldName}</span>          
          <span className="field-city text-[#0077cc] font-bold text-lg">{field.city}</span>
        </div>
      </div>

      <Link
        href={`/field-manager/field/${field.fieldId}/games`}
        className="field-link-view block text-right text-[20px] font-bold text-blue-700 hover:text-[22px]"
      >לצפייה במשחקים</Link>

      <Link
        href={`/field-manager/field/${field.fieldId}/edit`}
        className="field-link-edit block text-right text-[20px] font-bold text-gray-400 hover:text-[22px] mt-1"
      >שינוי פרטי המגרש</Link>
    </div>
  );
};

export default FieldCard;
