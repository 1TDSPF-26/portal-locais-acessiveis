import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/*ele faz com que o react-router funcione  para navegar entre as paginas do site*/}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
