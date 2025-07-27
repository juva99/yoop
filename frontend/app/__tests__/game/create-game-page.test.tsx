import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateGamePage from "@/app/game/create/page";

// Mock the CreateGameForm component
jest.mock("@/components/games/createGame/create-game", () => {
  return function MockCreateGameForm() {
    return (
      <div data-testid="create-game-form">
        <h1>יצירת משחק חדש</h1>
        <form>
          <input placeholder="סוג משחק" />
          <input placeholder="עיר" />
          <input placeholder="מספר משתתפים מקסימלי" />
          <button type="submit">צור משחק</button>
        </form>
      </div>
    );
  };
});

describe("Create Game Page", () => {
  it("renders the create game page", () => {
    render(<CreateGamePage />);

    expect(screen.getByTestId("create-game-form")).toBeInTheDocument();
    expect(screen.getByText("יצירת משחק חדש")).toBeInTheDocument();
  });

  it("has proper page structure with padding", () => {
    const { container } = render(<CreateGamePage />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("px-5");
  });

  it("renders form elements through CreateGameForm component", () => {
    render(<CreateGamePage />);

    expect(screen.getByPlaceholderText("סוג משחק")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("עיר")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("מספר משתתפים מקסימלי"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "צור משחק" }),
    ).toBeInTheDocument();
  });
});
