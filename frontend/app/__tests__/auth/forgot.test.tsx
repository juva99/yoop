import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPassword from "@/app/auth/forgot/page";

// Mock the auth components
jest.mock("@/components/auth/forgot-form", () => {
  return function MockForgotForm() {
    return <div data-testid="forgot-form">Forgot Password Form Mock</div>;
  };
});

jest.mock("@/components/auth/authWrapper", () => {
  return function MockAuthWrapper({ children }: { children: React.ReactNode }) {
    return <div data-testid="auth-wrapper">{children}</div>;
  };
});

describe("Forgot Password Page", () => {
  it("renders forgot password page with correct Hebrew text", () => {
    render(<ForgotPassword />);

    // Check if the main heading text is rendered
    expect(screen.getByText("שכחת את הסיסמה?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "הכנס את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה",
      ),
    ).toBeInTheDocument();
  });

  it("renders forgot form component", () => {
    render(<ForgotPassword />);

    expect(screen.getByTestId("forgot-form")).toBeInTheDocument();
  });

  it("renders auth wrapper component", () => {
    render(<ForgotPassword />);

    expect(screen.getByTestId("auth-wrapper")).toBeInTheDocument();
  });

  it("renders back to login link with correct text", () => {
    render(<ForgotPassword />);

    expect(screen.getByText("נזכרת בסיסמה?")).toBeInTheDocument();
    expect(screen.getByText("חזור להתחברות")).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: "חזור להתחברות" });
    expect(loginLink).toHaveAttribute("href", "/auth/login");
  });

  it("has proper heading styling", () => {
    render(<ForgotPassword />);

    const heading = screen.getByText("שכחת את הסיסמה?");
    expect(heading).toHaveClass("text-2xl", "font-bold");
  });

  it("has proper description styling", () => {
    render(<ForgotPassword />);

    const description = screen.getByText(
      "הכנס את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה",
    );
    expect(description).toHaveClass("mt-2", "text-gray-600");
  });

  it("has proper container styling for the form", () => {
    render(<ForgotPassword />);

    const formContainer = screen.getByTestId("forgot-form").parentElement;
    expect(formContainer).toHaveClass("mt-6", "w-full");
  });

  it("has proper link styling", () => {
    render(<ForgotPassword />);

    const loginLink = screen.getByRole("link", { name: "חזור להתחברות" });
    expect(loginLink).toHaveClass("text-title", "font-medium", "underline");
  });

  it("has proper text container styling", () => {
    render(<ForgotPassword />);

    const textContainer = screen.getByText("נזכרת בסיסמה?").parentElement;
    expect(textContainer).toHaveClass(
      "mt-4",
      "flex",
      "w-full",
      "items-center",
      "justify-center",
      "gap-1",
    );
  });
});
