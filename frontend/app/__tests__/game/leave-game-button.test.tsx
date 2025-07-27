import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeaveGameButton from "@/components/games/LeaveGameButton";

// Mock the dependencies
jest.mock("@/lib/actions", () => ({
  leaveGame: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  redirect: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { leaveGame } from "@/lib/actions";
import { useRouter, redirect } from "next/navigation";
import { toast } from "sonner";

const mockLeaveGame = leaveGame as jest.MockedFunction<typeof leaveGame>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe("LeaveGameButton Component", () => {
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

  it("renders leave button with custom text", () => {
    const buttonText = "עזוב משחק";
    render(
      <LeaveGameButton gameId={gameId} text={buttonText} isCreator={false} />,
    );

    const button = screen.getByRole("button", { name: buttonText });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("w-40", "bg-red-400");
  });

  it("renders delete game button for creator", () => {
    const buttonText = "מחק משחק";
    render(
      <LeaveGameButton gameId={gameId} text={buttonText} isCreator={true} />,
    );

    const button = screen.getByRole("button", { name: buttonText });
    expect(button).toBeInTheDocument();
  });

  it("calls leaveGame action when clicked and shows success message", async () => {
    mockLeaveGame.mockResolvedValueOnce({ ok: true, message: "Success" });

    render(
      <LeaveGameButton gameId={gameId} text="עזוב משחק" isCreator={false} />,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLeaveGame).toHaveBeenCalledWith(gameId);
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith("יצאת מהמשחק בהצלחה");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("shows error message when leaveGame fails", async () => {
    const errorMessage = "לא ניתן לעזוב משחק זה";
    mockLeaveGame.mockResolvedValueOnce({ ok: false, message: errorMessage });

    render(
      <LeaveGameButton gameId={gameId} text="עזוב משחק" isCreator={false} />,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLeaveGame).toHaveBeenCalledWith(gameId);
    });

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockRefresh).not.toHaveBeenCalled();
    });
  });

  it("shows default error message when no specific message provided", async () => {
    mockLeaveGame.mockResolvedValueOnce({ ok: false, message: "" });

    render(
      <LeaveGameButton gameId={gameId} text="עזוב משחק" isCreator={false} />,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("אירעה שגיאה");
    });
  });

  it("redirects to home when creator leaves game successfully", async () => {
    mockLeaveGame.mockResolvedValueOnce({ ok: true, message: "Success" });

    render(
      <LeaveGameButton gameId={gameId} text="מחק משחק" isCreator={true} />,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLeaveGame).toHaveBeenCalledWith(gameId);
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith("יצאת מהמשחק בהצלחה");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });
  });

  it("does not redirect when non-creator leaves game", async () => {
    mockLeaveGame.mockResolvedValueOnce({ ok: true, message: "Success" });

    render(
      <LeaveGameButton gameId={gameId} text="עזוב משחק" isCreator={false} />,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLeaveGame).toHaveBeenCalledWith(gameId);
    });

    await waitFor(() => {
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("has correct wrapper styling", () => {
    const { container } = render(
      <LeaveGameButton gameId={gameId} text="עזוב משחק" isCreator={false} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "w-full", "flex-col", "items-center");
  });
});
