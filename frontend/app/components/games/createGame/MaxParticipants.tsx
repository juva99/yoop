import React, { useState } from "react";
type Props = {
  onFilterChange: (key: string, value: any) => void;
};

const MaxParticipants: React.FC<Props> = ({ onFilterChange }) => {
  const [num, setNum] = useState(10);
  const [inputError, setInputError] = useState(false);
  const changeHandler = (value: string) => {
    setNum(Number(value));
    if (Number(value) >= 2 && Number(value) <= 30) {
      setInputError(false);

      onFilterChange("maxParticipants", Number(value));
    } else {
      setInputError(true);
    }
  };
  return (
    <div>
      <label>מספר משתתפים:</label>
      <input
        type="number"
        min={2}
        max={30}
        value={num}
        onChange={(e) => {
          changeHandler(e.target.value);
        }}
        className={`rounded-md bg-white px-2 text-center`}
      />
      {inputError ? (
        <span className="mr-2 text-sm text-red-500">מספר משתתפים לא תקין</span>
      ) : (
        ""
      )}
    </div>
  );
};

export default MaxParticipants;
