"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyGames } from "@/lib/actions";
import { getSession } from "@/lib/session";
import { ParticipationStatus } from "../enums/participation-status.enum";
import { useEffect, useState } from "react";
import { Game } from "../types/Game";
import { Card } from "@/components/ui/card";
import GameCard from "@/components/GameCard";

export default function MyGames() {
  const [managedGames, setManagedGames] = useState<Game[]>([]);
  const [approvedGames, setApprovedGames] = useState<Game[]>([]);
  const [pendingGames, setPendingGames] = useState<Game[]>([]);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      const currUserUID = session!.user.uid;
      const games = await getMyGames();

      setManagedGames(games.filter((game) => game.creator.uid === currUserUID));

      setApprovedGames(
        games.filter((game) =>
          game.gameParticipants.some(
            (gp) =>
              gp.user.uid === currUserUID &&
              gp.status === ParticipationStatus.APPROVED,
          ),
        ),
      );

      setPendingGames(
        games.filter((game) =>
          game.gameParticipants.some(
            (gp) =>
              gp.user.uid === currUserUID &&
              gp.status === ParticipationStatus.PENDING,
          ),
        ),
      );
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <Tabs defaultValue="approved" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="approved">המשחקים שלי</TabsTrigger>
          <TabsTrigger value="managed">בניהולך</TabsTrigger>
          <TabsTrigger value="pending">בהמתנה</TabsTrigger>
        </TabsList>

        <TabsContent value="managed">
          {managedGames.length === 0 ? (
            <Card>
              <p className="h-30 text-center">לא נמצאו משחקים</p>
            </Card>
          ) : (
            <div className="space-y-4 pt-4">
              {managedGames.map((game, index) => (
                <GameCard key={index} game={game} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedGames.length === 0 ? (
            <Card>
              <p className="h-30 text-center">לא נמצאו משחקים</p>
            </Card>
          ) : (
            <div className="space-y-4 pt-4">
              {approvedGames.map((game, index) => (
                <GameCard key={index} game={game} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingGames.length === 0 ? (
            <Card>
              <p className="h-30 text-center">לא נמצאו משחקים</p>
            </Card>
          ) : (
            <div className="space-y-4 pt-4">
              {pendingGames.map((game, index) => (
                <GameCard key={index} game={game} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
