import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthWrapper from "@/components/auth/authWrapper";

describe("AuthWrapper Component", () => {
  it("renders children correctly", () => {
    const testChildren = <div data-testid="test-children">Test Content</div>;

    render(<AuthWrapper>{testChildren}</AuthWrapper>);

    expect(screen.getByTestId("test-children")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders symbol image with correct attributes", () => {
    render(
      <AuthWrapper>
        <div>Test</div>
      </AuthWrapper>,
    );

    const symbolImage = screen.getByAltText("symbol");
    expect(symbolImage).toBeInTheDocument();
    expect(symbolImage).toHaveAttribute("src", "/symbol.png");
    expect(symbolImage).toHaveAttribute("width", "100");
    expect(symbolImage).toHaveAttribute("height", "100");
  });

  it("renders logo image with correct attributes", () => {
    render(
      <AuthWrapper>
        <div>Test</div>
      </AuthWrapper>,
    );

    const logoImage = screen.getByAltText("Logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "/logo.png");
    expect(logoImage).toHaveAttribute("width", "100");
    expect(logoImage).toHaveAttribute("height", "100");
  });

  it("has correct container styling classes", () => {
    render(
      <AuthWrapper>
        <div data-testid="content">Test</div>
      </AuthWrapper>,
    );

    const container = screen.getByTestId("content").parentElement;
    expect(container).toHaveClass(
      "flex",
      "min-h-screen",
      "flex-col",
      "items-center",
      "px-6",
      "py-10",
    );
  });

  it("has correct symbol image positioning", () => {
    render(
      <AuthWrapper>
        <div>Test</div>
      </AuthWrapper>,
    );

    const symbolImage = screen.getByAltText("symbol");
    expect(symbolImage).toHaveClass("absolute", "top-0", "left-0", "z-1");
  });

  it("has correct logo container styling", () => {
    render(
      <AuthWrapper>
        <div>Test</div>
      </AuthWrapper>,
    );

    const logoImage = screen.getByAltText("Logo");
    const logoContainer = logoImage.parentElement;
    expect(logoContainer).toHaveClass(
      "flex",
      "w-full",
      "justify-center",
      "py-5",
    );
  });

  it("has correct logo styling", () => {
    render(
      <AuthWrapper>
        <div>Test</div>
      </AuthWrapper>,
    );

    const logoImage = screen.getByAltText("Logo");
    expect(logoImage).toHaveClass("mb-4", "rounded-full", "shadow-2xl");
  });
});
