import Link from "next/link";
import { PiSoccerBall, PiBasketball } from "react-icons/pi";
import { Field } from "@/app/types/Field";
import { GameType } from "@/app/enums/game-type.enum";

type Props = {
  field: Field;
};

const FieldCard: React.FC<Props> = ({ field }) => {
  let icons = [];
  if (field.gameTypes.includes(GameType.FootBall)) {
    icons.push(<PiSoccerBall className="field-icon" />);
  }
  if (field.gameTypes.includes(GameType.BasketBall)) {
    icons.push(<PiBasketball className="field-icon" />);
  }
  return (
    <div className="field-card max-800 mx-auto w-full rounded-[18px] border border-blue-100 bg-white p-5 shadow-lg">
      <div className="field-header mb-4 flex items-center justify-start">
        {icons.map((icon) => (
          <div className="field-icon-container mr-0 ml-3 flex text-2xl text-blue-700">
            {icon}
          </div>
        ))}

        <div className="field-info flex items-center text-right">
          <span className="field-name ml-5 text-lg font-bold text-[#00aaff]">
            {field.fieldName}
          </span>
          <span className="field-city text-lg font-bold text-[#0077cc]">
            {field.city}
          </span>
        </div>
      </div>

      <Link
        href={`/field-manager/field/${field.fieldId}/games`}
        className="field-link-view block text-right text-[20px] font-bold text-blue-700 hover:text-[22px]"
      >
        לצפייה במשחקים
      </Link>

      <Link
        href={`/field-manager/field/${field.fieldId}/edit`}
        className="field-link-edit mt-1 block text-right text-[20px] font-bold text-gray-400 hover:text-[22px]"
      >
        שינוי פרטי המגרש
      </Link>
    </div>
  );
};

export default FieldCard;
