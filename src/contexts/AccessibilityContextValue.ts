import { createContext } from "react";

export interface AccessibilityContextData {
    fontSize: "small" | "default" | "large";
    highContrast: boolean;
    decreaseFontSize: () => void;
    resetFontSize: () => void;
    increaseFontSize: () => void;
    toggleHighContrast: () => void;
}

export const AccessibilityContext =
    createContext<AccessibilityContextData | undefined>(undefined);