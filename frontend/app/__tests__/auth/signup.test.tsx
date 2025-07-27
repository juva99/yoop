import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUp from "@/app/auth/signup/page";

// Mock the auth components
jest.mock("@/components/auth/signupForm", () => {
  return function MockSignupForm() {
    return <div data-testid="signup-form">Signup Form Mock</div>;
  };
});

jest.mock("@/components/auth/authWrapper", () => {
  return function MockAuthWrapper({ children }: { children: React.ReactNode }) {
    return <div data-testid="auth-wrapper">{children}</div>;
  };
});

describe("SignUp Page", () => {
  it("renders signup page with correct Hebrew text", () => {
    render(<SignUp />);

    // Check if the main heading text is rendered
    expect(
      screen.getByText("כמה פרטים קטנים ואתה על המגרש"),
    ).toBeInTheDocument();
  });

  it("renders signup form component", () => {
    render(<SignUp />);

    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });

  it("renders auth wrapper component", () => {
    render(<SignUp />);

    expect(screen.getByTestId("auth-wrapper")).toBeInTheDocument();
  });

  it("renders login link with correct text", () => {
    render(<SignUp />);

    expect(screen.getByText("כבר רשום למערכת?")).toBeInTheDocument();
    expect(screen.getByText("התחבר עכשיו")).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: "התחבר עכשיו" });
    expect(loginLink).toHaveAttribute("href", "/auth/login");
  });

  it("has proper styling classes on the login link", () => {
    render(<SignUp />);

    const loginLink = screen.getByRole("link", { name: "התחבר עכשיו" });
    expect(loginLink).toHaveClass(
      "font-medium",
      "text-blue-500",
      "underline",
      "hover:text-blue-700",
    );
  });

  it("has proper container styling", () => {
    render(<SignUp />);

    const linkContainer = screen.getByText("כבר רשום למערכת?").parentElement;
    expect(linkContainer).toHaveClass(
      "mt-4",
      "flex",
      "w-full",
      "items-center",
      "justify-center",
      "gap-1",
      "text-sm",
    );
  });
});
