import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccessibilityProvider } from "./AccessibilityContext";
import { AccessibilityContext } from "./AccessibilityContextValue";

const STORAGE_KEY = "accessibility_preferences";

function renderizarProvider() {
    return render(
        <AccessibilityProvider>
            <AccessibilityContext.Consumer>
                {(value) => {
                    if (!value) {
                        throw new Error("Contexto indisponível");
                    }

                    return (
                        <div>
                            <span data-testid="font-size">
                                {value.fontSize}
                            </span>
                            <span data-testid="high-contrast">
                                {String(value.highContrast)}
                            </span>
                            <button onClick={value.increaseFontSize}>
                                Aumentar fonte
                            </button>
                            <button onClick={value.toggleHighContrast}>
                                Alternar contraste
                            </button>
                        </div>
                    );
                }}
            </AccessibilityContext.Consumer>
        </AccessibilityProvider>
    );
}

afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    delete document.documentElement.dataset.fontSize;
    delete document.documentElement.dataset.contrast;
});

describe("AccessibilityProvider", () => {
    it("usa as preferências padrão quando o localStorage falha na leitura", () => {
        const getItemSpy = vi
            .spyOn(Storage.prototype, "getItem")
            .mockImplementation(() => {
                throw new Error("Armazenamento indisponível");
            });
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        renderizarProvider();

        expect(getItemSpy).toHaveBeenCalled();
        expect(screen.getByTestId("font-size")).toHaveTextContent("default");
        expect(screen.getByTestId("high-contrast")).toHaveTextContent("false");
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("continua funcionando quando o localStorage falha na gravação", () => {
        vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
        const setItemSpy = vi
            .spyOn(Storage.prototype, "setItem")
            .mockImplementation(() => {
                throw new Error("Armazenamento indisponível");
            });
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        renderizarProvider();

        expect(screen.getByTestId("font-size")).toHaveTextContent("default");

        fireEvent.click(
            screen.getByRole("button", { name: "Aumentar fonte" })
        );
        fireEvent.click(
            screen.getByRole("button", { name: "Alternar contraste" })
        );

        expect(setItemSpy).toHaveBeenCalled();
        expect(screen.getByTestId("font-size")).toHaveTextContent("large");
        expect(screen.getByTestId("high-contrast")).toHaveTextContent("true");
        expect(document.documentElement.dataset.fontSize).toBe("large");
        expect(document.documentElement.dataset.contrast).toBe("high");
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("carrega e persiste as preferências quando o localStorage está disponível", () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ fontSize: "large", highContrast: true })
        );

        renderizarProvider();

        expect(screen.getByTestId("font-size")).toHaveTextContent("large");
        expect(screen.getByTestId("high-contrast")).toHaveTextContent("true");

        fireEvent.click(
            screen.getByRole("button", { name: "Alternar contraste" })
        );

        expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
            fontSize: "large",
            highContrast: false,
        });
    });
});