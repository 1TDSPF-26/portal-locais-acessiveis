import { AccessibilityProvider } from './contexts/AcessibilityContext'
import AppRoutes from './routes/AppRoutes'

function App() {
    return (

        <AccessibilityProvider>
            <AppRoutes />
    </AccessibilityProvider>
    );
}

export default App

