import { PiBasketball, PiSoccerBall, PiCoins, PiCalendarDots, PiClock    } from "react-icons/pi";
import { IoMdPin } from "react-icons/io";

import { Game } from "@/app/types/Game";
import PlayersList from "@/components/PlayersList";
import MapView from "@/components/MapView";


type Props = {
  game: Game;
};

export default function gamePage() {
  
  const { gameId, gameType, startDate, endDate, maxParticipants, status, gameParticipants , creator, field } = game2;
  const users = gameParticipants.map(participant => participant.user);
  return (
    <>
      <div>
        <span className="flex items-center gap-3 text-[24px] font-medium text-blue-400">
          {gameType.toLowerCase() === "basketball" ? (
            <PiBasketball />
          ) : gameType.toLowerCase() === "soccer" ? (
            <PiSoccerBall />
          ) : null}
          </span>
      </div>
      <div>
        <div className="flex flex-row items-center gap-2">
          <IoMdPin />
          <p>{field.fieldName}</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <PiCalendarDots />
          <p>{startDate.getDate()}</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <PiClock />
          <p>{startDate.getTime()}</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <PiCoins />
          <p>{30 + "₪"}</p>
        </div>
      </div>
      <div>
        <h1> {"(" + gameParticipants.length + "/" + maxParticipants + ")"} משתתפים</h1>
        <PlayersList creatorUID={creator.uid} players={users}/>
      </div>
      <div>
      <MapView
          defaultLocation={{ lng: 34.79, lat: 32.13 }}
          games={[game]}
        />
      </div>
      <div>
        buttons
      </div>
    </>

  )
}