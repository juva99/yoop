import { Suspense } from "react";
import FutureGames from "@/components/FutureGames";
import Search from "@/components/searchComponents/search-games";
import { getMyGames } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Search as SearchIcon } from "lucide-react";

// Loading components
function FutureGamesLoading() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

function SearchLoading() {
  return <Skeleton className="h-10 w-full" />;
}

// Async wrapper for games
async function FutureGamesWrapper() {
  try {
    const data = await getMyGames();
    return <FutureGames games={data} />;
  } catch (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">שגיאה בטעינת המשחקים</p>
      </div>
    );
  }
}

export default function Home() {
  return (
    <main className="container mx-auto max-w-4xl space-y-8 p-4">
      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Future Games Section */}
        <section className="lg:col-span-2">
          <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarDays className="text-primary h-5 w-5" />
                משחקים עתידיים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<FutureGamesLoading />}>
                <FutureGamesWrapper />
              </Suspense>
            </CardContent>
          </Card>
        </section>

        {/* Search Section */}
        <section className="lg:col-span-2">
          <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <SearchIcon className="text-primary h-5 w-5" />
                חיפוש משחק
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SearchLoading />}>
                <Search />
              </Suspense>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
