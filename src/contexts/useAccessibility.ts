import { useContext } from "react";

import { AccessibilityContext } from "./AccessibilityContextValue";

export function useAccessibility() {
    const context = useContext(AccessibilityContext);

    if (!context) {
        throw new Error(
            "useAccessibility deve ser utilizado dentro de AccessibilityProvider"
        );
    }

    return context;
}