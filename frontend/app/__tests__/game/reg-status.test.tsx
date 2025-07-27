import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegStatus from "@/components/games/RegStatus";

describe("RegStatus Component", () => {
  it("renders text and icon correctly", () => {
    const text = "פתוח להרשמה";
    const icon = <span data-testid="status-icon">🟢</span>;

    render(<RegStatus text={text} icon={icon} />);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByTestId("status-icon")).toBeInTheDocument();
    expect(screen.getByText("🟢")).toBeInTheDocument();
  });

  it("renders with different status - pending", () => {
    const text = "הרשמה עדיין לא נפתחה";
    const icon = <span data-testid="pending-icon">🟠</span>;

    render(<RegStatus text={text} icon={icon} />);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByTestId("pending-icon")).toBeInTheDocument();
  });

  it("renders with different status - closed", () => {
    const text = "ההרשמה סגורה";
    const icon = <span data-testid="closed-icon">🔴</span>;

    render(<RegStatus text={text} icon={icon} />);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByTestId("closed-icon")).toBeInTheDocument();
  });

  it("renders with custom icon element", () => {
    const text = "סטטוס מותאם";
    const customIcon = (
      <div data-testid="custom-icon" className="custom-class">
        Custom
      </div>
    );

    render(<RegStatus text={text} icon={customIcon} />);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.getByTestId("custom-icon")).toHaveClass("custom-class");
  });

  it("has correct layout classes", () => {
    const text = "טסט";
    const icon = <span>icon</span>;

    const { container } = render(<RegStatus text={text} icon={icon} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "items-center", "gap-2");
  });

  it("renders empty text correctly", () => {
    const text = "";
    const icon = <span data-testid="icon">🔵</span>;

    render(<RegStatus text={text} icon={icon} />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    // Just check that component renders without issues
    const wrapper = screen.getByTestId("icon").parentElement;
    expect(wrapper).toBeInTheDocument();
  });

  it("handles Hebrew text correctly", () => {
    const hebrewText = "המשחק הסתיים בהצלחה";
    const icon = <span>✅</span>;

    render(<RegStatus text={hebrewText} icon={icon} />);

    expect(screen.getByText(hebrewText)).toBeInTheDocument();
  });
});
