import { fireEvent, render, screen } from "@testing-library/react";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("renders the input and submit button", () => {
    render(
      <SearchInput
        value=""
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /consultar previsão/i }),
    ).toBeInTheDocument();
  });

  it("propagates typing through onChange", () => {
    const handleChange = jest.fn();

    render(
      <SearchInput
        value=""
        onChange={handleChange}
        onSubmit={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "São Paulo" },
    });

    expect(handleChange).toHaveBeenCalledWith("São Paulo");
  });

  it("submits the trimmed value on form submit", () => {
    const handleSubmit = jest.fn();

    render(
      <SearchInput
        value="  Manaus  "
        onChange={jest.fn()}
        onSubmit={handleSubmit}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /consultar previsão/i }),
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith("Manaus");
  });

  it("disables the submit button when the value is empty", () => {
    render(
      <SearchInput
        value="   "
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /consultar previsão/i }),
    ).toBeDisabled();
  });

  it("disables input and button while loading", () => {
    const handleSubmit = jest.fn();

    render(
      <SearchInput
        value="Rio"
        onChange={jest.fn()}
        onSubmit={handleSubmit}
        loading
      />,
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
    const button = screen.getByRole("button", {
      name: /consultar previsão/i,
    });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
