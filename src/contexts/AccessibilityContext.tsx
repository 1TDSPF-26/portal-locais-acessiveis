import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

type FontSize = "small" | "default" | "large";

interface AccessibilityPreferences {
    fontSize: FontSize;
    highContrast: boolean;
}

interface AccessibilityContextData {
    fontSize: FontSize;
    highContrast: boolean;
    decreaseFontSize: () => void;
    resetFontSize: () => void;
    increaseFontSize: () => void;
    toggleHighContrast: () => void;
}

const STORAGE_KEY = "accessibility_preferences";

const defaultPreferences: AccessibilityPreferences = {
    fontSize: "default",
    highContrast: false,
};

const AccessibilityContext = createContext<
    AccessibilityContextData | undefined
>(undefined);

interface AccessibilityProviderProps {
    children: ReactNode;
}

export function AccessibilityProvider({
    children,
}: AccessibilityProviderProps) {
    const [fontSize, setFontSize] = useState<FontSize>(
        defaultPreferences.fontSize
    );

    const [highContrast, setHighContrast] = useState<boolean>(
        defaultPreferences.highContrast
    );

    useEffect(() => {
        const savedPreferences = localStorage.getItem(STORAGE_KEY);

        if (!savedPreferences) {
            return;
        }

        try {
            const preferences: AccessibilityPreferences =
                JSON.parse(savedPreferences);

            if (
                preferences.fontSize === "small" ||
                preferences.fontSize === "default" ||
                preferences.fontSize === "large"
            ) {
                setFontSize(preferences.fontSize);
            }

            if (typeof preferences.highContrast === "boolean") {
                setHighContrast(preferences.highContrast);
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

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

