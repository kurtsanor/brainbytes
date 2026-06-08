import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/Button";

describe("Button", () => {
  it("shows loading text and disables the button while loading", () => {
    render(
      <Button isLoading loadingText="Saving...">
        Submit
      </Button>,
    );

    const button = screen.getByRole("button", { name: /saving/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
  });
});
