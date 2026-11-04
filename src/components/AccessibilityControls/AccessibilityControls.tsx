import { useAccessibility } from "../../contexts/useAccessibility";
import "./AccessibilityControls.css";

export function AccessibilityControls() {
    const {
        fontSize,
        highContrast,
        decreaseFontSize,
        resetFontSize,
        increaseFontSize,
        toggleHighContrast,
        resetPreferences,
    } = useAccessibility();

    return (
        <div className="accessibilityControls" aria-label="Controles de acessibilidade">
            <button
                type="button"
                onClick={decreaseFontSize}
                aria-label="Diminuir tamanho da fonte"
            >
                A−
            </button>

            <button
                type="button"
                onClick={resetFontSize}
                aria-label="Restaurar tamanho padrão da fonte"
                aria-pressed={fontSize === "default"}
            >
                A
            </button>

            <button
                type="button"
                onClick={increaseFontSize}
                aria-label="Aumentar tamanho da fonte"
            >
                A+
            </button>

            <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={highContrast}
            >
                Alto contraste
            </button>

            <button
    type="button"
    onClick={resetPreferences}
    aria-label="Redefinir preferências de acessibilidade"
            >
    Redefinir preferências
</button>
        </div>
    );
}