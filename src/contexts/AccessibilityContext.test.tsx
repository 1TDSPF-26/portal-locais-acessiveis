import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccessibilityProvider } from "./AccessibilityContext";
import { AccessibilityContext } from "./AccessibilityContextValue";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("AccessibilityProvider", () => {
    it("usa as preferências padrão quando o localStorage falha na leitura", () => {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("Armazenamento indisponível");
        });

        render(
            <AccessibilityProvider>
                <AccessibilityContext.Consumer>
                    {(value) => {
                        if (!value) {
                            throw new Error("Contexto indisponível");
                        }

                        return (
                            <div>
                                <span>{value.fontSize}</span>
                                <span>{String(value.highContrast)}</span>
                            </div>
                        );
                    }}
                </AccessibilityContext.Consumer>
            </AccessibilityProvider>
        );

        expect(screen.getByText("default")).toBeInTheDocument();
        expect(screen.getByText("false")).toBeInTheDocument();
    });

    it("continua funcionando quando o localStorage falha na gravação", () => {
        vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("Armazenamento indisponível");
        });

        render(
            <AccessibilityProvider>
                <AccessibilityContext.Consumer>
                    {(value) => {
                        if (!value) {
                            throw new Error("Contexto indisponível");
                        }

                        return (
                            <div>
                                <span>{value.fontSize}</span>
                                <span>{String(value.highContrast)}</span>
                                <button onClick={value.increaseFontSize}>
                                    Aumentar fonte
                                </button>
                            </div>
                        );
                    }}
                </AccessibilityContext.Consumer>
            </AccessibilityProvider>
        );

        expect(screen.getByText("default")).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", { name: "Aumentar fonte" })
        );

        expect(screen.getByText("large")).toBeInTheDocument();
    });
});