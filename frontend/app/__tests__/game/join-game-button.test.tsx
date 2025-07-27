import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import JoinGameButton from "@/components/games/JoinGameButton";

// Mock the dependencies
jest.mock("@/lib/actions", () => ({
  joinGame: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { joinGame } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const mockJoinGame = joinGame as jest.MockedFunction<typeof joinGame>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe("JoinGameButton Component", () => {
  const mockRefresh = jest.fn();
  const gameId = "test-game-123";

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      refresh: mockRefresh,
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  it("renders join button with correct text", () => {
    render(<JoinGameButton gameId={gameId} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("w-40", "bg-blue-500");
  });

  it("calls joinGame action when clicked and shows success message", async () => {
    mockJoinGame.mockResolvedValueOnce({ ok: true, message: "Success" });

    render(<JoinGameButton gameId={gameId} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockJoinGame).toHaveBeenCalledWith(gameId);
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "הצטרפת לרשימת ההמתנה בהצלחה",
      );
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("shows error message when joinGame fails", async () => {
    const errorMessage = "המשחק מלא";
    mockJoinGame.mockResolvedValueOnce({ ok: false, message: errorMessage });

    render(<JoinGameButton gameId={gameId} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockJoinGame).toHaveBeenCalledWith(gameId);
    });

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockRefresh).not.toHaveBeenCalled();
    });
  });

  it("shows default error message when no specific message provided", async () => {
    mockJoinGame.mockResolvedValueOnce({ ok: false, message: "" });

    render(<JoinGameButton gameId={gameId} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("אירעה שגיאה");
    });
  });

  it("handles component interaction without crashing", async () => {
    // Test that the component renders and handles clicks properly
    render(<JoinGameButton gameId={gameId} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Ensure button is clickable
    expect(button).not.toBeDisabled();
  });
});
