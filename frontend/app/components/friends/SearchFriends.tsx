"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/app/types/User";
import Friend from "./Friend";
import { Search, Users, Loader2 } from "lucide-react";

interface SearchFriendsProps {
  friends: User[];
  userId: string;
  initialQuery?: string;
}

const SearchFriends: React.FC<SearchFriendsProps> = ({
  friends,
  userId,
  initialQuery = "",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) return;

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      params.set("query", query);
      router.push(`/friends?${params.toString()}`);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [query, router, searchParams]);

  const handleClearSearch = () => {
    setQuery("");
    router.push("/friends");
  };

  const filteredFriends = useMemo(() => {
    if (!query.trim()) return friends;
    return friends.filter(
      (friend) =>
        friend.firstName.toLowerCase().includes(query.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(query.toLowerCase()),
    );
  }, [friends, query]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="חפש חברים לפי שם..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 rounded-xl border-gray-200 bg-white pr-10 pl-4 text-lg shadow-sm focus:border-purple-500 focus:ring-purple-500/20"
          />
          {isSearching && (
            <Loader2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin text-purple-500" />
          )}
        </div>

        {query && (
          <div className="mt-3 flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              {filteredFriends.length} תוצאות עבור "{query}"
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="text-gray-500 hover:text-gray-700"
            >
              נקה חיפוש
            </Button>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {filteredFriends.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>תוצאות החיפוש</span>
            </div>
            <div className="grid gap-3">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.uid}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md"
                >
                  <Friend friend={friend} action="add" userId={userId} />
                </div>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              לא נמצאו תוצאות
            </h3>
            <p className="mb-4 text-gray-600">
              לא נמצאו חברים התואמים לחיפוש "{query}"
            </p>
            <Button onClick={handleClearSearch} variant="outline">
              נקה חיפוש
            </Button>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              חפש חברים חדשים
            </h3>
            <p className="text-gray-600">
              השתמש בחיפוש למעלה כדי למצוא חברים חדשים להוסיף
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriends;
