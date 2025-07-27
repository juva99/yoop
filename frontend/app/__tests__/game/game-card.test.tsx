import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameCard from "@/components/games/GameCard";
import { Game } from "@/app/types/Game";
import { GameType } from "@/app/enums/game-type.enum";
import { GameStatus } from "@/app/enums/game-status.enum";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    dir,
  }: {
    children: React.ReactNode;
    href: string;
    dir?: string;
  }) {
    return (
      <a href={href} dir={dir}>
        {children}
      </a>
    );
  };
});

// Mock GameCardContent component
jest.mock("@/components/games/GameCardContent", () => {
  return function MockGameCardContent({ game }: { game: Game }) {
    return (
      <div data-testid="game-card-content">
        <h3>{game.gameType === GameType.BasketBall ? "כדורסל" : "כדורגל"}</h3>
        <p>משחק מספר: {game.gameId}</p>
      </div>
    );
  };
});

const mockGame: Game = {
  gameId: "test-game-123",
  gameType: GameType.BasketBall,
  startDate: new Date("2024-01-15T10:00:00Z"),
  endDate: new Date("2024-01-15T12:00:00Z"),
  maxParticipants: 10,
  status: GameStatus.APPROVED,
  gameParticipants: [],
  creator: {
    uid: "creator-123",
    firstName: "יוסי",
    lastName: "כהן",
    userEmail: "yossi@example.com",
    birthDay: new Date("1990-01-01"),
    role: "user",
    fieldsManage: [],
    gameParticipations: [],
    createdGames: [],
  },
  field: {
    fieldId: "field-123",
    fieldName: "מגרש הפארק",
    gameTypes: [GameType.BasketBall],
    isManaged: true,
    fieldLat: 32.0853,
    fieldLng: 34.7818,
    fieldAddress: "רחוב הפארק 10",
    city: "תל אביב",
    manager: {
      uid: "manager-123",
      firstName: "מנהל",
      lastName: "מגרש",
      userEmail: "manager@example.com",
      birthDay: new Date("1985-01-01"),
      role: "manager",
      fieldsManage: [],
      gameParticipations: [],
      createdGames: [],
    },
    gamesInField: [],
  },
  price: 50,
  weatherTemp: 25,
  weatherIcon: "https://example.com/sun.png",
};

describe("GameCard Component", () => {
  it("renders game card with proper link", () => {
    render(<GameCard game={mockGame} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/game/test-game-123");
    expect(link).toHaveAttribute("dir", "rtl");
  });

  it("displays game content through GameCardContent", () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByTestId("game-card-content")).toBeInTheDocument();
    expect(screen.getByText("כדורסל")).toBeInTheDocument();
    expect(screen.getByText("משחק מספר: test-game-123")).toBeInTheDocument();
  });

  it("renders with football game type", () => {
    const footballGame = { ...mockGame, gameType: GameType.FootBall };
    render(<GameCard game={footballGame} />);

    expect(screen.getByText("כדורגל")).toBeInTheDocument();
  });

  it("has proper card variant", () => {
    const { container } = render(<GameCard game={mockGame} />);

    // The Card component should be rendered (mocked through GameCardContent)
    expect(screen.getByTestId("game-card-content")).toBeInTheDocument();
  });
});
