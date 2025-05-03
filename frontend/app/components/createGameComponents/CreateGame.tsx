"use client";
import React, { useEffect, useState } from "react";
import DateFilter from "../searchComponents/DateFilter";
import TypeFilter from "../searchComponents/TypeFilter";
import GetWeather from "./GetWeather";
import { authFetch } from "@/lib/authFetch";
import { Field } from "@/app/types/Field";
import { CityFilter } from "../searchComponents/CityFilter";
import { GameType } from "@/app/enums/game-type.enum";
import { DropDownInput } from "../searchComponents/DropDownInput";

type GameDetails = {
  gameType?: GameType,
  location?: string,
  startTime?: any,
  endTime?: any,
  maxParticipants: number,
  date: Date
}

type Option = {
  label: string;
  value: string;
};
const cities = [
  { label: "תל אביב", value: "תל אביב" },
  { label: "ירושלים", value: "jerusalem" },
  { label: "חיפה", value: "haifa" },
  { label: "באר שבע", value: "beer-sheva" },
  { label: "נתניה", value: "netanya" },
  { label: "אשדוד", value: "ashdod" },
  { label: "רמת גן", value: "ramat-gan" },
  { label: "פתח תקווה", value: "petah-tikva" },
  { label: "הרצליה", value: "herzliya" },
];

const CreateGame: React.FC = () => {
  const [address, setAddress] = useState("");
  const [searchedMarker, setSearchedMarker] = useState<[number, number] | null>(
    null,
  );
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [inputs, setInputs] = useState<GameDetails>({date: new Date(), maxParticipants: 10}) 
  const [filedList, setFieldList] = useState<Option[]>([]);
  
  useEffect(() => {
    //map to strings for dropdown picker
  },[fields])
  const onInputChange = (key: string, value: any) => {
    setInputs({ ...inputs, [key]: value });
    if(key === 'maxParticipants' && value >= 30){
      setError('playerNum');
    }else{


      console.log(inputs);
    }
    
  };

  useEffect(() => {
    if (inputs.location) {
      console.log('fetch fields');
      
      fetchFields();
    }
  }, [inputs.location]);


  const fetchFields = async () => {
    try {
      const fieldsResponse = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/by-city?city=${inputs.location}`,
        { method: "GET" },
      );
      const fieldsData: { fieldId: string; fieldName: string }[] = await fieldsResponse.json();

    const dropdownOptions = fieldsData.map((field) => ({
  value: field.fieldId,
  label: field.fieldName,
  } ));

      
      setFieldList(dropdownOptions);
    } catch (err) {
      setFieldList([])
      console.error("שגיאה בטעינת מגרשים לעיר:", err);
      setError("לא ניתן לטעון מגרשים לעיר זו");
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && address.length >= 3) {
      e.preventDefault();
      setError("");

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1&countrycodes=IL`,
        );
        const data = await res.json();

        if (data.length > 0) {
          const location = data[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);
          setSearchedMarker([lat, lon]);

          try {
            const fieldsResponse = await authFetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/by-city?city=${encodeURIComponent(address)}`,
              { method: "GET" },
            );
            const fieldsData = await fieldsResponse.json();
            setFields(fieldsData);
          } catch (err) {
            console.error("שגיאה בטעינת מגרשים לעיר:", err);
            setError("לא ניתן לטעון מגרשים לעיר זו");
          }
        } else {
          console.warn("לא נמצאה תוצאה מתאימה");
          setError("לא נמצאה תוצאה מתאימה לעיר שהוזנה");
        }
      } catch (err) {
        console.error("שגיאה בשליפת מיקום מה־API:", err);
        setError("שגיאה בחיבור ל־API");
      }
    }
  };

  const isFormFilled = () :boolean => {
    return (inputs.location && inputs.date && inputs.endTime && inputs.gameType && inputs.maxParticipants && inputs.startTime && (error != ''))
  }

  // const handleSubmit = async () => {
  //   if (!isFormFilled()) {
  //     alert("חובה למלא את כל הפרטים");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setJoinLink(null);

  //   const date = inputs.date!;
  //   const time = inputs.time!;
  //   const startDate = new Date(date);
  //   startDate.setHours(time.hour);
  //   startDate.setMinutes(time.minute);
  //   const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

  //   try {
  //     const response = await fetch("/api/games", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         gameType: inputs.type,
  //         startDate: startDate.toISOString(),
  //         endDate: endDate.toISOString(),
  //         maxParticipants,
  //         field: selectedFieldId,
  //       }),
  //     });

  //     const result = await response.json();

  //     if (response.ok && result.id) {
  //       setJoinLink(`/joinGame?id=${result.id}`);
  //       setinputs({
  //         date: null,
  //         type: null,
  //         time: null,
  //         location: "tel-aviv",
  //         radius: 5,
  //       });
  //       setSearchedMarker(null);
  //       setAddress("");
  //       setSelectedFieldId(null);
  //     } else {
  //       alert("לא ניתן היה ליצור את המשחק. נסה שוב.");
  //     }
  //   } catch (err) {
  //     console.error("שגיאה בשליחה לשרת:", err);
  //     alert("אירעה שגיאה בשליחה לשרת.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="search-game p-5 text-black">
      <p className="mt-5 text-2xl font-medium text-blue-500">יצירת משחק</p>
        <DateFilter value={inputs.date} onFilterChange={onInputChange} />
        <TypeFilter onFilterChange={onInputChange} />
        <DropDownInput values={cities} type="עיר" onFilterChange={onInputChange}/>
        <DropDownInput values={filedList} type="מגרש" onFilterChange={onInputChange}/>
<div>
        <label>מספר משתתפים:</label>
        <input
          type="number"
          min={2}
          max={50}
          value={inputs.maxParticipants}
          onChange={(e) => onInputChange('maxParticipants', Number(e.target.value))}
          className={`rounded-md bg-white text-center px-2 ${error === 'playerNum' ? 'text-red-400' : ''}`}
          />   
          {error === 'playerNum' ? <span className="text-red-500 text-sm mr-2">מספר משתתפים לא תקין</span> : ''}
</div>
        
      <div className="my-4 flex flex-col justify-center gap-4">
        {searchedMarker && (
          <>
            <GetWeather lat={searchedMarker[0]} lon={searchedMarker[1]} />
          </>
        )}
        {joinLink && (
          <div className="mt-4 text-center">
            <a
              href={joinLink}
              className="rounded-full bg-green-600 px-6 py-2 text-lg text-white shadow-lg hover:bg-green-700"
            >
              לצפייה במשחק
            </a>
          </div>
        )}
      </div> 

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => console.log(inputs)
          }
          disabled={!isFormFilled() || isLoading}
          className={`rounded-full px-10 py-4 text-lg tracking-wider shadow-lg ${
            isFormFilled() && !isLoading
              ? "bg-gray-900"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          {isLoading ? "שולח..." : "הזמנת מגרש"}
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
