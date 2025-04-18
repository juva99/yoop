import React from "react";
import GameOverview from "@/components/GameOverview";
import FutureGames from "@/components/FutureGames";
import Image from "next/image";

export default function Home() {
  const sampleGame = {
    field_name: "עמק אילון 9",
    type: "soccer",
    date: "4.10",
    time: "16:00",
    players: [
      { name: "Player 1", image: "favicon.ico" },
      { name: "Player 2", image: "favicon.ico" },
      { name: "Player 3", image: "favicon.ico" },
      { name: "Player 4", image: "favicon.ico" },
      { name: "Player 5", image: "favicon.ico" },
    ],
    price: 30
  };
  const sampleGame2 = {
    field_name: "עמק  9",
    type: "soccer",
    date: "4.10",
    time: "16:00",
    players: [
      { name: "Player 1", image: "favicon.ico" },
      { name: "Player 2", image: "favicon.ico" },
      { name: "Player 3", image: "favicon.ico" },
      { name: "Player 4", image: "favicon.ico" },
      { name: "Player 5", image: "favicon.ico" },
    ],
    price: 30
  };

  return (
    <div className="p-4">
      <GameOverview
        field_name={sampleGame.field_name}
        type={sampleGame.type}
        date={sampleGame.date}
        time={sampleGame.time}
        players={sampleGame.players}
        price={sampleGame.price}
      />
      <FutureGames games={[sampleGame,sampleGame2]}/>
    </div>
  );
}
