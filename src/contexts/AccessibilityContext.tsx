import {
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { AccessibilityContext } from "./AccessibilityContextValue";


type FontSize = "small" | "default" | "large";

interface AccessibilityPreferences {
    fontSize: FontSize;
    highContrast: boolean;
}



const STORAGE_KEY = "accessibility_preferences";

const defaultPreferences: AccessibilityPreferences = {
    fontSize: "default",
    highContrast: false,
};



interface AccessibilityProviderProps {
    children: ReactNode;
}

function getSavedPreferences(): AccessibilityPreferences {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);

    if (!savedPreferences) {
        return defaultPreferences;
    }

    try {
        const preferences: AccessibilityPreferences = JSON.parse(savedPreferences);

        return {
            fontSize:
                preferences.fontSize === "small" ||
                    preferences.fontSize === "default" ||
                    preferences.fontSize === "large"
                    ? preferences.fontSize
                    : defaultPreferences.fontSize,

            highContrast:
                typeof preferences.highContrast === "boolean"
                    ? preferences.highContrast
                    : defaultPreferences.highContrast,
        };
    } catch {
        return defaultPreferences;
    }
}


export function AccessibilityProvider({
    children,
}: AccessibilityProviderProps) {
    const [fontSize, setFontSize] = useState<FontSize>(
        () => getSavedPreferences().fontSize
    );

    const [highContrast, setHighContrast] = useState<boolean>(
        () => getSavedPreferences().highContrast
    );

    useEffect(() => {
        document.documentElement.dataset.fontSize = fontSize;
        document.documentElement.dataset.contrast = highContrast
            ? "high"
            : "normal";
    }, [fontSize, highContrast]);

    useEffect(() => {
        const preferences: AccessibilityPreferences = {
            fontSize,
            highContrast,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }, [fontSize, highContrast]);

    function decreaseFontSize() {
        setFontSize((currentSize) => {
            if (currentSize === "large") {
                return "default";
            }

            if (currentSize === "default") {
                return "small";
            }

            return "small";
        });
    }

    function resetFontSize() {
        setFontSize("default");
    }

    function increaseFontSize() {
        setFontSize((currentSize) => {
            if (currentSize === "small") {
                return "default";
            }

            if (currentSize === "default") {
                return "large";
            }

            return "large";
        });
    }

    function toggleHighContrast() {
        setHighContrast((currentValue) => !currentValue);
    }

    return (
        <AccessibilityContext.Provider
            value={{
                fontSize,
                highContrast,
                decreaseFontSize,
                resetFontSize,
                increaseFontSize,
                toggleHighContrast,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

