import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge.js";

describe("StatusBadge", () => {
  it("renders the truth state as visible text", () => {
    render(<StatusBadge kind="truth" value="planned" />);

    expect(screen.getByText("Planned")).toBeVisible();
  });

  it("renders the work state as visible text", () => {
    render(<StatusBadge kind="work" value="in-review" />);

    expect(screen.getByText("In review")).toBeVisible();
  });
});
